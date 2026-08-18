import type { ApiError } from "@/types/api"

// Client-only: on the server, errors surface via prefetchPrices()/usePrices()
// throwing, which the page/error boundary handles instead of a toast.
export const apiFetch = $fetch.create({
  onResponseError({ error, response }) {
    if (import.meta.server) return

    const message = (response?._data as ApiError | undefined)?.message ?? error?.message
    useToast().showErrorToast(message ?? "Unexpected API error")
  },
})
