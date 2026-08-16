import type { AssetIdentity } from "./assets.js";

export interface MarketQuote {
  asset: AssetIdentity;
  buyChange: number | null;
  buyPrice: number | null;
  sellChange: number | null;
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
