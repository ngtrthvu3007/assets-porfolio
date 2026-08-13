import type { MarketDataCollectionResult } from "../../types/marketData.js";
import { VangTodayCollector } from "./collectors/vangToday.collector.js";
import { ingestMarketDataService } from "./marketDataIngestion.service.js";

export interface MarketDataCollector {
  collect: () => Promise<MarketDataCollectionResult>;
  cronExpression: string;
  source: string;
}

export const marketDataCollectors: MarketDataCollector[] = [
  new VangTodayCollector(),
];

export const marketDataCollectorCollectBySource = async (
  source: string,
): Promise<MarketDataCollectionResult | null> => {
  const collector = marketDataCollectors.find(
    (marketDataCollector) => marketDataCollector.source === source,
  );

  if (!collector) {
    throw new Error(`Market data collector not found: ${source}`);
  }

  return ingestMarketDataService(collector);
};
