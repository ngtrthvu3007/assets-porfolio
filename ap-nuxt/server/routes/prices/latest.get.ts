import type { ApiSuccessResponse } from "@/types/api"
import type { LatestPricesQuery, LatestPricesResponse } from "@/types/prices"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const rawQuery = getQuery(event)

  // Only forward the fields the backend expects — never pass through
  // arbitrary client-supplied query params.
  const query: LatestPricesQuery = { type: String(rawQuery.type ?? "") }

  // BACKEND_ROUTES comes from server/utils/endpoints.ts — Nitro auto-imports
  // everything in server/utils/, so no explicit import is needed here.
  return $fetch<ApiSuccessResponse<LatestPricesResponse>>(BACKEND_ROUTES.prices.latest, {
    baseURL: config.apiBase,
    query,
  })
})
