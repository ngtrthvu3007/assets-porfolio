<script setup lang="ts">
import { ArrowBigDownIcon, ArrowBigUpIcon, type LucideIcon } from "@lucide/vue";
import { computed, ref, watch } from "vue";
import { useListPrices } from "@/composables/usePrices";
import { DEFAULT_PRICE_LIST_SORT, PRICE_LIST_SORTABLE_COLUMNS, SORT_ORDER } from "@/constants/prices";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TablePagination from "@/components/TablePagination.vue";
import type { PriceListSort, SortOrder } from "@/types/prices";
import { formatCurrency, formatIsoTimestamp, formatSignedCurrency } from "@/utils/formatters";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "~/constants/default";

const toChangeClass = (change: number | null | undefined) =>
  (change ?? 0) >= 0 ? "text-accent" : "text-destructive";

const props = defineProps<{ type: string; symbol: string }>();

const page = ref(DEFAULT_PAGE);
const sort = ref<PriceListSort>(DEFAULT_PRICE_LIST_SORT);
const order = ref<SortOrder>(SORT_ORDER.DESC);

watch(
  () => [props.type, props.symbol],
  () => {
    page.value = DEFAULT_PAGE;
  },
);

const toggleSort = (field: PriceListSort) => {
  const isSameField = sort.value === field;

  order.value = isSameField && order.value === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
  sort.value = field;
  page.value = DEFAULT_PAGE;
};

const sortIconFor = (field: PriceListSort): LucideIcon | null => {
  if (sort.value !== field) return null;
  return order.value === SORT_ORDER.ASC ? ArrowBigUpIcon : ArrowBigDownIcon;
};

const { data } = useListPrices(() => ({
  type: props.type,
  q: props.symbol,
  page: page.value,
  pageSize: DEFAULT_PAGE_SIZE,
  sort: sort.value,
  order: order.value,
}));

const historyRows = computed(
  () =>
    data.value?.data.items.map((item) => ({
      buy: formatCurrency(item.buyPrice ?? 0),
      sell: formatCurrency(item.sellPrice ?? 0),
      buyChange: formatSignedCurrency(item.buyChange ?? 0),
      sellChange: formatSignedCurrency(item.sellChange ?? 0),
      buyChangeClass: toChangeClass(item.buyChange),
      sellChangeClass: toChangeClass(item.sellChange),
      updatedAt: formatIsoTimestamp(item.sourceUpdatedAt),
      key: item.sourceUpdatedAt,
    })) ?? [],
);

const pagination = computed(() => data.value?.data.pagination);
</script>

<template>
  <section class="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
    <div class="border-b border-border px-4 py-4">
      <h2 class="text-base font-semibold">Lịch sử giá</h2>
    </div>

    <div v-if="!historyRows.length" class="p-4">
      <Alert>
        <AlertDescription>Không có dữ liệu cho khoảng thời gian này.</AlertDescription>
      </Alert>
    </div>

    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead
            v-for="column in PRICE_LIST_SORTABLE_COLUMNS"
            :key="column.field"
            class="cursor-pointer select-none"
            @click="toggleSort(column.field)">
            <span class="inline-flex items-center gap-1">
              {{ column.label }}
              <component
                :is="sortIconFor(column.field)"
                class="h-3.5 w-3.5 fill-current text-foreground" />
            </span>
          </TableHead>
          <TableHead>Thay đổi mua</TableHead>
          <TableHead>Thay đổi bán</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="point in historyRows" :key="point.key">
          <TableCell class="text-sm text-muted-foreground">{{ point.updatedAt }}</TableCell>
          <TableCell class="font-medium">{{ point.buy }}</TableCell>
          <TableCell class="font-medium" :class="point.buyChangeClass">{{ point.buyChange }}</TableCell>
          <TableCell class="font-medium">{{ point.sell }}</TableCell>
          <TableCell class="font-medium" :class="point.sellChangeClass">{{
            point.sellChange
          }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <TablePagination v-model:page="page" :pagination="pagination" />
  </section>
</template>
