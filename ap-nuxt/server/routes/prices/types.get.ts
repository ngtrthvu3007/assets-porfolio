import type { ApiSuccessResponse } from "@/types/api";
import type { PriceTypesResponse } from "@/types/prices";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  return $fetch<ApiSuccessResponse<PriceTypesResponse>>(BACKEND_ROUTES.prices.types, {
    baseURL: config.apiBase,
  });
});
