export type Priority = "LOW" | "MEDIUM" | "HIGH";

/**
 * Full issue lifecycle used across the public dashboard and the admin
 * dashboard. The public site only ever displays approved statuses; the admin
 * dashboard is the source of truth for all of them (including REOPENED,
 * which represents a verification that was rejected and sent back to work).
 */
export type IssueStatus =
  | "REPORTED"
  | "UNDER_REVIEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "VERIFIED"
  | "REOPENED"
  | "CLOSED";

export interface PublicIssue {
  id: string;
  /** Human-facing ticket reference, e.g. CS-2026-10241. */
  ticketId: string;
  title: string;
  category: string;
  description: string;
  /** General campus location only — never exact GPS. */
  location: string;
  priority: Priority;
  status: IssueStatus;
  reportedAt: string;
  updatedAt: string;
  imageUrl?: string | null;
}

export interface CampusImprovement {
  id: string;
  ticketId?: string | null;
  problemDescription: string;
  beforeImageUrl?: string | null;
  resolutionDescription: string;
  afterImageUrl?: string | null;
  resolvedAt: string;
  title?: string | null;
  location?: string | null;
  category?: string | null;
  department?: string | null;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface LiveCounters {
  issuesResolved: number;
  avgResolutionHours: number;
  activeDepartments: number;
  totalIssues?: number;
  totalPublicIssues?: number;
}

export interface StatisticsPayload {
  byCategory: { category: string; count: number }[];
  resolutionRate: { resolved: number; total: number; ratePercent: number };
  avgResolutionHours: number;
  monthlyTrend: { month: string; reported: number; resolved: number }[];
  mostImprovedLocations: { location: string; resolved: number }[];
}

export type SortOption = "newest" | "oldest" | "priority" | "updated";

export interface IssueFilters {
  q?: string;
  category?: string;
  priority?: string;
  status?: string;
  location?: string;
  sort?: SortOption;
  page?: number;
}

