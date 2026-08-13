<script setup lang="ts">
import { ref } from "vue";
import {
  CheckIcon,
  ChevronDownIcon,
  SwatchIcon,
} from "@heroicons/vue/24/outline";
import { useTheme } from "../composables/useTheme";
import type { AppTheme } from "../constants/themes";

const { currentTheme, setTheme, themes } = useTheme();
const dropdownRef = ref<HTMLDetailsElement | null>(null);

const handleThemeChange = (theme: AppTheme): void => {
  setTheme(theme);

  if (dropdownRef.value) {
    dropdownRef.value.open = false;
  }
};
</script>

<template>
  <details ref="dropdownRef" class="dropdown dropdown-end hidden sm:block">
    <summary
      class="btn btn-ghost btn-sm rounded-xl px-2 text-base-content/70 hover:bg-base-200"
      aria-label="Theme"
    >
      <SwatchIcon class="h-5 w-5" />
      <ChevronDownIcon class="h-3.5 w-3.5" />
    </summary>

    <ul
      class="menu menu-sm dropdown-content z-30 mt-2 w-36 rounded-xl border border-base-300 bg-base-100 p-1 text-sm shadow-lg"
    >
      <li v-for="theme in themes" :key="theme.value">
        <button
          class="flex items-center justify-between rounded-lg px-3 py-2"
          :class="{ active: theme.value === currentTheme }"
          type="button"
          @click="handleThemeChange(theme.value)"
        >
          <span>{{ theme.label }}</span>
          <CheckIcon
            v-if="theme.value === currentTheme"
            class="h-4 w-4 text-primary"
          />
        </button>
      </li>
    </ul>
  </details>
</template>
