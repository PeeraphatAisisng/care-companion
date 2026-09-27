"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function list(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => String(value))
    .filter(Boolean);
}

export async function completeOnboarding(formData: FormData) {
  const { supabase, user, profile } = await requireUser();
  const role = text(formData, "role") as UserRole;
  if (role !== "customer" && role !== "companion") {
    throw new Error("กรุณาเลือกบทบาท");
  }
  if (profile?.role) {
    redirect("/dashboard");
  }

  const fullName = text(formData, "full_name");
  const phone = text(formData, "phone");
  if (!fullName || !phone) {
    throw new Error("กรุณากรอกชื่อและเบอร์โทร");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      role,
      full_name: fullName,
      phone,
      date_of_birth: text(formData, "date_of_birth") || null,
      address: text(formData, "address") || null,
      emergency_contact_name: text(formData, "emergency_contact_name") || null,
      emergency_contact_phone: text(formData, "emergency_contact_phone") || null,
      bio: text(formData, "bio") || null,
    })
    .eq("id", user!.id);

  if (error) throw new Error(error.message);

  if (role === "companion") {
    const { error: companionError } = await supabase.from("companion_profiles").upsert({
      user_id: user!.id,
      intro: text(formData, "intro") || null,
      experience_years: Number(formData.get("experience_years") || 0),
      skills: list(formData, "skills"),
      service_areas: list(formData, "service_areas"),
      available_days: list(formData, "available_days"),
      available_from: text(formData, "available_from") || null,
      available_to: text(formData, "available_to") || null,
      hourly_rate: text(formData, "hourly_rate")
        ? Number(formData.get("hourly_rate"))
        : null,
      languages: list(formData, "languages"),
      verification_status: "pending",
    });
    if (companionError) throw new Error(companionError.message);
  }

  revalidatePath("/", "layout");
  redirect(role === "companion" ? "/companion" : "/dashboard");
}

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: text(formData, "full_name"),
      phone: text(formData, "phone") || null,
      date_of_birth: text(formData, "date_of_birth") || null,
      address: text(formData, "address") || null,
      emergency_contact_name: text(formData, "emergency_contact_name") || null,
      emergency_contact_phone: text(formData, "emergency_contact_phone") || null,
      bio: text(formData, "bio") || null,
    })
    .eq("id", user!.id);

  if (error) throw new Error(error.message);
  revalidatePath("/profile");
  revalidatePath("/companion/profile");
}

export async function updateCompanionProfile(formData: FormData) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("companion_profiles").upsert({
    user_id: user!.id,
    intro: text(formData, "intro") || null,
    experience_years: Number(formData.get("experience_years") || 0),
    skills: list(formData, "skills"),
    service_areas: list(formData, "service_areas"),
    available_days: list(formData, "available_days"),
    available_from: text(formData, "available_from") || null,
    available_to: text(formData, "available_to") || null,
    hourly_rate: text(formData, "hourly_rate")
      ? Number(formData.get("hourly_rate"))
      : null,
    languages: list(formData, "languages"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/companion/profile");
  revalidatePath("/companions");
}
