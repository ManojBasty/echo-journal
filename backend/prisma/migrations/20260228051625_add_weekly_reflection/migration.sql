/*
  Warnings:

  - You are about to drop the column `analyzedAt` on the `Journal` table. All the data in the column will be lost.
  - You are about to drop the column `mood` on the `Journal` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Journal` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "WeeklyReflection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "overallTrend" TEXT NOT NULL,
    "recurringThemes" TEXT NOT NULL,
    "deepInsight" TEXT NOT NULL,
    "actionStep" TEXT NOT NULL,
    "weekStart" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "WeeklyReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Journal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Journal" ("content", "createdAt", "id", "title", "userId") SELECT "content", "createdAt", "id", "title", "userId" FROM "Journal";
DROP TABLE "Journal";
ALTER TABLE "new_Journal" RENAME TO "Journal";
CREATE INDEX "Journal_userId_idx" ON "Journal"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyReflection_userId_weekStart_key" ON "WeeklyReflection"("userId", "weekStart");

-- CreateIndex
CREATE INDEX "JournalAnalysis_journalId_idx" ON "JournalAnalysis"("journalId");

-- CreateIndex
CREATE INDEX "JournalAnalysis_analyzedAt_idx" ON "JournalAnalysis"("analyzedAt");

-- CreateIndex
CREATE INDEX "JournalAnalysis_journalId_analyzedAt_idx" ON "JournalAnalysis"("journalId", "analyzedAt");
