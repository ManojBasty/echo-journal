import { Request, Response } from "express";
import prisma from "../services/prisma";
import { journalSchema } from "../validators/journal.validator";

// CREATE JOURNAL
export const createJournal = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const parsed = journalSchema.parse(req.body);

    const journal = await prisma.journal.create({
      data: {
        title: parsed.title,
        content: parsed.content,
        userId: req.userId,
      },
    });

    return res.status(201).json(journal);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// GET ALL JOURNALS (FOR AUTHENTICATED USER)
export const getJournals = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const journals = await prisma.journal.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(journals);
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE JOURNAL
export const updateJournal = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const parsed = journalSchema.parse(req.body);

    const journal = await prisma.journal.findUnique({
      where: { id },
    });

    if (!journal || journal.userId !== req.userId) {
      return res.status(404).json({
        message: "Journal not found",
      });
    }

    const updated = await prisma.journal.update({
      where: { id },
      data: {
        title: parsed.title,
        content: parsed.content,
      },
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE JOURNAL
export const deleteJournal = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const journal = await prisma.journal.findUnique({
      where: { id },
    });

    if (!journal || journal.userId !== req.userId) {
      return res.status(404).json({
        message: "Journal not found",
      });
    }

    await prisma.journal.delete({
      where: { id },
    });

    return res.json({
      message: "Journal deleted",
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
