import { dehydrate, hydrate, QueryClient, VueQueryPlugin } from "@tanstack/vue-query"

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  })

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })

  if (import.meta.server) {
    nuxtApp.hooks.hook("app:rendered", () => {
      nuxtApp.payload.vueQueryState = dehydrate(queryClient)
    })
  }

  if (import.meta.client) {
    hydrate(queryClient, nuxtApp.payload.vueQueryState)
  }
})
