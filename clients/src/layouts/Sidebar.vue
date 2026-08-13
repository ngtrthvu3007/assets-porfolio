<script setup lang="ts">
import {
  ArrowTrendingUpIcon,
  ChartPieIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  DocumentChartBarIcon,
  HomeIcon,
  StarIcon,
} from "@heroicons/vue/24/outline";

interface SidebarProps {
  collapsed: boolean;
}

interface SidebarEmits {
  toggle: [];
}

defineProps<SidebarProps>();
const emit = defineEmits<SidebarEmits>();

const navigationItems = [
  { icon: HomeIcon, label: "Dashboard", status: "Soon" },
  { icon: ArrowTrendingUpIcon, label: "Markets", status: "Active" },
  { icon: ChartPieIcon, label: "Portfolio", status: "Soon" },
  { icon: StarIcon, label: "Watchlist", status: "Soon" },
  { icon: ClipboardDocumentListIcon, label: "Transactions", status: "Soon" },
  { icon: DocumentChartBarIcon, label: "Reports", status: "Soon" },
];

const handleToggle = (): void => {
  emit("toggle");
};
</script>

<template>
  <aside
    class="relative hidden min-h-[calc(100vh-3.5rem)] border-r border-base-300 bg-base-100 text-base-content transition-colors duration-300 ease-in-out lg:block"
  >
    <button
      class="btn btn-circle btn-xs absolute -right-3 top-4 z-10 h-6 min-h-6 w-6 border border-base-300 bg-base-100 shadow-sm transition-transform duration-300 ease-in-out"
      type="button"
      :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      @click="handleToggle"
    >
      <ChevronRightIcon v-if="collapsed" class="h-3.5 w-3.5" />
      <ChevronLeftIcon v-else class="h-3.5 w-3.5" />
    </button>

    <div class="flex h-full flex-col px-3 py-4">
      <div
        v-show="!collapsed"
        class="px-3 text-[11px] font-semibold uppercase tracking-wide text-base-content/45 transition-opacity duration-200 ease-in-out"
        :class="collapsed ? 'opacity-0' : 'opacity-100'"
      >
        Workspace
      </div>

      <ul
        class="menu gap-1 p-0 transition-[margin] duration-300 ease-in-out"
        :class="collapsed ? 'mt-1' : 'mt-2'"
      >
        <li v-for="item in navigationItems" :key="item.label">
          <a
            class="rounded-lg px-3 py-2 transition-all duration-300 ease-in-out"
            :title="collapsed ? item.label : undefined"
            :class="[
              collapsed ? 'justify-center px-0' : '',
              item.status === 'Active'
                ? 'active bg-base-200 text-base-content'
                : 'text-base-content/70 hover:bg-base-200',
            ]"
          >
            <span
              class="grid h-7 w-7 place-items-center rounded-md"
              :class="
                item.status === 'Active'
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-200 text-base-content/65'
              "
            >
              <component :is="item.icon" class="h-4 w-4" />
            </span>
            <span
              v-show="!collapsed"
              class="text-sm font-medium transition-opacity duration-200 ease-in-out"
              :class="collapsed ? 'opacity-0' : 'opacity-100'"
            >
              {{ item.label }}
            </span>
            <span
              v-show="item.status !== 'Active' && !collapsed"
              class="badge badge-ghost badge-sm ml-auto text-base-content/45 transition-opacity duration-200 ease-in-out"
              :class="collapsed ? 'opacity-0' : 'opacity-100'"
            >
              Soon
            </span>
          </a>
        </li>
      </ul>

      <div
        v-show="!collapsed"
        class="mt-auto rounded-lg border border-base-300 bg-base-200/60 p-3 transition-opacity duration-200 ease-in-out"
        :class="collapsed ? 'opacity-0' : 'opacity-100'"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="text-xs font-semibold uppercase tracking-wide text-base-content/55">
            Product
          </p>
          <span class="badge badge-success badge-sm">Alpha</span>
        </div>
        <progress
          class="progress progress-primary mt-3 h-1.5"
          value="35"
          max="100"
        ></progress>
        <p class="mt-3 text-xs leading-5 text-base-content/60">
          Gold live is active. Portfolio and watchlist are next.
        </p>
      </div>
    </div>
  </aside>
</template>
