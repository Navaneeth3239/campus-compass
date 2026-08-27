import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import type { UserProfile, UserRole } from "@/lib/types/issues";

const ADMIN_LEVEL_ROLES: UserRole[] = ["ADMIN", "STAFF", "DEPT_MANAGER"];

export function isAdminLevelRole(role?: UserRole | null) {
  return role ? ADMIN_LEVEL_ROLES.includes(role) : false;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }

  return data.session;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, department_id")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    departmentId: data.department_id,
  };
}

export async function getAuthorizedSession(): Promise<{
  session: Session | null;
  profile: UserProfile | null;
  authorized: boolean;
}> {
  const session = await getSession();

  if (!session?.user) {
    return { session: null, profile: null, authorized: false };
  }

  const profile = await getUserProfile(session.user.id);
  return {
    session,
    profile,
    authorized: isAdminLevelRole(profile?.role),
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}
