import { computed, type Ref } from "vue";
import type { PriceItem, PriceTableRow } from "../types/prices";
import {
  formatCurrency,
  formatSignedCurrency,
  formatUnixTimestamp,
} from "../utils/formatters";

interface UsePriceDisplayState {
  currentTime: Readonly<Ref<number | null>>;
  prices: Readonly<Ref<PriceItem[]>>;
}

export const usePriceDisplay = ({
  currentTime,
  prices,
}: UsePriceDisplayState) => {
  const lastUpdatedAt = computed(() =>
    formatUnixTimestamp(currentTime.value),
  );

  const priceRows = computed<PriceTableRow[]>(() =>
    prices.value.map((price) => ({
      typeCode: price.type_code,
      buy: formatCurrency(price.buy),
      sell: formatCurrency(price.sell),
      buyChange: formatSignedCurrency(price.change_buy),
      sellChange: formatSignedCurrency(price.change_sell),
      buyChangeClass: price.change_buy >= 0 ? "text-success" : "text-error",
      sellChangeClass: price.change_sell >= 0 ? "text-success" : "text-error",
      updatedAt: formatUnixTimestamp(price.update_time),
    })),
  );

  return {
    lastUpdatedAt,
    priceRows,
  };
};
