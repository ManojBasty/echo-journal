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

    const analyses = await prisma.journalAnalysis.findMany({
      where: {
        journal: {
          userId: req.userId,
        },
        ...dateFilter,
      },
      orderBy: {
        analyzedAt: "desc",
      },
    });

    if (analyses.length === 0) {
      return res.json({
        message: "No analysis data available for this timeframe",
      });
    }

    const total = analyses.length;

    const avgScore =
      analyses.reduce((sum, a) => sum + a.emotionalScore, 0) / total;

    const moodCount: Record<string, number> = {};
    analyses.forEach((a) => {
      moodCount[a.mood] = (moodCount[a.mood] || 0) + 1;
    });

    const patternCount: Record<string, number> = {};
    analyses.forEach((a) => {
      try {
        const patterns: string[] = JSON.parse(a.detectedPatterns);
        patterns.forEach((p) => {
          patternCount[p] = (patternCount[p] || 0) + 1;
        });
      } catch {}
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
