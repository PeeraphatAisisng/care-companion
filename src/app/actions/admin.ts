"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import type { RequestStatus, UserRole, VerificationStatus } from "@/lib/types";

export async function adminUpdateUser(formData: FormData) {
  const { supabase } = await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "") as UserRole;
  const isActive = String(formData.get("is_active") ?? "") === "true";

  const { error } = await supabase
    .from("profiles")
    .update({ role, is_active: isActive })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function adminVerifyCompanion(formData: FormData) {
  const { supabase } = await requireRole("admin");
  const userId = String(formData.get("user_id") ?? "");
  const status = String(formData.get("status") ?? "") as VerificationStatus;

  const { error } = await supabase
    .from("companion_profiles")
    .update({ verification_status: status })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/companions");
  revalidatePath("/admin");
  revalidatePath("/companions");
}

export async function adminUpdateRequestStatus(formData: FormData) {
  const { supabase } = await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as RequestStatus;

  const { error } = await supabase
    .from("service_requests")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/requests");
  revalidatePath("/admin");
}
