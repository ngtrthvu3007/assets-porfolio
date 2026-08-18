<script setup lang="ts">
import { cn } from "@/lib/utils"
import { alertVariants, type AlertVariants } from "."

interface Props {
  variant?: AlertVariants["variant"]
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
})
</script>

<template>
  <div role="alert" :class="cn(alertVariants({ variant: props.variant }), props.class)">
    <slot />
  </div>
</template>
