import type { MaybeRefOrGetter } from "vue";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { computed, toValue } from "vue";
import { DEFAULT_STALE_TIME_MS } from "@/constants/default";
import { API_ROUTES } from "@/constants/endpoints";
import { DEFAULT_LATEST_PRICES_QUERY, PRICES_QUERY_KEYS } from "@/constants/prices";
import type { ApiSuccessResponse } from "@/types/api";
import type {
  LatestPricesQuery,
  LatestPricesResponse,
  ListPricesQuery,
  ListPricesResponse,
  PriceDetailParams,
  PriceDetailQuery,
  PriceDetailResponse,
  PriceTypesResponse,
} from "@/types/prices";
import { apiFetch } from "@/utils/apiFetch";

const pricesQueryOptions = (query: LatestPricesQuery) => ({
  queryKey: PRICES_QUERY_KEYS.latest(query.type),
  queryFn: () => apiFetch<ApiSuccessResponse<LatestPricesResponse>>(API_ROUTES.prices.latest, { query }),
  staleTime: DEFAULT_STALE_TIME_MS,
});

const priceTypesQueryOptions = () => ({
  queryKey: PRICES_QUERY_KEYS.types,
  queryFn: () => apiFetch<ApiSuccessResponse<PriceTypesResponse>>(API_ROUTES.prices.types),
  staleTime: DEFAULT_STALE_TIME_MS,
});

const priceDetailQueryOptions = (params: PriceDetailParams, query: PriceDetailQuery) => ({
  queryKey: PRICES_QUERY_KEYS.detail(params.type, params.symbol, query.range),
  queryFn: () =>
    apiFetch<ApiSuccessResponse<PriceDetailResponse>>(
      API_ROUTES.prices.detail(params.type, params.symbol),
      { query },
    ),
  staleTime: DEFAULT_STALE_TIME_MS,
});

export const usePrices = (query: LatestPricesQuery = DEFAULT_LATEST_PRICES_QUERY) => {
  return useQuery({ ...pricesQueryOptions(query), placeholderData: keepPreviousData });
};

export const usePriceTypes = () => useQuery(priceTypesQueryOptions());

export const useListPrices = (query: MaybeRefOrGetter<ListPricesQuery>) => {
  const queryKey = computed(() => {
    const { type, q, page, pageSize, sort, order } = toValue(query);
    return PRICES_QUERY_KEYS.list(type, q, page, pageSize, sort, order);
  });

  return useQuery({
    queryKey,
    queryFn: () =>
      apiFetch<ApiSuccessResponse<ListPricesResponse>>(API_ROUTES.prices.list, {
        query: toValue(query),
      }),
    staleTime: DEFAULT_STALE_TIME_MS,
    placeholderData: keepPreviousData,
  });
};

export const usePriceDetail = (
  params: MaybeRefOrGetter<PriceDetailParams>,
  query: MaybeRefOrGetter<PriceDetailQuery> = {},
) => {
  const queryKey = computed(() => {
    const { type, symbol } = toValue(params);
    const { range } = toValue(query);
    return PRICES_QUERY_KEYS.detail(type, symbol, range);
  });

  return useQuery({
    queryKey,
    queryFn: () =>
      apiFetch<ApiSuccessResponse<PriceDetailResponse>>(
        API_ROUTES.prices.detail(toValue(params).type, toValue(params).symbol),
        { query: toValue(query) },
      ),
    staleTime: DEFAULT_STALE_TIME_MS,
    placeholderData: keepPreviousData,
  });
};

export const prefetchPrices = (query: LatestPricesQuery = DEFAULT_LATEST_PRICES_QUERY) =>
  usePrefetchQuery(pricesQueryOptions(query));

export const prefetchPriceTypes = () => usePrefetchQuery(priceTypesQueryOptions());

export const prefetchPriceDetail = (params: PriceDetailParams, query: PriceDetailQuery = {}) =>
  usePrefetchQuery(priceDetailQueryOptions(params, query));
