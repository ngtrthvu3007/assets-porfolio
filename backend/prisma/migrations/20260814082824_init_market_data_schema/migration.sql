-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "MarketDataSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "MarketDataIngestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sourcePayload" JSONB,
    "errorMessage" TEXT,
    "startedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "sourceUpdatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "MarketDataIngestion_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "MarketDataSource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MarketQuote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ingestionId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "buyPrice" DECIMAL,
    "sellPrice" DECIMAL,
    "buyChange" DECIMAL,
    "sellChange" DECIMAL,
    "sourceUpdatedAt" DATETIME NOT NULL,
    "collectedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "MarketQuote_ingestionId_fkey" FOREIGN KEY ("ingestionId") REFERENCES "MarketDataIngestion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MarketQuote_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MarketQuote_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "MarketDataSource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_symbol_key" ON "Asset"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "MarketDataSource_code_key" ON "MarketDataSource"("code");

-- CreateIndex
CREATE INDEX "MarketDataIngestion_sourceId_startedAt_idx" ON "MarketDataIngestion"("sourceId", "startedAt");

-- CreateIndex
CREATE INDEX "MarketDataIngestion_sourceId_sourceUpdatedAt_idx" ON "MarketDataIngestion"("sourceId", "sourceUpdatedAt");

-- CreateIndex
CREATE INDEX "MarketDataIngestion_status_startedAt_idx" ON "MarketDataIngestion"("status", "startedAt");

-- CreateIndex
CREATE INDEX "MarketDataIngestion_deletedAt_idx" ON "MarketDataIngestion"("deletedAt");

-- CreateIndex
CREATE INDEX "MarketQuote_assetId_sourceId_sourceUpdatedAt_idx" ON "MarketQuote"("assetId", "sourceId", "sourceUpdatedAt");

-- CreateIndex
CREATE INDEX "MarketQuote_sourceId_collectedAt_idx" ON "MarketQuote"("sourceId", "collectedAt");

-- CreateIndex
CREATE INDEX "MarketQuote_ingestionId_idx" ON "MarketQuote"("ingestionId");

-- CreateIndex
CREATE INDEX "MarketQuote_deletedAt_idx" ON "MarketQuote"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MarketQuote_assetId_sourceId_sourceUpdatedAt_key" ON "MarketQuote"("assetId", "sourceId", "sourceUpdatedAt");
