<script setup lang="ts">
import { computed } from "vue";
import { usePriceDisplay } from "../composables/usePriceDisplay";
import { usePricesQuery } from "../queries/usePricesQuery";

const { currentTime, isFetching, prices, refetch } = usePricesQuery();
const { lastUpdatedAt, priceRows } = usePriceDisplay({ currentTime, prices });
const isInitialFetching = computed(
  () => isFetching.value && !priceRows.value.length,
);
</script>

<template>
  <section class="w-full">
    <section class="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
      <div class="flex flex-col gap-3 border-b border-base-300 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-base font-semibold">Market board</h2>
          <p class="text-sm text-base-content/60">
            Giá vàng hiện tại và biến động mới nhất.
          </p>
          <p class="mt-1 text-xs text-base-content/45">
            Cập nhật: {{ lastUpdatedAt }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <div role="tablist" class="tabs tabs-boxed bg-base-200">
            <button role="tab" class="tab tab-active">Gold</button>
            <button role="tab" class="tab">Stocks</button>
            <button role="tab" class="tab">Crypto</button>
            <button role="tab" class="tab">FX</button>
          </div>

          <button
            class="btn btn-primary btn-sm"
            :class="{ 'btn-disabled': isFetching }"
            :disabled="isFetching"
            @click="refetch()"
          >
            <span v-if="isFetching" class="loading loading-spinner loading-xs"></span>
            Refresh
          </button>
        </div>
      </div>

      <div v-if="isInitialFetching" class="flex min-h-64 items-center justify-center">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="!priceRows.length" class="p-4">
        <div class="alert alert-info">
          <span class="badge badge-info badge-sm"></span>
          <span>Chưa có dữ liệu giá.</span>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Mã loại</th>
              <th class="text-right">Mua vào</th>
              <th class="text-right">Bán ra</th>
              <th class="text-right">Đổi mua</th>
              <th class="text-right">Đổi bán</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="price in priceRows" :key="price.typeCode" class="hover">
              <td>
                <span class="badge badge-primary badge-outline font-semibold">
                  {{ price.typeCode }}
                </span>
              </td>
              <td class="text-right font-medium">{{ price.buy }}</td>
              <td class="text-right font-medium">{{ price.sell }}</td>
              <td class="text-right font-semibold" :class="price.buyChangeClass">
                {{ price.buyChange }}
              </td>
              <td class="text-right font-semibold" :class="price.sellChangeClass">
                {{ price.sellChange }}
              </td>
              <td class="text-sm text-base-content/70">{{ price.updatedAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>
