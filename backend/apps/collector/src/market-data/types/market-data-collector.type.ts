import type { MarketDataCollectionResult } from '@shared/types/market-data';

export interface MarketDataCollector {
  collect: () => Promise<MarketDataCollectionResult>;
  cronExpression: string;
  source: string;
}
