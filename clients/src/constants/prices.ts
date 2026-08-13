import type { PriceQuery } from "../types/prices";

export const PRICES_ENDPOINT = "/prices";
export const PRICES_STALE_TIME_MS = 60_000;

export const DEFAULT_PRICE_QUERY: PriceQuery = {
  action: "current",
};

export const PRICES_QUERY_KEYS = {
  all: ["prices"] as const,
  list: (query: PriceQuery) => [...PRICES_QUERY_KEYS.all, query] as const,
};
