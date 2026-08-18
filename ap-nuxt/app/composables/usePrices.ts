import { keepPreviousData, useQuery } from "@tanstack/vue-query"
import { DEFAULT_STALE_TIME_MS } from "@/constants/default"
import { API_ROUTES } from "@/constants/endpoints"
import { DEFAULT_LATEST_PRICES_QUERY, PRICES_QUERY_KEYS } from "@/constants/prices"
import type { ApiSuccessResponse } from "@/types/api"
import type { LatestPricesQuery, LatestPricesResponse } from "@/types/prices"
import { apiFetch } from "@/utils/apiFetch"

const pricesQueryOptions = (query: LatestPricesQuery) => ({
  queryKey: PRICES_QUERY_KEYS.latest(query.type),
  // Calls this app's own route (Nitro proxy), never the backend directly —
  // the backend base URL stays server-only in server/routes/prices/latest.get.ts.
  // apiFetch centralizes error-toast handling for every API call.
  queryFn: () => apiFetch<ApiSuccessResponse<LatestPricesResponse>>(API_ROUTES.prices.latest, { query }),
  staleTime: DEFAULT_STALE_TIME_MS,
})

export const usePrices = (query: LatestPricesQuery = DEFAULT_LATEST_PRICES_QUERY) => {
  return useQuery({ ...pricesQueryOptions(query), placeholderData: keepPreviousData })
}

export const prefetchPrices = (query: LatestPricesQuery = DEFAULT_LATEST_PRICES_QUERY) =>
  usePrefetchQuery(pricesQueryOptions(query))
