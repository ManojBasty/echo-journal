import { Request, Response } from "express";
import prisma from "../services/prisma";
import { asyncHandler } from "../utils/asyncHandler";

export const getMoodTrend = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const daysParam = req.query.days as string | undefined;

    let dateFilter = {};

    if (daysParam) {
      const days = Number(daysParam);
      if (!isNaN(days) && days > 0) {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);

        dateFilter = {
          analyzedAt: {
            gte: fromDate,
          },
        };
      }
    }

    const whereCondition = {
      journal: {
        userId: req.userId,
      },
      ...dateFilter,
    };

    // 1️⃣ Total analyses count (DB level)
    const total = await prisma.journalAnalysis.count({
      where: whereCondition,
    });

    if (total === 0) {
      return res.json({
        message: "No analysis data available for this timeframe",
      });
    }

    // 2️⃣ Average emotional score (DB level)
    const avgResult = await prisma.journalAnalysis.aggregate({
      _avg: {
        emotionalScore: true,
      },
      where: whereCondition,
    });

    const avgScore = avgResult._avg.emotionalScore ?? 0;

    // 3️⃣ Mood distribution (DB level grouping)
    const moodGroup = await prisma.journalAnalysis.groupBy({
      by: ["mood"],
      _count: {
        mood: true,
      },
      where: whereCondition,
    });

    const moodCount: Record<string, number> = {};
    moodGroup.forEach((m) => {
      moodCount[m.mood] = m._count.mood;
    });

    // 4️⃣ Fetch only detectedPatterns for pattern processing
    const analyses = await prisma.journalAnalysis.findMany({
      where: whereCondition,
      select: {
        detectedPatterns: true,
      },
    });

    const patternCount: Record<string, number> = {};

    analyses.forEach((a) => {
      try {
        const patterns: string[] = JSON.parse(a.detectedPatterns);
        patterns.forEach((p) => {
          patternCount[p] = (patternCount[p] || 0) + 1;
        });
      } catch {
        // Ignore malformed JSON safely
      }
    });

    const mostCommonPattern =
      Object.entries(patternCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      null;

    let insight = "Your emotional trend is stable.";
    if (avgScore < 4) insight = "You’ve been emotionally low recently.";
    if (avgScore > 7) insight = "You’ve been emotionally positive lately.";

    res.json({
      timeframeDays: daysParam ? Number(daysParam) : "all",
      totalAnalyses: total,
      averageEmotionalScore: Number(avgScore.toFixed(2)),
      moodDistribution: moodCount,
      mostCommonPattern,
      insight,
    });
  }
);