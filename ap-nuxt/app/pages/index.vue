<script setup lang="ts">
import { Bitcoin, ChartArea, LoaderCircleIcon, RefreshCwIcon } from "@lucide/vue";
import { computed, ref } from "vue";
import { usePriceDisplay } from "@/composables/usePriceDisplay";
import { prefetchPrices, usePrices } from "@/composables/usePrices";
import type { PriceItem } from "@/types/prices";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

await prefetchPrices();

const { data, isFetching, refetch } = usePrices();

const currentTime = computed(() => data.value?.data.currentTime ?? null);
const prices = computed<PriceItem[]>(() => data.value?.data.items ?? []);

const { lastUpdatedAt, priceRows } = usePriceDisplay({ currentTime, prices });
const isInitialFetching = computed(() => isFetching.value && !priceRows.value.length);

const assetClass = ref("gold");

useBreadcrumbs().setBreadcrumbs([{ label: "Markets" }]);

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
              <TabsTrigger value="gold">
                <ChartArea class="h-5 w-5" />
                Vàng
              </TabsTrigger>
              <TabsTrigger value="stock">
                <ChartArea class="h-5 w-5" />
                Cổ phiếu
              </TabsTrigger>
              <TabsTrigger value="crypto">
                <Bitcoin class="h-5 w-5" />
                Tiền số
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button size="sm" :disabled="isFetching" @click="refetch()">
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
            <TableHead class="text-right">Mua vào</TableHead>
            <TableHead class="text-right">Bán ra</TableHead>
            <TableHead class="text-right">Chênh lệch mua</TableHead>
            <TableHead class="text-right">Chênh lệch bán</TableHead>
            <TableHead>Cập nhật</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="price in priceRows" :key="price.symbol">
            <TableCell>
              <div class="flex flex-col gap-1">
                <Badge variant="outline" class="w-fit font-semibold">{{ price.symbol }}</Badge>
                <span class="text-xs text -foreground">{{ price.name }}</span>
              </div>
            </TableCell>
            <TableCell class="text-right font-medium">{{ price.buy }}</TableCell>
            <TableCell class="text-right font-medium">{{ price.sell }}</TableCell>
            <TableCell class="text-right font-semibold" :class="price.buyChangeClass">
              {{ price.buyChange }}
            </TableCell>
            <TableCell class="text-right font-semibold" :class="price.sellChangeClass">
              {{ price.sellChange }}
            </TableCell>
            <TableCell class="text-sm text-muted-foreground">{{ price.updatedAt }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  </section>
</template>
