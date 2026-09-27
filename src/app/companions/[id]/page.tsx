import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { Avatar } from "@/components/Avatar";
import { RequestForm } from "@/components/forms/RequestForm";
import { formatBaht, formatDays, formatTime } from "@/lib/utils";
import type { CompanionProfile, Profile, Review } from "@/lib/types";

export default async function CompanionPublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { profile: viewer } = await getCurrentProfile();

  const { data: companion } = await supabase
    .from("companion_profiles")
    .select("*")
    .eq("user_id", id)
    .eq("verification_status", "approved")
    .maybeSingle();

  const { data: person } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (!companion || !person) notFound();

  const profile = person as Profile;
  const details = companion as CompanionProfile;
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("reviewee_id", id)
    .order("created_at", { ascending: false });

  const list = (reviews ?? []) as Review[];
  const avg = list.length ? list.reduce((sum, item) => sum + item.rating, 0) / list.length : 0;

  return (
    <div className="page-wrap grid gap-6 py-10 lg:grid-cols-[1.1fr_.9fr]">
      <article className="card p-6">
        <div className="flex items-start gap-4">
          <Avatar name={profile.full_name} src={profile.avatar_url} size={80} />
          <div>
            <h1 className="text-3xl font-bold">{profile.full_name}</h1>
            <p className="mt-2 text-muted">
              {list.length ? `คะแนนเฉลี่ย ${avg.toFixed(1)} จาก ${list.length} รีวิว` : "ยังไม่มีรีวิว"}
            </p>
          </div>
        </div>
        <p className="mt-5 text-lg">{details.intro || profile.bio}</p>
        <div className="mt-6 grid gap-3 text-muted">
          <p>ประสบการณ์ {details.experience_years ?? 0} ปี</p>
          <p>พื้นที่ให้บริการ: {(details.service_areas ?? []).join(", ") || "-"}</p>
          <p>วันที่สะดวก: {formatDays(details.available_days ?? []) || "-"}</p>
          <p>
            ช่วงเวลา: {details.available_from ? formatTime(details.available_from) : "-"} -{" "}
            {details.available_to ? formatTime(details.available_to) : "-"}
          </p>
          <p>ภาษา: {(details.languages ?? []).join(", ")}</p>
          <p>อัตราค่าบริการ: {formatBaht(details.hourly_rate)} / ชั่วโมง</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {(details.skills ?? []).map((skill) => (
            <span key={skill} className="chip bg-teal-soft text-teal">
              {skill}
            </span>
          ))}
        </div>
      </article>

      <aside className="grid gap-4">
        {viewer?.role === "customer" ? (
          <div>
            <h2 className="mb-3 text-2xl font-bold">ขอใช้บริการผู้ช่วยคนนี้</h2>
            <RequestForm companionId={id} />
          </div>
        ) : (
          <div className="card p-6">
            <h2 className="text-2xl font-bold">ต้องการผู้ช่วยคนนี้?</h2>
            <p className="mt-2 text-muted">เข้าสู่ระบบในฐานะผู้ใช้บริการเพื่อส่งคำขอโดยตรง</p>
            <Link href="/login" className="btn btn-primary mt-4">
              เข้าสู่ระบบ
            </Link>
          </div>
        )}

        <div className="card p-6">
          <h2 className="text-2xl font-bold">รีวิว</h2>
          <div className="mt-4 grid gap-3">
            {list.length ? (
              list.map((review) => (
                <div key={review.id} className="rounded-2xl bg-sand/60 p-4">
                  <p className="font-bold">{review.rating} ดาว</p>
                  <p className="mt-1">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">ยังไม่มีรีวิวสาธารณะ</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
