export const ASSET_TYPES = {
  crypto: "crypto",
  gold: "gold",
  stock: "stock",
} as const;

export type AssetType = "crypto" | "gold" | "stock";

export interface AssetIdentity {
  name: string;
  symbol: string;
  type: AssetType;
}
