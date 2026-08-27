import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPublicIssueStats, getPublicIssuesPage, type PublicIssueFilters } from "@/lib/api/issues";
import { queryKeys } from "@/lib/api/query-keys";

export function usePublicIssues(filters: PublicIssueFilters) {
  return useInfiniteQuery({
    queryKey: queryKeys.publicIssues(filters),
    queryFn: ({ pageParam }) => getPublicIssuesPage(filters, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}

export function usePublicIssueStats() {
  return useQuery({
    queryKey: queryKeys.publicIssueStats,
    queryFn: getPublicIssueStats,
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}
