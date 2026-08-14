import { error as logError, log } from "../../libs/logger.js";
import type { MarketDataCollectionResult } from "../../types/marketData.js";
import { getErrorMessage } from "../../utils/errors.js";
import type { MarketDataCollector } from "./marketData.collector.js";
import {
  createIngestionRepo,
  createMarketQuotesRepo,
  getMarketDataSourceByCodeRepo,
  hasMarketDataIngestionRepo,
} from "./marketData.repository.js";

export const ingestMarketDataService = async (
  collector: MarketDataCollector,
): Promise<MarketDataCollectionResult | null> => {
  let result: MarketDataCollectionResult;

  const sourceCode = collector.source;
  const startedAt = new Date();

  log("ingestMarketDataService", `Starting market data collect: ${sourceCode}`);

  try {
    result = await collector.collect();
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    await createIngestionRepo({
      completedAt: new Date(),
      errorMessage,
      sourceCode,
      startedAt,
      status: "failed",
    });

    logError("ingestMarketDataService", `Market data collect failed: ${sourceCode} - ${errorMessage}`);

    return null;
  }

  const source = await getMarketDataSourceByCodeRepo(sourceCode);
  const sourceUpdatedAt = result.quotes[0]?.sourceUpdatedAt;
  const isDuplicate = sourceUpdatedAt
    ? await hasMarketDataIngestionRepo({ sourceId: source.id, sourceUpdatedAt })
    : false;

  /*
   * We always write MarketDataIngestion for monitoring.
   * If provider sourceUpdatedAt already exists, this collect is the same data version,
   * so it is marked no_change and MarketQuote is not created again.
   */
  const ingestion = await createIngestionRepo({
    completedAt: new Date(),
    sourceCode,
    sourcePayload: result.sourcePayload,
    sourceUpdatedAt,
    startedAt,
    status: isDuplicate ? "no_change" : "success",
  });

  if (isDuplicate) {
    log("ingestMarketDataService", `Market data collect completed: ${sourceCode} (no_change)`);

    return result;
  }

  await createMarketQuotesRepo({
    collectedAt: result.collectedAt,
    ingestionId: ingestion.id,
    quotes: result.quotes,
    sourceId: source.id,
  });

  log("ingestMarketDataService", `Market data collect completed: ${sourceCode} (${result.quotes.length} quotes)`);

  return result;
};
