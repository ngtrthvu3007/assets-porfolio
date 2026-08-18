<script setup lang="ts">
import { TabsTrigger } from "reka-ui"
import { cn } from "@/lib/utils"

interface Props {
  value: string
  disabled?: boolean
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <TabsTrigger
    v-bind="props"
    :class="
      cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        props.class,
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>
