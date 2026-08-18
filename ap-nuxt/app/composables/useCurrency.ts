import { CURRENCIES, DEFAULT_CURRENCY, type Currency } from "@/constants/currency"

const CURRENCY_COOKIE_KEY = "ap-currency"

export function useCurrency() {
  const selectedCurrency = useCookie<Currency>(CURRENCY_COOKIE_KEY, {
    default: () => DEFAULT_CURRENCY,
    sameSite: "lax",
  })

  const setCurrency = (currency: Currency): void => {
    if (!CURRENCIES.includes(currency)) return
    selectedCurrency.value = currency
  }

  return {
    currencies: CURRENCIES,
    selectedCurrency,
    setCurrency,
  }
}
