import { useQuery } from "@tanstack/react-query";
import {
  getAdminIssues,
  getAdminIssueStats,
  getDepartments,
  type AdminIssueFilters,
} from "@/lib/api/issues";
import { queryKeys } from "@/lib/api/query-keys";

export function useAdminIssues(filters: AdminIssueFilters) {
  return useQuery({
    queryKey: queryKeys.adminIssues(filters),
    queryFn: () => getAdminIssues(filters),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useAdminIssueStats() {
  return useQuery({
    queryKey: queryKeys.adminIssueStats,
    queryFn: getAdminIssueStats,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: queryKeys.departments,
    queryFn: getDepartments,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
