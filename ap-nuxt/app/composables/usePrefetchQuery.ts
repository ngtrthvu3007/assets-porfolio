import type { QueryKey, UseQueryOptions } from "@tanstack/vue-query"
import { useQueryClient } from "@tanstack/vue-query"

// Shared SSR helper: awaits the query so its data is already in the cache
// before the page renders, letting server HTML include real data (SEO).
// Pair with useQuery(sameOptions) in the component to read from that cache.
export const usePrefetchQuery = async <Data>(
  options: UseQueryOptions<Data, unknown, Data, QueryKey>,
): Promise<void> => {
  const queryClient = useQueryClient()

  await queryClient.prefetchQuery(options)
}
