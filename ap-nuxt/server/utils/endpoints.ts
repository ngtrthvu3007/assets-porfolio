// Backend NestJS routes, only ever called from files under server/routes/.
// Placed in server/utils/ (not a dedicated constants/ dir) because Nitro
// auto-imports everything here — no explicit import needed in server/routes/.
export const BACKEND_ROUTES = {
  prices: {
    detail: (type: string, symbol: string) => `/prices/${type}/${symbol}`,
    latest: "/prices/latest",
    list: "/prices",
    types: "/prices/types",
  },
} as const
