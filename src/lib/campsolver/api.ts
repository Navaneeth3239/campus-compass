import { queryOptions } from "@tanstack/react-query";
import type {
  CampusImprovement,
  IssueFilters,
  LiveCounters,
  Paginated,
  PublicIssue,
  StatisticsPayload,
} from "./types";

export const API_BASE_URL = (import.meta.env["VITE_API_BASE_URL"] ?? "").replace(/\/$/, "");
export const SOCKET_URL = (import.meta.env["VITE_SOCKET_URL"] ?? "").replace(/\/$/, "");

/** Polling fallback interval used whenever the realtime socket is not connected. */
export const POLL_INTERVAL_MS = 45_000;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiGet<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError("Public API base URL is not configured.", 0);
  }
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "ALL") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }
  return (await response.json()) as T;
}

function normalizeList<T>(raw: unknown, pageSize: number, page: number): Paginated<T> {
  if (Array.isArray(raw)) {
    return { items: raw as T[], page, pageSize, total: raw.length, totalPages: 1 };
  }
  const obj = (raw ?? {}) as Record<string, unknown>;
  const items = (obj["items"] ?? obj["data"] ?? obj["results"] ?? []) as T[];
  const total = Number(obj["total"] ?? obj["totalCount"] ?? items.length);
  const resolvedPageSize = Number(obj["pageSize"] ?? obj["limit"] ?? pageSize) || pageSize;
  return {
    items,
    page: Number(obj["page"] ?? page) || page,
    pageSize: resolvedPageSize,
    total,
    totalPages: Number(obj["totalPages"] ?? Math.max(1, Math.ceil(total / resolvedPageSize))),
  };
}

export const PAGE_SIZE = 9;

export async function fetchPublicIssues(filters: IssueFilters): Promise<Paginated<PublicIssue>> {
  const page = filters.page ?? 1;
  const raw = await apiGet<unknown>("/public/issues", {
    search: filters.q,
    category: filters.category,
    priority: filters.priority,
    status: filters.status,
    location: filters.location,
    page,
    limit: PAGE_SIZE,
  });
  return normalizeList<PublicIssue>(raw, PAGE_SIZE, page);
}

export const issuesQueryOptions = (filters: IssueFilters) =>
  queryOptions({
    queryKey: ["public-issues", filters],
    queryFn: () => fetchPublicIssues(filters),
  });

export const countersQueryOptions = () =>
  queryOptions({
    queryKey: ["public-counters"],
    queryFn: () => apiGet<LiveCounters>("/public/stats/summary"),
  });

export const filterOptionsQueryOptions = () =>
  queryOptions({
    queryKey: ["public-filter-options"],
    queryFn: () =>
      apiGet<{ categories: string[]; statuses: string[]; locations: string[] }>(
        "/public/issues/filters",
      ),
  });

export const improvementsQueryOptions = (page = 1) =>
  queryOptions({
    queryKey: ["public-improvements", page],
    queryFn: async () => {
      const raw = await apiGet<unknown>("/public/improvements", { page, limit: PAGE_SIZE });
      return normalizeList<CampusImprovement>(raw, PAGE_SIZE, page);
    },
  });

export const statisticsQueryOptions = () =>
  queryOptions({
    queryKey: ["public-statistics"],
    queryFn: () => apiGet<StatisticsPayload>("/public/stats"),
  });
