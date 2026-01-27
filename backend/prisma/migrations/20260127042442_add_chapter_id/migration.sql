-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "chapterId" TEXT NOT NULL DEFAULT 'overall';

-- CreateIndex
CREATE INDEX "Score_chapterId_idx" ON "Score"("chapterId");
