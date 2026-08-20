<script setup lang="ts">
import { ArrowDownIcon, ArrowUpIcon, InfoIcon } from "@lucide/vue";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PriceStatColumn {
  label: string;
  primary: string;
  secondary: string;
  secondaryClass: string;
  isPositive: boolean;
}

withDefaults(
  defineProps<{
    title: string;
    buy?: PriceStatColumn;
    sell?: PriceStatColumn;
    showTrendIcon?: boolean;
    secondaryTooltip?: string;
  }>(),
  { buy: undefined, sell: undefined, showTrendIcon: false, secondaryTooltip: undefined },
);
</script>

<template>
  <Card class="gap-3 py-4">
    <CardHeader class="px-4">
      <CardTitle class="text-sm">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-2 px-4">
      <slot>
        <template v-if="buy && sell">
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm text-muted-foreground">{{ buy.label }}</p>
            <div class="text-right">
              <p class="text-sm font-semibold">{{ buy.primary }}</p>
              <p class="flex items-center justify-end gap-1 text-sm font-medium" :class="buy.secondaryClass">
                <template v-if="showTrendIcon">
                  <ArrowUpIcon v-if="buy.isPositive" class="h-3 w-3" />
                  <ArrowDownIcon v-else class="h-3 w-3" />
                </template>
                {{ buy.secondary }}
                <Tooltip v-if="secondaryTooltip">
                  <TooltipTrigger>
                    <InfoIcon class="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>{{ secondaryTooltip }}</TooltipContent>
                </Tooltip>
              </p>
            </div>
          </div>
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm text-muted-foreground">{{ sell.label }}</p>
            <div class="text-right">
              <p class="text-sm font-semibold">{{ sell.primary }}</p>
              <p
                class="flex items-center justify-end gap-1 text-sm font-medium"
                :class="sell.secondaryClass">
                <template v-if="showTrendIcon">
                  <ArrowUpIcon v-if="sell.isPositive" class="h-3 w-3" />
                  <ArrowDownIcon v-else class="h-3 w-3" />
                </template>
                {{ sell.secondary }}
                <Tooltip v-if="secondaryTooltip">
                  <TooltipTrigger>
                    <InfoIcon class="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>{{ secondaryTooltip }}</TooltipContent>
                </Tooltip>
              </p>
            </div>
          </div>
        </template>
      </slot>
    </CardContent>
  </Card>
</template>
