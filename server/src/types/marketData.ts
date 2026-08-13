import type { AssetIdentity } from "./assets.js";

export interface MarketQuote {
  asset: AssetIdentity;
  buyPrice: number | null;
  sellPrice: number | null;
  source: string;
  sourceUpdatedAt: Date;
}

export interface MarketDataCollectionResult {
  collectedAt: Date;
  quotes: MarketQuote[];
  source: string;
  sourcePayload: unknown;
}
