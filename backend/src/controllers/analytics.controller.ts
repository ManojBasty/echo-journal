import { Response } from "express";
import prisma from "../services/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { generateWeeklyReflection } from "../services/ai.service";
import { CustomRequest } from "../types/customRequest";

/**
 * GET /api/analytics/mood-trend
 */
export const getMoodTrend = asyncHandler(
  async (req: CustomRequest, res: Response) => {
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

res.json({
      totalAnalyses: total,
      averageEmotionalScore: Number(avgScore.toFixed(2)),
      moodDistribution: moodCount,
    });
  }
);

// GET LATEST ANALYSIS
export const getLatestAnalysis = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const latestAnalysis = await prisma.journalAnalysis.findFirst({
      where: {
        journal: { userId: req.userId }
      },
      orderBy: { analyzedAt: "desc" },
      include: {
        journal: {
          select: {
            title: true,
            content: true,
            createdAt: true
          }
        }
      }
    });

    if (!latestAnalysis) {
      return res.json({ message: "No analyses found" });
    }

    res.json(latestAnalysis);
  }
);

// GET DASHBOARD SUMMARY
export const getDashboardSummary = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const [journalCount, analysisCount, avgMood, latestJournals] = await Promise.all([
      prisma.journal.count({ where: { userId: req.userId } }),
      prisma.journalAnalysis.count({ 
        where: { 
          journal: { userId: req.userId } 
        } 
      }),
      prisma.journalAnalysis.aggregate({
        _avg: { emotionalScore: true },
        where: { journal: { userId: req.userId } }
      }),
      prisma.journal.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, createdAt: true }
      })
    ]);

    res.json({
      totalJournals: journalCount,
      totalAnalyses: analysisCount,
      averageMoodScore: Number((avgMood._avg.emotionalScore || 0).toFixed(2)),
      recentJournals: latestJournals
    });
  }
);

// GET WEEKLY REFLECTION
export const getWeeklyReflection = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const weeklyReflection = await prisma.weeklyReflection.findFirst({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" }
    });

    if (!weeklyReflection) {
      return res.json({ message: "No weekly reflections found" });
    }

    res.json(weeklyReflection);
  }
);

