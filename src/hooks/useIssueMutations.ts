import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/api/query-keys";
import type { Issue } from "@/lib/types/issues";

type IssueUpdater = (issue: Issue) => Issue;

function updateAdminIssueCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  issueId: string,
  updater: IssueUpdater,
) {
  return queryClient.setQueriesData<Issue[]>({ queryKey: ["admin-issues"] }, (current) => {
    if (!current) {
      return current;
    }

    return current.map((issue) => (issue.id === issueId ? updater(issue) : issue));
  });
}

export function useResolveIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      const timestamp = new Date().toISOString();
      const { error } = await supabase
        .from("issues")
        .update({
          status: "RESOLVED",
          resolved_at: timestamp,
          updated_at: timestamp,
        })
        .eq("id", issueId);

      if (error) {
        throw error;
      }
    },
    onMutate: async (issueId) => {
      await queryClient.cancelQueries({ queryKey: ["admin-issues"] });
      const snapshots = queryClient.getQueriesData<Issue[]>({ queryKey: ["admin-issues"] });
      const timestamp = new Date().toISOString();

      updateAdminIssueCaches(queryClient, issueId, (issue) => ({
        ...issue,
        status: "RESOLVED",
        resolvedAt: timestamp,
        lastUpdated: timestamp,
      }));

      return { snapshots };
    },
    onError: (_error, _issueId, context) => {
      for (const [queryKey, data] of context?.snapshots ?? []) {
        queryClient.setQueryData(queryKey, data);
      }
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-issues"] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.adminIssueStats }),
        queryClient.invalidateQueries({ queryKey: ["public-issues"] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.publicIssueStats }),
      ]);
    },
  });
}

export function useHideIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      const timestamp = new Date().toISOString();
      const { error } = await supabase
        .from("issues")
        .update({
          public_visibility: "HIDDEN",
          updated_at: timestamp,
        })
        .eq("id", issueId);

      if (error) {
        throw error;
      }
    },
    onMutate: async (issueId) => {
      await queryClient.cancelQueries({ queryKey: ["admin-issues"] });
      const snapshots = queryClient.getQueriesData<Issue[]>({ queryKey: ["admin-issues"] });
      const timestamp = new Date().toISOString();

      updateAdminIssueCaches(queryClient, issueId, (issue) => ({
        ...issue,
        isPublic: false,
        publicVisibility: "HIDDEN",
        lastUpdated: timestamp,
      }));

      return { snapshots };
    },
    onError: (_error, _issueId, context) => {
      for (const [queryKey, data] of context?.snapshots ?? []) {
        queryClient.setQueryData(queryKey, data);
      }
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-issues"] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.adminIssueStats }),
        queryClient.invalidateQueries({ queryKey: ["public-issues"] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.publicIssueStats }),
      ]);
    },
  });
}

export function useSoftDeleteIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      const timestamp = new Date().toISOString();
      const { error } = await supabase
        .from("issues")
        .update({
          deleted_at: timestamp,
          public_visibility: "HIDDEN",
          updated_at: timestamp,
        })
        .eq("id", issueId);

      if (error) {
        throw error;
      }
    },
    onMutate: async (issueId) => {
      await queryClient.cancelQueries({ queryKey: ["admin-issues"] });
      const snapshots = queryClient.getQueriesData<Issue[]>({ queryKey: ["admin-issues"] });

      queryClient.setQueriesData<Issue[]>({ queryKey: ["admin-issues"] }, (current) =>
        current ? current.filter((issue) => issue.id !== issueId) : current,
      );

      return { snapshots };
    },
    onError: (_error, _issueId, context) => {
      for (const [queryKey, data] of context?.snapshots ?? []) {
        queryClient.setQueryData(queryKey, data);
      }
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-issues"] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.adminIssueStats }),
        queryClient.invalidateQueries({ queryKey: ["public-issues"] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.publicIssueStats }),
      ]);
    },
  });
}
