"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";

export async function submitReview(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  const requestId = String(formData.get("request_id") ?? "");
  const rating = Number(formData.get("rating") || 0);
  const comment = String(formData.get("comment") ?? "").trim();

  if (rating < 1 || rating > 5) {
    throw new Error("กรุณาให้คะแนน 1 ถึง 5 ดาว");
  }

  const { data: request } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (!request || request.status !== "completed") {
    throw new Error("ให้รีวิวได้เมื่อบริการเสร็จสิ้นแล้วเท่านั้น");
  }

  const revieweeId =
    request.customer_id === profile.id
      ? request.companion_id
      : request.companion_id === profile.id
        ? request.customer_id
        : null;

  if (!revieweeId) throw new Error("คุณไม่ได้อยู่ในงานนี้");

  const { error } = await supabase.from("reviews").insert({
    request_id: requestId,
    reviewer_id: profile.id,
    reviewee_id: revieweeId,
    rating,
    comment: comment || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/requests/${requestId}`);
  revalidatePath(`/companions/${revieweeId}`);
}
