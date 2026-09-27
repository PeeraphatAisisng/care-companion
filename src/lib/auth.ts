import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CompanionProfile, Profile, UserRole } from "@/lib/types";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function getCurrentProfile() {
  const { supabase, user } = await getSessionUser();
  if (!user) return { supabase, user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, user, profile: profile as Profile | null };
}

export async function requireUser() {
  const result = await getCurrentProfile();
  if (!result.user) redirect("/login");
  return result;
}

export async function requireProfile() {
  const result = await requireUser();
  if (!result.profile?.role) redirect("/onboarding");
  if (!result.profile.is_active) redirect("/login?error=inactive");
  return result as typeof result & { profile: Profile };
}

export async function requireRole(roles: UserRole | UserRole[]) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  const result = await requireProfile();
  if (!result.profile.role || !allowed.includes(result.profile.role)) {
    redirect("/dashboard");
  }
  return result;
}

export async function getCompanionProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("companion_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data as CompanionProfile | null;
}
