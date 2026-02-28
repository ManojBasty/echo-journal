import { Request, Response } from "express";
import prisma from "../services/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { generateWeeklyReflection } from "../services/ai.service";

/**
 * GET /api/analytics/mood-trend
 */
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
          analyzedAt: { gte: fromDate },
        };
      }
    }

    const whereCondition = {
      journal: { userId: req.userId },
      ...dateFilter,
    };

    const total = await prisma.journalAnalysis.count({
      where: whereCondition,
    });

    if (total === 0) {
      return res.json({
        message: "No analysis data available for this timeframe",
      });
    }

    const avgResult = await prisma.journalAnalysis.aggregate({
      _avg: { emotionalScore: true },
      where: whereCondition,
    });

    const avgScore = avgResult._avg.emotionalScore ?? 0;

    const moodGroup = await prisma.journalAnalysis.groupBy({
      by: ["mood"],
      _count: { mood: true },
      where: whereCondition,
    });

    const moodCount: Record<string, number> = {};
    moodGroup.forEach((m) => {
      moodCount[m.mood] = m._count.mood;
    });

    const analyses = await prisma.journalAnalysis.findMany({
      where: whereCondition,
      select: { detectedPatterns: true },
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

/**
 * GET /api/analytics/latest-analysis
 */
export const getLatestAnalysis = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const latest = await prisma.journalAnalysis.findFirst({
      where: {
        journal: { userId: req.userId },
      },
      orderBy: { analyzedAt: "desc" },
      include: {
        journal: {
          select: { id: true, title: true },
        },
      },
    });

    if (!latest) {
      return res.json({
        message: "No analysis data available yet",
      });
    }

    res.json({
      journalId: latest.journal.id,
      journalTitle: latest.journal.title,
      summary: latest.summary,
      mood: latest.mood,
      emotionalScore: latest.emotionalScore,
      reflectionPrompt: latest.reflectionPrompt,
      analyzedAt: latest.analyzedAt,
      aiModel: latest.aiModel,
    });
  }
);

/**
 * GET /api/analytics/dashboard-summary
 */
export const getDashboardSummary = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const userId = req.userId;

    const totalJournals = await prisma.journal.count({
      where: { userId },
    });

    const totalAnalyses = await prisma.journalAnalysis.count({
      where: {
        journal: { userId },
      },
    });

    const latest = await prisma.journalAnalysis.findFirst({
      where: {
        journal: { userId },
      },
      orderBy: { analyzedAt: "desc" },
      include: {
        journal: { select: { id: true, title: true } },
      },
    });

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);

    const avgResult = await prisma.journalAnalysis.aggregate({
      _avg: { emotionalScore: true },
      where: {
        journal: { userId },
        analyzedAt: { gte: fromDate },
      },
    });

    const avgScore = avgResult._avg.emotionalScore ?? 0;

    res.json({
      totalJournals,
      totalAnalyses,
      averageEmotionalScoreLast7Days: Number(avgScore.toFixed(2)),
      latestAnalysis: latest
        ? {
            journalId: latest.journal.id,
            journalTitle: latest.journal.title,
            mood: latest.mood,
            emotionalScore: latest.emotionalScore,
            summary: latest.summary,
            analyzedAt: latest.analyzedAt,
          }
        : null,
    });
  }
);

/**
 * GET /api/analytics/weekly-reflection
 * Generates once per calendar week (Monday-based)
 */
export const getWeeklyReflection = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const userId = req.userId;

    // 🔹 Calculate Monday-based week start
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diffToMonday);
    weekStart.setHours(0, 0, 0, 0);

    // 🔹 Check if already exists
    const existing = await prisma.weeklyReflection.findUnique({
      where: {
        userId_weekStart: {
          userId,
          weekStart,
        },
      },
    });

    if (existing) {
      return res.json({
        message: "Weekly reflection already generated",
        weeklyReflection: {
          ...existing,
          recurringThemes: JSON.parse(existing.recurringThemes),
        },
      });
    }

    // 🔹 Fetch last 7 days analyses
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);

    const analyses = await prisma.journalAnalysis.findMany({
      where: {
        journal: { userId },
        analyzedAt: { gte: fromDate },
      },
    });

    if (analyses.length === 0) {
      return res.json({
        message: "No analysis data available for this week",
      });
    }

    const combinedSummaries = analyses.map((a) => a.summary).join("\n");

    const combinedPatterns: string[] = [];
    analyses.forEach((a) => {
      try {
        const parsed: string[] = JSON.parse(a.detectedPatterns);
        combinedPatterns.push(...parsed);
      } catch {}
    });

    const prompt = `
Summaries:
${combinedSummaries}

Detected Patterns:
${combinedPatterns.join(", ")}
`;

    const weeklyStructured = await generateWeeklyReflection(prompt);

    const created = await prisma.weeklyReflection.create({
      data: {
        overallTrend: weeklyStructured.overallTrend,
        recurringThemes: JSON.stringify(
          weeklyStructured.recurringThemes
        ),
        deepInsight: weeklyStructured.deepInsight,
        actionStep: weeklyStructured.actionStep,
        weekStart,
        userId,
      },
    });

    res.json({
      message: "Weekly reflection generated",
      weeklyReflection: {
        ...created,
        recurringThemes: weeklyStructured.recurringThemes,
      },
    });
  }
);