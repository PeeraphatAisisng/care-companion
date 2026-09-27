"use server";

import { revalidatePath } from "next/cache";
import { getCompanionProfile, requireProfile } from "@/lib/auth";

export async function applyToRequest(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  if (profile.role !== "companion") {
    throw new Error("เฉพาะผู้ช่วยร่วมเดินทางเท่านั้นที่สมัครได้");
  }

  const companion = await getCompanionProfile(profile.id);
  if (companion?.verification_status !== "approved") {
    throw new Error("บัญชีผู้ช่วยต้องผ่านการตรวจสอบจากแอดมินก่อน");
  }

  const requestId = String(formData.get("request_id") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  const { data: request } = await supabase
    .from("service_requests")
    .select("id, status, customer_id")
    .eq("id", requestId)
    .single();

  if (!request || request.status !== "open") {
    throw new Error("คำขอนี้ไม่เปิดรับผู้ช่วยแล้ว");
  }
  if (request.customer_id === profile.id) {
    throw new Error("ไม่สามารถสมัครงานของตนเองได้");
  }

  const { error } = await supabase.from("applications").insert({
    request_id: requestId,
    companion_id: profile.id,
    message: message || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/requests/${requestId}`);
  revalidatePath("/companion/jobs");
}

export async function decideApplication(
  applicationId: string,
  accept: boolean,
) {
  const { supabase, profile } = await requireProfile();
  const { data: application, error } = await supabase
    .from("applications")
    .select("*, service_requests(*)")
    .eq("id", applicationId)
    .single();

  if (error || !application) throw new Error("ไม่พบใบสมัคร");

  const request = Array.isArray(application.service_requests)
    ? application.service_requests[0]
    : application.service_requests;

  if (!request || request.customer_id !== profile.id) {
    throw new Error("เฉพาะเจ้าของคำขอเท่านั้นที่เลือกผู้ช่วยได้");
  }

  if (accept) {
    const { error: requestError } = await supabase
      .from("service_requests")
      .update({
        companion_id: application.companion_id,
        status: "accepted",
      })
      .eq("id", request.id);
    if (requestError) throw new Error(requestError.message);

    await supabase
      .from("applications")
      .update({ status: "accepted" })
      .eq("id", applicationId);

    await supabase
      .from("applications")
      .update({ status: "rejected" })
      .eq("request_id", request.id)
      .neq("id", applicationId);
  } else {
    const { error: rejectError } = await supabase
      .from("applications")
      .update({ status: "rejected" })
      .eq("id", applicationId);
    if (rejectError) throw new Error(rejectError.message);
  }

  revalidatePath(`/requests/${request.id}`);
  revalidatePath("/companion/jobs");
}
