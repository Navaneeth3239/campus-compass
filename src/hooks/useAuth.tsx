import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { getSession, getUserProfile, isAdminLevelRole, signOut } from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/query-keys";
import { supabase } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/types/issues";

interface AuthContextValue {
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdminLevel: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const syncAuthState = async (nextSession?: Session | null) => {
      setIsLoading(true);

      const activeSession = nextSession ?? (await getSession());
      if (cancelled) {
        return;
      }

      setSession(activeSession);

      if (!activeSession?.user) {
        setProfile(null);
        queryClient.removeQueries({ queryKey: queryKeys.authProfile });
        setIsLoading(false);
        return;
      }

      try {
        const nextProfile = await getUserProfile(activeSession.user.id);
        if (!cancelled) {
          setProfile(nextProfile);
          queryClient.setQueryData(queryKeys.authProfile, nextProfile);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    syncAuthState().catch(() => {
      if (!cancelled) {
        setSession(null);
        setProfile(null);
        setIsLoading(false);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncAuthState(nextSession);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      isLoading,
      isAdminLevel: isAdminLevelRole(profile?.role),
      signOut,
    }),
    [isLoading, profile, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
