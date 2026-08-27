import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "@/lib/campsolver/api";

const EVENTS = [
  "issueCreated",
  "issueUpdated",
  "issueStatusChanged",
  "issueResolved",
  "issuePublicVisibilityChanged",
] as const;

const INVALIDATED_KEYS = [
  ["public-issues"],
  ["public-improvements"],
  ["public-statistics"],
  ["public-counters"],
];

/**
 * Connects to the public Socket.IO namespace and refreshes cached public data in
 * place on every realtime event. Returns connection state so callers can enable a
 * REST polling fallback while the socket is down.
 */
export function usePublicRealtime() {
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const [lastEventAt, setLastEventAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!SOCKET_URL) return;

    let socket: Socket;
    try {
      socket = io(`${SOCKET_URL}/public`, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 2000,
      });
    } catch {
      return;
    }

    const refresh = () => {
      setLastEventAt(new Date());
      INVALIDATED_KEYS.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
    };

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setConnected(false));
    EVENTS.forEach((event) => socket.on(event, refresh));

    return () => {
      EVENTS.forEach((event) => socket.off(event, refresh));
      socket.disconnect();
    };
  }, [queryClient]);

  return { connected, lastEventAt };
}
