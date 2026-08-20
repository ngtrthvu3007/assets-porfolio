import type { ApiSuccessResponse } from "@/types/api";
import type { PriceDetailQuery, PriceDetailResponse } from "@/types/prices";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const { type, symbol } = getRouterParams(event);
  const rawQuery = getQuery(event);

  const query: PriceDetailQuery = {
    range: rawQuery.range ? (String(rawQuery.range) as PriceDetailQuery["range"]) : undefined,
    startDate: rawQuery.startDate ? String(rawQuery.startDate) : undefined,
    endDate: rawQuery.endDate ? String(rawQuery.endDate) : undefined,
  };

  return $fetch<ApiSuccessResponse<PriceDetailResponse>>(
    BACKEND_ROUTES.prices.detail(String(type), String(symbol)),
    { baseURL: config.apiBase, query },
  );
});
