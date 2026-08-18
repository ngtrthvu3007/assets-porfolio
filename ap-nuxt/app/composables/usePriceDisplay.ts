import { computed, type Ref } from "vue";
import type { PriceItem, PriceTableRow } from "@/types/prices";
import { formatCurrency, formatIsoTimestamp, formatSignedCurrency } from "@/utils/formatters";

interface UsePriceDisplayState {
  currentTime: Readonly<Ref<string | null>>;
  prices: Readonly<Ref<PriceItem[]>>;
}

export const usePriceDisplay = ({ currentTime, prices }: UsePriceDisplayState) => {
  const lastUpdatedAt = computed(() => formatIsoTimestamp(currentTime.value));

  const priceRows = computed<PriceTableRow[]>(() =>
    prices.value.map((price) => ({
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

  return { lastUpdatedAt, priceRows };
};
