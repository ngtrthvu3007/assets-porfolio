export const CURRENCIES = ["VND", "USD"] as const

export type Currency = (typeof CURRENCIES)[number]

export const DEFAULT_CURRENCY: Currency = "VND"
