export const ASSET_TYPES = {
  crypto: 'crypto',
  etf: 'etf',
  gold: 'gold',
} as const;

export type AssetType = (typeof ASSET_TYPES)[keyof typeof ASSET_TYPES];
