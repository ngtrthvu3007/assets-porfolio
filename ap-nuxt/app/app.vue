<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster position="bottom-right" />
  </div>
</template>
