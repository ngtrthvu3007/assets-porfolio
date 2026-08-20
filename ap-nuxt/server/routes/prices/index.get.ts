import type { ApiSuccessResponse } from "@/types/api";
import type { ListPricesQuery, ListPricesResponse } from "@/types/prices";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const rawQuery = getQuery(event);

  const query: ListPricesQuery = {
    type: String(rawQuery.type ?? ""),
    q: rawQuery.q ? String(rawQuery.q) : undefined,
    sort: rawQuery.sort ? (String(rawQuery.sort) as ListPricesQuery["sort"]) : undefined,
    order: rawQuery.order ? (String(rawQuery.order) as ListPricesQuery["order"]) : undefined,
    page: rawQuery.page ? Number(rawQuery.page) : undefined,
    pageSize: rawQuery.pageSize ? Number(rawQuery.pageSize) : undefined,
  };

  return $fetch<ApiSuccessResponse<ListPricesResponse>>(BACKEND_ROUTES.prices.list, {
    baseURL: config.apiBase,
    query,
  });
});
