<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar";

import {
  ChartPieIcon,
  ClipboardListIcon,
  FileChartColumnIcon,
  HomeIcon,
  StarIcon,
  TrendingUpIcon,
} from "@lucide/vue";
import type { Component } from "vue";
import { markRaw } from "vue";
import NavUser from "@/components/NavUser.vue";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const props = withDefaults(defineProps<SidebarProps>(), { collapsible: "icon" });

// This is sample data.
const data = { user: { name: "shadcn", email: "m@example.com", avatar: "/avatars/shadcn.jpg" } };

const route = useRoute();
const NuxtLink = markRaw(resolveComponent("NuxtLink") as Component);

const navigationItems = [
  { icon: HomeIcon, label: "Dashboard", url: null, status: "Soon" },
  { icon: TrendingUpIcon, label: "Markets", url: "/", status: "Active" },
  { icon: ChartPieIcon, label: "Portfolio", url: null, status: "Soon" },
  { icon: StarIcon, label: "Watchlist", url: null, status: "Soon" },
  { icon: ClipboardListIcon, label: "Transactions", url: null, status: "Soon" },
  { icon: FileChartColumnIcon, label: "Reports", url: null, status: "Soon" },
];
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child class="cursor-default hover:bg-transparent">
            <div>
              <div
                class="grid aspect-square size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <img src="/logo.svg" alt="Asset Portfolio" class="size-6 invert" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Asset Portfolio</span>
                <span class="truncate text-xs text-muted-foreground">Wealth dashboard</span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navigationItems" :key="item.label">
              <SidebarMenuButton
                :as="item.url ? NuxtLink : 'button'"
                :to="item.url ?? undefined"
                :is-active="item.url === route.path"
                :tooltip="item.label">
                <component :is="item.icon" />
                <span>{{ item.label }}</span>
                <Badge v-if="item.status !== 'Active'" variant="default" class="ml-auto"> Soon </Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
