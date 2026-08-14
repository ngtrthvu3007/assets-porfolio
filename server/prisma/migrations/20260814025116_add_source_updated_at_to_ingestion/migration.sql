-- AlterTable
ALTER TABLE "MarketDataIngestion" ADD COLUMN "sourceUpdatedAt" DATETIME;

-- CreateIndex
CREATE INDEX "MarketDataIngestion_sourceId_sourceUpdatedAt_idx" ON "MarketDataIngestion"("sourceId", "sourceUpdatedAt");
