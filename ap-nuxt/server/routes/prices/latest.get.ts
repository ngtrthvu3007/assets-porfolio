import type { ApiSuccessResponse } from "@/types/api";
import type { LatestPricesQuery, LatestPricesResponse } from "@/types/prices";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const rawQuery = getQuery(event);

  const query: LatestPricesQuery = { type: String(rawQuery.type ?? "") };

  return $fetch<ApiSuccessResponse<LatestPricesResponse>>(BACKEND_ROUTES.prices.latest, {
    baseURL: config.apiBase,
    query,
  });
});
