export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type IssueStatus =
  | "REPORTED"
  | "UNDER_REVIEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface PublicIssue {
  id: string;
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
  problemDescription: string;
  beforeImageUrl?: string | null;
  resolutionDescription: string;
  afterImageUrl?: string | null;
  resolvedAt: string;
  title?: string | null;
  location?: string | null;
  category?: string | null;
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
}

export interface StatisticsPayload {
  byCategory: { category: string; count: number }[];
  resolutionRate: { resolved: number; total: number; ratePercent: number };
  avgResolutionHours: number;
  monthlyTrend: { month: string; reported: number; resolved: number }[];
  mostImprovedLocations: { location: string; resolved: number }[];
}

export interface IssueFilters {
  q?: string;
  category?: string;
  priority?: string;
  status?: string;
  location?: string;
  page?: number;
}
