<script setup lang="ts">
import { ChevronRightIcon, HomeIcon } from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";
import Sidebar from "./Sidebar.vue";
import TopBar from "./TopBar.vue";

const isSidebarCollapsed = ref(false);
const layoutGridStyle = computed(() => ({
  gridTemplateColumns: isSidebarCollapsed.value
    ? "72px minmax(0, 1fr)"
    : "240px minmax(0, 1fr)",
}));

const toggleSidebar = (): void => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<template>
  <div class="min-h-screen bg-base-200 text-base-content">
    <TopBar />

    <div
      class="lg:grid lg:transition-[grid-template-columns] lg:duration-300 lg:ease-in-out"
      :style="layoutGridStyle"
    >
      <Sidebar :collapsed="isSidebarCollapsed" @toggle="toggleSidebar" />
      <main class="px-4 py-5 sm:px-5 lg:px-6">
        <div class="mb-5 flex w-full flex-col gap-1.5">
          <div class="flex items-center gap-1.5 text-xs text-base-content/55">
            <HomeIcon class="h-3.5 w-3.5" />
            <span>Workspace</span>
            <ChevronRightIcon class="h-3 w-3 text-base-content/35" />
            <span class="font-medium text-base-content/80">Markets</span>
          </div>

          <div>
            <div>
              <h1 class="text-xl font-semibold tracking-normal">Markets</h1>
              <p class="text-sm text-base-content/60">
                Theo dõi giá vàng và dữ liệu thị trường trong một bảng điều khiển.
              </p>
            </div>
          </div>
        </div>

        <slot />
      </main>
    </div>
  </div>
</template>
