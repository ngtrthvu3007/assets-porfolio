<script setup lang="ts">
import { ChartArea, LoaderCircleIcon, RefreshCwIcon, SearchIcon } from "@lucide/vue";
import { refDebounced } from "@vueuse/core";
import { ref, watch } from "vue";
import { usePriceDisplay } from "@/composables/usePriceDisplay";
import { prefetchPriceTypes, prefetchPrices, usePrices, usePriceTypes } from "@/composables/usePrices";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/default";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TablePagination from "@/components/TablePagination.vue";

useBreadcrumbs().setBreadcrumbs([{ label: "Markets" }]);

const assetClass = ref("gold");
const search = ref("");
const searchDebounced = refDebounced(search, 300);
const page = ref(DEFAULT_PAGE);

watch([assetClass, searchDebounced], () => {
  page.value = DEFAULT_PAGE;
});

await Promise.all([prefetchPrices(), prefetchPriceTypes()]);

const { data, isFetching, refetch } = usePrices(() => ({
  type: assetClass.value,
  q: searchDebounced.value || undefined,
  page: page.value,
  pageSize: DEFAULT_PAGE_SIZE,
}));
const { data: priceTypesData } = usePriceTypes();

const { lastUpdatedAt, pagination, priceRows, priceTypes, isInitialFetching } = usePriceDisplay({
  data,
  isFetching,
  priceTypesData,
});

useSeoMeta({
  title: "Bảng giá thị trường - Asset Portfolio",
  description: "Theo dõi giá vàng và dữ liệu thị trường cập nhật theo thời gian thực.",
  ogTitle: "Bảng giá thị trường - Asset Portfolio",
  ogDescription: "Theo dõi giá vàng và dữ liệu thị trường cập nhật theo thời gian thực.",
});
</script>

<template>
  <section class="w-full">
    <section class="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <Grid class="border-b border-border px-4 py-4">
        <div class="col-span-4 md:col-span-4 xl:col-span-6">
          <h2 class="text-base font-semibold">Bảng giá thị trường</h2>
          <p class="mt-1 text-xs font-semibold text-muted-foreground">Cập nhật: {{ lastUpdatedAt }}</p>
          <p class="mt-1 text-xs font-semibold text-muted-foreground">Đơn vị: triệu đồng/lượng</p>
        </div>

        <div
          class="col-span-4 flex flex-wrap items-center gap-2 md:col-span-4 md:justify-end xl:col-span-6">
          <Tabs v-model="assetClass">
            <TabsList>
              <TabsTrigger v-for="priceType in priceTypes" :key="priceType.type" :value="priceType.type">
                <ChartArea class="h-5 w-5" />
                {{ formatCapitalLetter(priceType.label) }}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div class="relative">
            <SearchIcon
              class="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input v-model="search" placeholder="Tìm theo mã hoặc tên..." class="w-56 pl-8" />
          </div>

          <Button size="sm" variant="default" :disabled="isFetching" @click="refetch()">
            <LoaderCircleIcon v-if="isFetching" class="h-4 w-4 animate-spin" />
            <RefreshCwIcon v-else class="h-4 w-4" />
            Làm mới
          </Button>
        </div>
      </Grid>

      <div v-if="isInitialFetching" class="flex min-h-64 items-center justify-center">
        <LoaderCircleIcon class="h-8 w-8 animate-spin text-primary" />
      </div>

      <div v-else-if="!priceRows.length" class="p-4">
        <Alert>
          <AlertDescription>Chưa có dữ liệu giá.</AlertDescription>
        </Alert>
      </div>

      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead>Mã loại</TableHead>
            <TableHead>Mua vào</TableHead>
            <TableHead>Bán ra</TableHead>
            <TableHead>Chênh lệch mua</TableHead>
            <TableHead>Chênh lệch bán</TableHead>
            <TableHead>Cập nhật</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="price in priceRows"
            :key="price.symbol"
            class="cursor-pointer"
            @click="navigateTo(`/markets/${assetClass}/${price.symbol}`)">
            <TableCell>
              <div class="flex flex-col gap-1">
                <Badge variant="outline" class="w-fit font-semibold">{{ price.symbol }}</Badge>
                <span class="text-xs text -foreground">{{ price.name }}</span>
              </div>
            </TableCell>
            <TableCell class="font-medium">{{ price.buy }}</TableCell>
            <TableCell class="font-medium">{{ price.sell }}</TableCell>
            <TableCell class="font-semibold" :class="price.buyChangeClass">
              {{ price.buyChange }}
            </TableCell>
            <TableCell class="font-semibold" :class="price.sellChangeClass">
              {{ price.sellChange }}
            </TableCell>
            <TableCell class="text-sm text-muted-foreground">{{ price.updatedAt }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <TablePagination v-model:page="page" :pagination="pagination" />
    </section>
  </section>
</template>
