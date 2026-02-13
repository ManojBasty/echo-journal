import { Request, Response } from "express";
import prisma from "../services/prisma";
import { journalSchema } from "../validators/journal.validator";
import { asyncHandler } from "../utils/asyncHandler";

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
