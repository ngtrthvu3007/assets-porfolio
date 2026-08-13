<script setup lang="ts">
import { ref } from "vue";
import {
  BanknotesIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";
import ThemeSwitcher from "../components/ThemeSwitcher.vue";

type Currency = "VND" | "USD";

const currencies: Currency[] = ["VND", "USD"];
const selectedCurrency = ref<Currency>("VND");

const setCurrency = (currency: Currency): void => {
  selectedCurrency.value = currency;
};
</script>

<template>
  <header
    class="sticky top-0 z-20 border-b border-base-300 bg-base-100/85 backdrop-blur-xl"
  >
    <div
      class="grid min-h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 sm:px-6"
    >
      <div class="flex min-w-0 items-center gap-3">
        <div
          class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary font-bold text-primary-content shadow-sm"
        >
          AP
        </div>
        <div class="hidden min-w-0 sm:block">
          <p class="truncate text-sm font-semibold leading-4">Asset Pop</p>
          <p class="truncate text-xs text-base-content/55">Wealth dashboard</p>
        </div>
      </div>

      <div class="w-[min(44vw,36rem)] min-w-72">
        <label
          class="input input-bordered flex h-9 w-full max-w-lg items-center gap-3 rounded-full bg-base-200/70 px-3"
        >
          <MagnifyingGlassIcon class="h-4 w-4 shrink-0 text-base-content/45" />
          <input
            class="min-w-0 grow text-sm font-medium placeholder:text-base-content/45"
            type="text"
            placeholder="Gold, BTC, AAPL, portfolio..."
          />
        </label>
      </div>

      <div class="flex min-w-0 justify-end">
        <div class="flex shrink-0 items-center gap-2">
          <div class="hidden items-center gap-2 md:flex">
            <div
              class="flex items-center gap-0.5 rounded-xl bg-base-200/70 p-0.5"
              aria-label="Currency"
            >
              <span class="flex h-7 items-center px-1.5 text-base-content/50">
                <BanknotesIcon class="h-4 w-4" />
              </span>

              <button
                v-for="currency in currencies"
                :key="currency"
                class="btn btn-ghost btn-xs h-7 min-h-7 rounded-lg border-0 px-2 text-xs font-semibold"
                :class="{
                  'bg-base-100 shadow-sm': currency === selectedCurrency,
                }"
                type="button"
                @click="setCurrency(currency)"
              >
                {{ currency }}
              </button>
            </div>

            <div class="px-2">
              <div class="badge badge-neutral px-2">Live Beta</div>
            </div>
          </div>

          <ThemeSwitcher />

          <button
            class="btn btn-circle btn-ghost h-10 min-h-10 w-10 bg-base-200/70"
            aria-label="User menu"
          >
            <UserIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
