import { computed, type Ref } from "vue";
import { ASSET_TYPE_LABELS } from "@/constants/prices";
import type { ApiSuccessResponse } from "@/types/api";
import type { LatestPricesResponse, PriceTableRow, PriceType, PriceTypesResponse } from "@/types/prices";
import { formatCurrency, formatIsoTimestamp, formatSignedCurrency } from "@/utils/formatters";

interface UsePriceDisplayState {
  data: Readonly<Ref<ApiSuccessResponse<LatestPricesResponse> | undefined>>;
  isFetching: Readonly<Ref<boolean>>;
  priceTypesData: Readonly<Ref<ApiSuccessResponse<PriceTypesResponse> | undefined>>;
}

export const usePriceDisplay = ({ data, isFetching, priceTypesData }: UsePriceDisplayState) => {
  const lastUpdatedAt = computed(() => formatIsoTimestamp(data.value?.data.currentTime ?? null));

  const priceTypes = computed<PriceType[]>(() =>
    (priceTypesData.value?.data.items ?? []).map((priceType) => ({
      ...priceType,
      label: ASSET_TYPE_LABELS[priceType.type] ?? priceType.label,
    })),
  );

  const priceRows = computed<PriceTableRow[]>(() =>
    (data.value?.data.items ?? []).map((price) => ({
      symbol: price.symbol,
      name: price.name,
      buy: formatCurrency(price.buyPrice ?? 0),
      sell: formatCurrency(price.sellPrice ?? 0),
      buyChange: formatSignedCurrency(price.buyChange ?? 0),
      sellChange: formatSignedCurrency(price.sellChange ?? 0),
      buyChangeClass: (price.buyChange ?? 0) >= 0 ? "text-accent" : "text-destructive",
      sellChangeClass: (price.sellChange ?? 0) >= 0 ? "text-accent" : "text-destructive",
      updatedAt: formatIsoTimestamp(price.sourceUpdatedAt),
    })),
  );

  const isInitialFetching = computed(() => isFetching.value && !priceRows.value.length);

  return { lastUpdatedAt, priceRows, priceTypes, isInitialFetching };
};
