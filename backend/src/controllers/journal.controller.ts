import { Response } from "express";
import prisma from "../services/prisma";
import { journalSchema } from "../validators/journal.validator";
import { asyncHandler } from "../utils/asyncHandler";
import { analyzeJournalContent } from "../services/ai.service";
import { CustomRequest } from "../types/customRequest";

// CREATE JOURNAL
export const createJournal = asyncHandler(
  async (req: CustomRequest, res: Response) => {
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
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const journals = await prisma.journal.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      include: { analyses: true },
    });

    res.json(journals);
  }
);

// ANALYZE
export const analyzeJournal = asyncHandler(
  async (req: CustomRequest, res: Response) => {
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

    const aiResult = await analyzeJournalContent(journal.content);

    const newAnalysis = await prisma.journalAnalysis.create({
      data: {
        summary: aiResult.summary,
        mood: aiResult.mood,
        emotionalScore: aiResult.emotionalScore,
        reflectionPrompt: aiResult.reflectionPrompt,
        detectedPatterns: JSON.stringify(aiResult.detectedPatterns),
        aiModel: "llama",
        journalId: journal.id,
      },
    });

res.json(newAnalysis);
  }
);

// UPDATE JOURNAL
export const updateJournal = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const { id } = req.params;
    const parsed = journalSchema.parse(req.body);

    const journal = await prisma.journal.findFirst({
      where: { 
        id,
        userId: req.userId 
      },
    });

    if (!journal) {
      throw { status: 404, message: "Journal not found" };
    }

    const updatedJournal = await prisma.journal.update({
      where: { id },
      data: {
        title: parsed.title,
        content: parsed.content,
      },
      include: { analyses: true },
    });

    res.json(updatedJournal);
  }
);

// DELETE JOURNAL
export const deleteJournal = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      throw { status: 401, message: "Authentication required" };
    }

    const { id } = req.params;

    const journal = await prisma.journal.findFirst({
      where: { 
        id,
        userId: req.userId 
      },
    });

    if (!journal) {
      throw { status: 404, message: "Journal not found" };
    }

    await prisma.journal.delete({
      where: { id },
    });

    res.json({ message: "Journal deleted successfully" });
  }
);

