<script setup lang="ts">
import { TabsList } from "reka-ui"
import { cn } from "@/lib/utils"

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <TabsList
    :class="
      cn('inline-flex items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground', props.class)
    "
  >
    <slot />
  </TabsList>
</template>
