import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { supabase } from "@/lib/supabase/client";

export function usePublicRealtime() {
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const [lastEventAt, setLastEventAt] = useState<Date | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel("public-issues-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "issues",
          filter: "public_visibility=eq.PUBLIC",
        },
        () => {
          setLastEventAt(new Date());
          void queryClient.invalidateQueries({ queryKey: ["public-issues"] });
          void queryClient.invalidateQueries({ queryKey: queryKeys.publicIssueStats });
        },
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      setConnected(false);
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { connected, lastEventAt };
}
