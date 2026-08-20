import { computed, type Ref } from "vue";
import type { ApiSuccessResponse } from "@/types/api";
import type { PriceDetailResponse, PriceHistoryPoint } from "@/types/prices";
import { formatCurrency, formatIsoDate, formatIsoTimestamp, formatSignedCurrency } from "@/utils/formatters";

interface UseDetailPriceDisplayState {
  data: Readonly<Ref<ApiSuccessResponse<PriceDetailResponse> | undefined>>;
  isFetching: Readonly<Ref<boolean>>;
}

const toChangeClass = (change: number | null | undefined) =>
  (change ?? 0) >= 0 ? "text-accent" : "text-destructive";

export const useDetailPriceDisplay = ({ data, isFetching }: UseDetailPriceDisplayState) => {
  const asset = computed(() => data.value?.data.asset);
  const stats = computed(() => data.value?.data.stats);
  const latest = computed(() => data.value?.data.latest);
  const history = computed<PriceHistoryPoint[]>(() => data.value?.data.history ?? []);

  const lastUpdatedAt = computed(() => formatIsoTimestamp(latest.value?.sourceUpdatedAt ?? null));

  const dateRangeLabel = computed(() => {
    if (!history.value.length) return "";

    const startDate = formatIsoDate(history.value[0]?.sourceUpdatedAt ?? null);
    const endDate = formatIsoDate(history.value[history.value.length - 1]?.sourceUpdatedAt ?? null);

    return startDate === endDate ? startDate : `${startDate} - ${endDate}`;
  });

  const buy = computed(() => ({
    price: formatCurrency(latest.value?.buyPrice ?? 0),
    change: formatSignedCurrency(latest.value?.buyChange ?? 0),
    changeClass: toChangeClass(latest.value?.buyChange),
    isPositive: (latest.value?.buyChange ?? 0) >= 0,
    open: formatCurrency(stats.value?.buyOpen ?? 0),
    close: formatCurrency(stats.value?.buyClose ?? 0),
    changePercent: stats.value?.buyChangePercent ?? null,
    changePercentClass: toChangeClass(stats.value?.buyChangePercent),
    isChangePercentPositive: (stats.value?.buyChangePercent ?? 0) >= 0,
  }));

  const sell = computed(() => ({
    price: formatCurrency(latest.value?.sellPrice ?? 0),
    change: formatSignedCurrency(latest.value?.sellChange ?? 0),
    changeClass: toChangeClass(latest.value?.sellChange),
    isPositive: (latest.value?.sellChange ?? 0) >= 0,
    open: formatCurrency(stats.value?.sellOpen ?? 0),
    close: formatCurrency(stats.value?.sellClose ?? 0),
    changePercent: stats.value?.sellChangePercent ?? null,
    changePercentClass: toChangeClass(stats.value?.sellChangePercent),
    isChangePercentPositive: (stats.value?.sellChangePercent ?? 0) >= 0,
  }));

  const isInitialFetching = computed(() => isFetching.value && !data.value);
  const hasRangeStats = computed(() => stats.value?.buyOpen !== null && stats.value?.buyOpen !== undefined);

  return {
    asset,
    stats,
    lastUpdatedAt,
    dateRangeLabel,
    hasRangeStats,
    buy,
    sell,
    history,
    isInitialFetching,
  };
};
