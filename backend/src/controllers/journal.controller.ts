import { Request, Response } from "express";
import prisma from "../services/prisma";
import { journalSchema } from "../validators/journal.validator";
import { asyncHandler } from "../utils/asyncHandler";
import { analyzeJournalContent } from "../services/ai.service";

// CREATE JOURNAL
export const createJournal = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const parsed = journalSchema.parse(req.body);

    const journal = await prisma.journal.create({
      data: {
        title: parsed.title,
        content: parsed.content,
        userId: req.userId,
      },
    });

    res.status(201).json(journal);
  }
);

// GET ALL JOURNALS
export const getJournals = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const journals = await prisma.journal.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      include: {
        analyses: true,
      },
    });

    res.status(200).json(journals);
  }
);

// UPDATE JOURNAL
export const updateJournal = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const { id } = req.params;
    const parsed = journalSchema.parse(req.body);

    const journal = await prisma.journal.findUnique({
      where: { id },
    });

    if (!journal || journal.userId !== req.userId) {
      throw { status: 404, message: "Journal not found" };
    }

    const updated = await prisma.journal.update({
      where: { id },
      data: {
        title: parsed.title,
        content: parsed.content,
      },
    });

    res.json(updated);
  }
);

// DELETE JOURNAL
export const deleteJournal = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const { id } = req.params;

    const journal = await prisma.journal.findUnique({
      where: { id },
    });

    if (!journal || journal.userId !== req.userId) {
      throw { status: 404, message: "Journal not found" };
    }

    await prisma.journal.delete({
      where: { id },
    });

    res.json({
      message: "Journal deleted",
    });
  }
);

// ANALYZE JOURNAL
export const analyzeJournal = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const { id } = req.params;

    const journal = await prisma.journal.findUnique({
      where: { id },
      include: {
        analyses: {
          orderBy: { analyzedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!journal || journal.userId !== req.userId) {
      throw { status: 404, message: "Journal not found" };
    }

    const cooldownHours =
      Number(process.env.ANALYSIS_COOLDOWN_HOURS) || 24;

    const latestAnalysis = journal.analyses[0];

  if (latestAnalysis) {
  const now = new Date();
  const diffInMs =
    now.getTime() - latestAnalysis.analyzedAt.getTime();

  const diffInHours = diffInMs / (1000 * 60 * 60);
  const remainingHours = cooldownHours - diffInHours;

  if (diffInHours < cooldownHours) {
    return res.json({
      message: "Cooldown active",
      hoursRemaining: Number(remainingHours.toFixed(2)),
      journal,
      analysis: latestAnalysis,
    });
  }
}

    const aiResult = await analyzeJournalContent(journal.content);

 const normalizedMood = aiResult.mood.trim().toLowerCase();

const clampedScore = Math.max(
  0,
  Math.min(10, aiResult.emotionalScore)
);

const newAnalysis = await prisma.journalAnalysis.create({
  data: {
    summary: aiResult.summary.trim(),
    mood: normalizedMood,
    emotionalScore: clampedScore,
    reflectionPrompt: aiResult.reflectionPrompt.trim(),
    detectedPatterns: JSON.stringify(
      aiResult.detectedPatterns.map((p) =>
        p.trim().toLowerCase()
      )
    ),
    aiModel: "llama-3.1-8b-instant",
    journalId: journal.id,
  },
});

    res.json({
      message: "New analysis created",
      journal,
      analysis: newAnalysis,
    });
  }
);
