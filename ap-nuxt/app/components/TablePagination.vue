<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/vue";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DEFAULT_PAGE_SIZE } from "@/constants/default";
import type { PaginationMeta } from "@/types/prices";

const page = defineModel<number>("page", { required: true });

defineProps<{ pagination?: PaginationMeta }>();
</script>

<template>
  <div v-if="pagination && pagination.totalPages > 1" class="border-t border-border px-4 py-3">
    <Pagination v-model:page="page" :items-per-page="DEFAULT_PAGE_SIZE" :total="pagination.total" show-edges>
      <PaginationContent v-slot="{ items }">
        <PaginationFirst>
          <ChevronLeftIcon />
          <span class="hidden sm:block">Đầu</span>
        </PaginationFirst>
        <PaginationPrevious>
          <ChevronLeftIcon />
          <span class="hidden sm:block">Trước</span>
        </PaginationPrevious>
        <template
          v-for="(item, index) in items"
          :key="item.type === 'page' ? item.value : `ellipsis-${index}`">
          <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
            {{ item.value }}
          </PaginationItem>
          <PaginationEllipsis v-else />
        </template>
        <PaginationNext>
          <span class="hidden sm:block">Sau</span>
          <ChevronRightIcon />
        </PaginationNext>
        <PaginationLast>
          <span class="hidden sm:block">Cuối</span>
          <ChevronRightIcon />
        </PaginationLast>
      </PaginationContent>
    </Pagination>
  </div>
</template>
