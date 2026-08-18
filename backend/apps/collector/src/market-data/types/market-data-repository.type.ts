import type { MarketQuote } from '@shared/types/market-data';

export interface CreateIngestionInput {
  completedAt: Date;
  errorMessage?: string;
  sourceCode: string;
  sourcePayload?: unknown;
  sourceUpdatedAt?: Date;
  startedAt: Date;
  status: 'failed' | 'no_change' | 'success';
}

export interface CreateMarketQuotesInput {
  collectedAt: Date;
  ingestionId: string;
  quotes: MarketQuote[];
  sourceId: string;
}

export interface HasMarketDataIngestionInput {
  sourceId: string;
  sourceUpdatedAt: Date;
}
