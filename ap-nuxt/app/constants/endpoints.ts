// This app's own Nitro routes (server/routes/**), safe to call from client or server.
export const API_ROUTES = {
  prices: {
    latest: "/prices/latest",
    types: "/prices/types",
  },
} as const
