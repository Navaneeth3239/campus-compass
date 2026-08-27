export const queryKeys = {
  publicIssues: (filters: Record<string, unknown>) => ["public-issues", filters] as const,
  publicIssueStats: ["public-issue-stats"] as const,
  adminIssues: (filters: Record<string, unknown>) => ["admin-issues", filters] as const,
  adminIssueStats: ["admin-issue-stats"] as const,
  departments: ["departments"] as const,
  authProfile: ["auth-profile"] as const,
};
