import type { MarketDataCollectionResult } from "../../types/marketData.js";
import { getErrorMessage } from "../../utils/errors.js";
import type { MarketDataCollector } from "./marketData.collector.js";
import { createIngestionRepo, createMarketQuotesRepo } from "./marketData.repository.js";

export const ingestMarketDataService = async (
  collector: MarketDataCollector,
): Promise<MarketDataCollectionResult | null> => {
  let result: MarketDataCollectionResult;

  const baseIngestionData = {
    sourceCode: collector.source,
    startedAt: new Date(),
  };

  try {
    result = await collector.collect();
  } catch (error) {
    await createIngestionRepo({
      ...baseIngestionData,
      completedAt: new Date(),
      errorMessage: getErrorMessage(error),
      status: "failed",
    });

    return null;
  }

  const ingestion = await createIngestionRepo({
    ...baseIngestionData,
    completedAt: new Date(),
    sourcePayload: result.sourcePayload,
    status: "success",
  });

  await createMarketQuotesRepo({
    collectedAt: result.collectedAt,
    ingestionId: ingestion.id,
    quotes: result.quotes,
    sourceId: ingestion.sourceId,
  });

  return result;
};
