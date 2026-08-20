// This app's own Nitro routes (server/routes/**), safe to call from client or server.
export const API_ROUTES = {
  prices: {
    detail: (type: string, symbol: string) => `/prices/${type}/${symbol}`,
    latest: "/prices/latest",
    list: "/prices",
    types: "/prices/types",
  },
} as const
