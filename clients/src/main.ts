import {
  QueryClient,
  VueQueryPlugin,
} from "@tanstack/vue-query";
import { createApp } from "vue";
import AppProvider from "./providers/AppProvider.vue";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createApp(AppProvider).use(VueQueryPlugin, { queryClient }).mount("#app");
