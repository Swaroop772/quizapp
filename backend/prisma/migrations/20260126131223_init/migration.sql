-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "timeUsed" INTEGER NOT NULL,
    "percentage" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Score_percentage_timeUsed_idx" ON "Score"("percentage", "timeUsed");

-- CreateIndex
CREATE INDEX "Score_createdAt_idx" ON "Score"("createdAt");
