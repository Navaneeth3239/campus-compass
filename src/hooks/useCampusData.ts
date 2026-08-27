import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  countersQueryOptions,
  fetchPublicIssues,
  issuesQueryOptions,
  statisticsQueryOptions,
  type IssueFilters,
} from "@/lib/campsolver/api";

export function useCampusIssues(filters: IssueFilters) {
  return useInfiniteQuery({
    ...issuesQueryOptions(filters),
    queryFn: ({ pageParam }) => fetchPublicIssues({ ...filters, page: pageParam }),
    initialPageParam: filters.page ?? 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}

export function useCampusCounters() {
  return useQuery({ ...countersQueryOptions(), staleTime: 15_000, refetchOnWindowFocus: true });
}

export function useCampusStatistics() {
  return useQuery({ ...statisticsQueryOptions(), staleTime: 15_000, refetchOnWindowFocus: true });
}
