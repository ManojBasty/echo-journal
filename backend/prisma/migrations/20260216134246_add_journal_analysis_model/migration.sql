-- CreateTable
CREATE TABLE "JournalAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "summary" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "emotionalScore" INTEGER NOT NULL,
    "reflectionPrompt" TEXT NOT NULL,
    "detectedPatterns" TEXT NOT NULL,
    "aiModel" TEXT NOT NULL,
    "analyzedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "journalId" TEXT NOT NULL,
    CONSTRAINT "JournalAnalysis_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
