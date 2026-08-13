<script setup lang="ts">
import { computed } from "vue";
import { useToast } from "../composables/useToast";
import type { ToastType } from "../types/toast";

const { removeToast, toasts } = useToast();

const alertClassByType: Record<ToastType, string> = {
  error: "alert-error",
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
};

const visibleToasts = computed(() => toasts.value);
</script>

<template>
  <div class="toast toast-end toast-top z-50">
    <div
      v-for="toast in visibleToasts"
      :key="toast.id"
      class="alert shadow-lg"
      :class="alertClassByType[toast.type]"
    >
      <span>{{ toast.message }}</span>
      <button class="btn btn-ghost btn-xs" @click="removeToast(toast.id)">
        Close
      </button>
    </div>
  </div>
</template>
