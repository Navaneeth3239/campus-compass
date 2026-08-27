import { subDays } from "date-fns";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import type { Department, Issue, IssuePriority, IssueStatus } from "@/lib/types/issues";

type PublicIssueRow = Database["public"]["Views"]["public_issues_view"]["Row"];
type AdminIssueRow = Database["public"]["Tables"]["issues"]["Row"];
type DepartmentRow = Database["public"]["Tables"]["departments"]["Row"];

export interface PublicIssueFilters {
  search?: string;
  status?: IssueStatus | "ALL";
  priority?: IssuePriority | "ALL";
}

export interface AdminIssueFilters {
  search?: string;
  status?: IssueStatus | "ALL";
  priority?: IssuePriority | "ALL";
  category?: string | "ALL";
  departmentId?: string | "ALL";
}

export interface PublicIssueStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  critical: number;
  topCategory: string;
  topLocation: string;
  trendLabel: string;
  trendUp: boolean;
}

export interface AdminIssueStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  critical: number;
}

const PUBLIC_PAGE_SIZE = 6;

const PENDING_STATUSES: IssueStatus[] = ["REPORTED", "ASSIGNED", "IN_PROGRESS", "REOPENED", "OVERDUE", "ESCALATED"];
const IN_PROGRESS_STATUSES: IssueStatus[] = ["ASSIGNED", "IN_PROGRESS", "REOPENED", "OVERDUE", "ESCALATED"];
const RESOLVED_STATUSES: IssueStatus[] = ["RESOLVED", "VERIFIED", "CLOSED"];

function toIssuePriority(priority: string | null): IssuePriority {
  return priority === "LOW" || priority === "MEDIUM" || priority === "HIGH" ? priority : "LOW";
}

function toIssueStatus(status: AdminIssueRow["status"] | PublicIssueRow["status"]): IssueStatus {
  return status;
}

function normalizeText(value: string | null | undefined, fallback = "Not provided") {
  const trimmed = value?.trim();
  return trimmed?.length ? trimmed : fallback;
}

function sanitizeSearchTerm(value: string) {
  return value.replaceAll(",", " ").replaceAll("%", "").replaceAll("(", " ").replaceAll(")", " ").trim();
}

function applyPublicFilters(
  query: ReturnType<typeof supabase.from<"public_issues_view">>,
  filters: PublicIssueFilters,
) {
  let nextQuery = query;

  if (filters.status && filters.status !== "ALL") {
    nextQuery = nextQuery.eq("status", filters.status);
  }

  if (filters.priority && filters.priority !== "ALL") {
    nextQuery = nextQuery.eq("priority", filters.priority);
  }

  const term = filters.search ? sanitizeSearchTerm(filters.search) : "";
  if (term) {
    nextQuery = nextQuery.or(
      `ticket_id.ilike.%${term}%,title.ilike.%${term}%,description.ilike.%${term}%,location.ilike.%${term}%`,
    );
  }

  return nextQuery;
}

function applyAdminFilters(
  query: ReturnType<typeof supabase.from<"issues">>,
  filters: AdminIssueFilters,
) {
  let nextQuery = query.is("deleted_at", null);

  if (filters.status && filters.status !== "ALL") {
    nextQuery = nextQuery.eq("status", filters.status);
  }

  if (filters.priority && filters.priority !== "ALL") {
    nextQuery = nextQuery.eq("priority", filters.priority);
  }

  if (filters.category && filters.category !== "ALL") {
    nextQuery = nextQuery.eq("category", filters.category);
  }

  if (filters.departmentId && filters.departmentId !== "ALL") {
    nextQuery = nextQuery.eq("assigned_department", filters.departmentId);
  }

  const term = filters.search ? sanitizeSearchTerm(filters.search) : "";
  if (term) {
    nextQuery = nextQuery.or(
      `ticket_id.ilike.%${term}%,title.ilike.%${term}%,description.ilike.%${term}%,location.ilike.%${term}%`,
    );
  }

  return nextQuery;
}

export function mapPublicIssueRow(issue: PublicIssueRow): Issue {
  const title = normalizeText(issue.title);
  const description = normalizeText(issue.description);
  const location = normalizeText(issue.location);
  const images = issue.images ?? [];

  return {
    id: issue.ticket_id,
    ticketId: issue.ticket_id,
    title,
    description,
    publicTitle: title,
    publicDescription: description,
    category: normalizeText(issue.category, "OTHER"),
    priority: toIssuePriority(issue.priority),
    status: toIssueStatus(issue.status),
    location,
    images,
    publicImages: images,
    isPublic: true,
    isCampusImprovement: Boolean(issue.show_as_campus_improvement),
    dateReported: issue.created_at,
    lastUpdated: issue.updated_at,
    publicVisibility: "PUBLIC",
    timeline: [],
  };
}

export function mapAdminIssueRow(issue: AdminIssueRow): Issue {
  return {
    id: issue.id,
    ticketId: issue.ticket_id,
    title: issue.title,
    description: normalizeText(issue.description),
    publicTitle: issue.public_title ?? undefined,
    publicDescription: issue.public_description ?? undefined,
    category: normalizeText(issue.category, "OTHER"),
    priority: toIssuePriority(issue.priority),
    status: toIssueStatus(issue.status),
    location: normalizeText(issue.location),
    gpsCoordinates:
      issue.latitude != null && issue.longitude != null
        ? { lat: issue.latitude, lng: issue.longitude }
        : undefined,
    images: issue.images ?? [],
    publicImages: issue.public_images ?? [],
    reporterId: issue.reporter_id,
    isPublic: issue.public_visibility === "PUBLIC",
    isCampusImprovement: Boolean(issue.show_as_campus_improvement),
    departmentAssigned: issue.assigned_department,
    assignee: issue.assigned_staff,
    dateReported: issue.created_at,
    lastUpdated: issue.updated_at,
    dueDate: issue.due_date ?? undefined,
    resolvedAt: issue.resolved_at,
    closedAt: issue.closed_at,
    publicVisibility: issue.public_visibility,
    deletedAt: issue.deleted_at,
    timeline: [],
  };
}

export function mapDepartmentRow(department: DepartmentRow): Department {
  return {
    id: department.id,
    name: department.name,
    description: department.description,
    managerId: department.manager_id,
    staffMembers: department.staff_members ?? [],
  };
}

async function exactCount<T extends "issues" | "public_issues_view">(
  table: T,
  apply: (
    query: T extends "issues"
      ? ReturnType<typeof supabase.from<"issues">>
      : ReturnType<typeof supabase.from<"public_issues_view">>,
  ) => unknown,
) {
  const baseQuery =
    table === "issues"
      ? supabase.from("issues").select("*", { head: true, count: "exact" })
      : supabase.from("public_issues_view").select("*", { head: true, count: "exact" });

  const { count, error } = await (apply(baseQuery as never) as PromiseLike<{
    count: number | null;
    error: Error | null;
  }>);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function getPublicIssuesPage(filters: PublicIssueFilters, pageParam = 0) {
  const from = pageParam * PUBLIC_PAGE_SIZE;
  const to = from + PUBLIC_PAGE_SIZE - 1;

  let query = supabase
    .from("public_issues_view")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  query = applyPublicFilters(query, filters);

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return {
    items: (data ?? []).map(mapPublicIssueRow),
    nextPage: (data?.length ?? 0) < PUBLIC_PAGE_SIZE ? undefined : pageParam + 1,
  };
}

export async function getPublicIssueStats(): Promise<PublicIssueStats> {
  const [total, pending, inProgress, resolved, critical, summaryResult] = await Promise.all([
    exactCount("public_issues_view", (query) => query),
    exactCount("public_issues_view", (query) => query.in("status", PENDING_STATUSES)),
    exactCount("public_issues_view", (query) => query.in("status", IN_PROGRESS_STATUSES)),
    exactCount("public_issues_view", (query) => query.in("status", RESOLVED_STATUSES)),
    exactCount("public_issues_view", (query) => query.eq("priority", "HIGH")),
    supabase
      .from("public_issues_view")
      .select("category, location, created_at")
      .order("created_at", { ascending: false }),
  ]);

  if (summaryResult.error) {
    throw summaryResult.error;
  }

  const summaryRows = summaryResult.data ?? [];
  const now = new Date();
  const currentPeriodStart = subDays(now, 7);
  const previousPeriodStart = subDays(now, 14);

  let currentPeriodCount = 0;
  let previousPeriodCount = 0;
  const categoryCounts = new Map<string, number>();
  const locationCounts = new Map<string, number>();

  for (const row of summaryRows) {
    const createdAt = new Date(row.created_at);
    const category = normalizeText(row.category, "Uncategorized");
    const location = normalizeText(row.location, "Unknown area");

    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    locationCounts.set(location, (locationCounts.get(location) ?? 0) + 1);

    if (createdAt >= currentPeriodStart) {
      currentPeriodCount += 1;
    } else if (createdAt >= previousPeriodStart) {
      previousPeriodCount += 1;
    }
  }

  const trendDelta = currentPeriodCount - previousPeriodCount;
  const trendBase = previousPeriodCount || 1;
  const trendPercent = Math.round((Math.abs(trendDelta) / trendBase) * 100);

  return {
    total,
    pending,
    inProgress,
    resolved,
    critical,
    topCategory: [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "No data yet",
    topLocation: [...locationCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "No data yet",
    trendLabel: `${trendPercent}%`,
    trendUp: trendDelta >= 0,
  };
}

export async function getAdminIssues(filters: AdminIssueFilters) {
  let query = supabase
    .from("issues")
    .select(
      "id, ticket_id, reporter_id, title, description, category, priority, status, location, latitude, longitude, images, assigned_department, assigned_staff, due_date, resolved_at, closed_at, created_at, updated_at, public_visibility, public_title, public_description, public_location, public_images, show_as_campus_improvement, deleted_at",
    )
    .order("created_at", { ascending: false });

  query = applyAdminFilters(query, filters);

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data ?? []).map(mapAdminIssueRow);
}

export async function getAdminIssueStats(): Promise<AdminIssueStats> {
  const [total, pending, inProgress, resolved, critical] = await Promise.all([
    exactCount("issues", (query) => query.is("deleted_at", null)),
    exactCount("issues", (query) => query.is("deleted_at", null).in("status", PENDING_STATUSES)),
    exactCount("issues", (query) => query.is("deleted_at", null).in("status", IN_PROGRESS_STATUSES)),
    exactCount("issues", (query) => query.is("deleted_at", null).in("status", RESOLVED_STATUSES)),
    exactCount("issues", (query) => query.is("deleted_at", null).eq("priority", "HIGH")),
  ]);

  return { total, pending, inProgress, resolved, critical };
}

export async function getDepartments() {
  const { data, error } = await supabase
    .from("departments")
    .select("id, name, description, manager_id, staff_members")
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapDepartmentRow);
}
