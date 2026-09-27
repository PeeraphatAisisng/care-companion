"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import type { ErrandType, RequestStatus } from "@/lib/types";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createRequest(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  if (profile.role !== "customer" && profile.role !== "admin") {
    throw new Error("เฉพาะผู้ใช้บริการเท่านั้นที่สร้างคำขอได้");
  }
  if (!profile.phone) {
    throw new Error("กรุณาเพิ่มเบอร์โทรในโปรไฟล์ก่อนสร้างคำขอ");
  }

  const companionId = text(formData, "companion_id") || null;
  const payload = {
    customer_id: profile.id,
    companion_id: companionId,
    errand_type: text(formData, "errand_type") as ErrandType,
    title: text(formData, "title"),
    description: text(formData, "description") || null,
    origin: text(formData, "origin"),
    destination: text(formData, "destination"),
    scheduled_date: text(formData, "scheduled_date"),
    scheduled_time: text(formData, "scheduled_time"),
    duration_hours: Number(formData.get("duration_hours") || 2),
    notes: text(formData, "notes") || null,
    status: companionId ? "pending" : "open",
  };

  if (!payload.title || !payload.origin || !payload.destination) {
    throw new Error("กรุณากรอกข้อมูลที่จำเป็นให้ครบ");
  }

  const { data, error } = await supabase
    .from("service_requests")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/requests");
  revalidatePath("/dashboard");
  redirect(`/requests/${data.id}`);
}

export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus,
) {
  const { supabase, profile } = await requireProfile();
  const { data: request, error: fetchError } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (fetchError || !request) throw new Error("ไม่พบคำขอใช้บริการ");

  const isOwner = request.customer_id === profile.id;
  const isCompanion = request.companion_id === profile.id;
  const isAdmin = profile.role === "admin";

  const allowed =
    (status === "cancelled" && (isOwner || isAdmin)) ||
    (status === "rejected" && (isCompanion || isAdmin)) ||
    (status === "accepted" && (isCompanion || isAdmin)) ||
    (status === "in_progress" && (isOwner || isCompanion || isAdmin)) ||
    (status === "completed" && (isOwner || isCompanion || isAdmin));

  if (!allowed) throw new Error("ไม่สามารถเปลี่ยนสถานะนี้ได้");

  const { error } = await supabase
    .from("service_requests")
    .update({ status })
    .eq("id", requestId);

  if (error) throw new Error(error.message);
  revalidatePath(`/requests/${requestId}`);
  revalidatePath("/requests");
  revalidatePath("/companion");
  revalidatePath("/admin");
}

export async function respondDirectRequest(
  requestId: string,
  accept: boolean,
) {
  await updateRequestStatus(requestId, accept ? "accepted" : "rejected");
}
