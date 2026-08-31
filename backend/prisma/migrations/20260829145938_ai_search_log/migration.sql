-- CreateEnum
CREATE TYPE "AiSearchOutcome" AS ENUM ('SUCCESS', 'FALLBACK');

-- CreateTable
CREATE TABLE "AiSearchLog" (
    "id" TEXT NOT NULL,
    "rawQuery" TEXT NOT NULL,
    "outcome" "AiSearchOutcome" NOT NULL,
    "failureReason" TEXT,
    "latencyMs" INTEGER,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiSearchLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiSearchLog_outcome_createdAt_idx" ON "AiSearchLog"("outcome", "createdAt");
