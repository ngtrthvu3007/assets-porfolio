import type { LatestPricesQuery } from "@/types/prices"

export const DEFAULT_LATEST_PRICES_QUERY: LatestPricesQuery = { type: "gold" }

// vue-query cache keys — reuse these when invalidating/prefetching prices
// queries elsewhere, instead of writing the key array by hand.
export const PRICES_QUERY_KEYS = { latest: (type: string) => ["prices", "latest", type] as const }
