import type { LatestPricesQuery } from "@/types/prices"

export const DEFAULT_LATEST_PRICES_QUERY: LatestPricesQuery = { type: "gold" }

// Vietnamese display labels for asset types — the backend's own label is
// derived from the raw type code (e.g. "GOLD"), so the UI maps it here
// instead. Unmapped types fall back to the backend-provided label.
export const ASSET_TYPE_LABELS: Record<string, string> = {
  gold: "Vàng",
  stock: "Cổ phiếu",
  crypto: "Tiền số",
}

// vue-query cache keys — reuse these when invalidating/prefetching prices
// queries elsewhere, instead of writing the key array by hand.
export const PRICES_QUERY_KEYS = {
  latest: (type: string) => ["prices", "latest", type] as const,
  types: ["prices", "types"] as const,
}
