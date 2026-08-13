import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import { fetchPrices } from "../api/pricesApi";
import {
  DEFAULT_PRICE_QUERY,
  PRICES_QUERY_KEYS,
  PRICES_STALE_TIME_MS,
} from "../constants/prices";
import type { PriceItem, PriceQuery, PricesData } from "../types/prices";

const EMPTY_PRICES_DATA: PricesData = {
  currentTime: 0,
  items: [],
};

export const usePricesQuery = (
  initialQuery: PriceQuery = DEFAULT_PRICE_QUERY,
) => {
  const query = useQuery({
    queryKey: PRICES_QUERY_KEYS.list(initialQuery),
    queryFn: () => fetchPrices(initialQuery),
    placeholderData: EMPTY_PRICES_DATA,
    retry: false,
    staleTime: PRICES_STALE_TIME_MS,
    refetchOnWindowFocus: true,
  });

  const currentTime = computed(() => query.data.value?.currentTime ?? null);
  const prices = computed<PriceItem[]>(() => query.data.value?.items ?? []);

  return {
    ...query,
    currentTime,
    prices,
  };
};
