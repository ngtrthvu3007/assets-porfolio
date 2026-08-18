import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/global.css"],
  vite: { plugins: [tailwindcss()] },
  components: [{ path: "~/components/ui", extensions: [".vue"], pathPrefix: false }, "~/components"],
  runtimeConfig: {
    // Server-only: never exposed to the client bundle.
    apiBase: process.env.NUXT_API_BASE || "http://localhost:3000/api",
  },
});
