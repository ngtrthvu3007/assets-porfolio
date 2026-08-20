<script setup lang="ts">
import { ArrowLeftIcon, ListFilterIcon, LoaderCircleIcon, RefreshCwIcon } from "@lucide/vue";
import { computed } from "vue";
import { useDetailPriceDisplay } from "@/composables/useDetailPriceDisplay";
import { prefetchPriceDetail, usePriceDetail } from "@/composables/usePrices";
import { PRICE_DETAIL_RANGE_OPTIONS } from "@/constants/prices";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PriceDetailRange } from "@/types/prices";

const route = useRoute();

const type = computed(() => String(route.params.type ?? ""));
const symbol = computed(() => String(route.params.symbol ?? ""));
const range = computed(() => (route.query.range as PriceDetailRange | undefined) ?? "today");

useBreadcrumbs().setBreadcrumbs([{ label: "Markets", to: "/" }, { label: symbol.value }]);

await prefetchPriceDetail({ type: type.value, symbol: symbol.value }, { range: range.value });

const { data, isFetching, refetch } = usePriceDetail(
  () => ({ type: type.value, symbol: symbol.value }),
  () => ({ range: range.value }),
);

const { asset, lastUpdatedAt, dateRangeLabel, hasRangeStats, buy, sell, history, isInitialFetching } =
  useDetailPriceDisplay({ data, isFetching });

const setRange = (value: PriceDetailRange) => {
  navigateTo({ query: { ...route.query, range: value } });
};

const rangeLabel = computed(
  () => PRICE_DETAIL_RANGE_OPTIONS.find((option) => option.value === range.value)?.label ?? "",
);

useSeoMeta({
  title: `${symbol.value} - Chi tiết giá - Asset Portfolio`,
  description: `Chi tiết biến động giá ${symbol.value} theo thời gian.`,
});
</script>

<template>
  <section class="w-full">
    <div class="mb-4 flex items-center gap-2">
      <Button as-child variant="outline" size="sm">
        <NuxtLink to="/">
          <ArrowLeftIcon class="h-4 w-4" />
        </NuxtLink>
      </Button>
    </div>

    <div v-if="isInitialFetching" class="flex min-h-64 items-center justify-center">
      <LoaderCircleIcon class="h-8 w-8 animate-spin text-primary" />
    </div>

    <div v-else-if="!asset" class="p-4">
      <Alert>
        <AlertDescription>Không tìm thấy dữ liệu giá.</AlertDescription>
      </Alert>
    </div>

    <template v-else>
      <div class="mb-4 flex items-center gap-2">
        <Badge variant="outline" class="font-semibold">{{ asset.symbol }}</Badge>
        <h1 class="text-lg font-semibold">{{ asset.name }}</h1>
        <span class="text-sm text-muted-foreground">{{ formatCapitalLetter(asset.type) }}</span>
        <span class="ml-auto text-xs font-semibold text-muted-foreground"
          >Cập nhật: {{ lastUpdatedAt }}</span
        >
      </div>

      <Grid class="mb-4">
        <PriceStatCard
          class="col-span-4 md:col-span-4 xl:col-span-6"
          title="Giá hiện tại"
          :buy="{
            label: 'Mua vào',
            primary: buy.price,
            secondary: buy.change,
            secondaryClass: buy.changeClass,
            isPositive: buy.isPositive,
          }"
          :sell="{
            label: 'Bán ra',
            primary: sell.price,
            secondary: sell.change,
            secondaryClass: sell.changeClass,
            isPositive: sell.isPositive,
          }" />

        <PriceStatCard
          class="col-span-4 md:col-span-4 xl:col-span-6"
          :title="dateRangeLabel ? `Thống kê ${rangeLabel} (${dateRangeLabel})` : `Thống kê ${rangeLabel}`"
          show-trend-icon
          :secondary-tooltip="hasRangeStats && dateRangeLabel ? `Biến động được tính từ ngày ${dateRangeLabel}` : undefined"
          :buy="
            hasRangeStats
              ? {
                  label: 'Mua vào',
                  primary: `${buy.open} → ${buy.close}`,
                  secondary: `${buy.changePercent}%`,
                  secondaryClass: buy.changePercentClass,
                  isPositive: buy.isChangePercentPositive,
                }
              : undefined
          "
          :sell="
            hasRangeStats
              ? {
                  label: 'Bán ra',
                  primary: `${sell.open} → ${sell.close}`,
                  secondary: `${sell.changePercent}%`,
                  secondaryClass: sell.changePercentClass,
                  isPositive: sell.isChangePercentPositive,
                }
              : undefined
          ">
          <Alert v-if="!hasRangeStats">
            <AlertDescription>Không có dữ liệu thống kê cho khoảng thời gian này.</AlertDescription>
          </Alert>
        </PriceStatCard>
      </Grid>

      <section class="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm">
        <Grid class="mb-4">
          <div class="col-span-4 md:col-span-4 xl:col-span-6">
            <h2 class="text-base font-semibold">Biểu đồ giá {{ rangeLabel }}</h2>
          </div>

          <div
            class="col-span-4 flex flex-wrap items-center gap-2 md:col-span-4 md:justify-end xl:col-span-6">
            <Select
              :model-value="range"
              @update:model-value="(value) => setRange(value as PriceDetailRange)">
              <SelectTrigger size="sm">
                <ListFilterIcon class="h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in PRICE_DETAIL_RANGE_OPTIONS"
                  :key="option.value"
                  :value="option.value">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Grid>

        <PriceHistoryChart :history="history" :latest="data?.data.latest" />
      </section>

      <PriceHistoryTable :type="type" :symbol="symbol" />
    </template>
  </section>
</template>
