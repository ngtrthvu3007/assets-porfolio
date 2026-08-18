<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "@lucide/vue";
import { Toaster as Sonner } from "vue-sonner";
import { cn } from "@/lib/utils";

const props = withDefaults(defineProps<ToasterProps>(), {
  richColors: true,
  closeButton: true,
  closeButtonPosition: "top-right",
});
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--muted-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
      '--success-bg': 'var(--success)',
      '--success-border': 'var(--success)',
      '--success-text': 'var(--muted-foreground)',
      '--info-bg': 'var(--info)',
      '--info-border': 'var(--info)',
      '--info-text': 'var(--muted-foreground)',
      '--warning-bg': 'var(--warning)',
      '--warning-border': 'var(--warning)',
      '--warning-text': 'var(--warning-foreground)',
      '--error-bg': 'var(--destructive)',
      '--error-border': 'var(--destructive)',
      '--error-text': 'var(--muted-foreground)',
    }"
    v-bind="props">
    <template #success-icon>
      <CircleCheckIcon class="size-4" />
    </template>
    <template #info-icon>
      <InfoIcon class="size-4" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="size-4" />
    </template>
    <template #error-icon>
      <OctagonXIcon class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2Icon class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-4" />
    </template>
  </Sonner>
</template>
