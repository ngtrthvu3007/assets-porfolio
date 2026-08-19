import type { ApiSuccessResponse } from "@/types/api"
import type { PriceTypesResponse } from "@/types/prices"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  // BACKEND_ROUTES comes from server/utils/endpoints.ts — Nitro auto-imports
  // everything in server/utils/, so no explicit import is needed here.
  return $fetch<ApiSuccessResponse<PriceTypesResponse>>(BACKEND_ROUTES.prices.types, {
    baseURL: config.apiBase,
  })
})
