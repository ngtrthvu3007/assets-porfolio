<script setup lang="ts">
import { cn } from "@/lib/utils"

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <th
    :class="
      cn(
        'h-10 whitespace-nowrap px-3 text-left align-middle text-xs font-medium text-muted-foreground',
        props.class,
      )
    "
  >
    <slot />
  </th>
</template>
