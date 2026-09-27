import { createClient } from "@/lib/supabase/server";
import { CompanionCard } from "@/components/CompanionCard";
import { EmptyState } from "@/components/EmptyState";
import { AREA_OPTIONS } from "@/lib/constants";

export default async function CompanionsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("companion_profiles")
    .select("*, profiles(*)")
    .eq("verification_status", "approved");

  const { data } = await query;
  const reviews = await supabase.from("reviews").select("reviewee_id, rating");

  const ratingMap = new Map<string, { sum: number; count: number }>();
  for (const review of reviews.data ?? []) {
    const current = ratingMap.get(review.reviewee_id) ?? { sum: 0, count: 0 };
    current.sum += review.rating;
    current.count += 1;
    ratingMap.set(review.reviewee_id, current);
  }

  const companions = (data ?? []).filter((item) => {
    const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
    const areaOk = !params.area || (item.service_areas ?? []).includes(params.area);
    const text = `${profile?.full_name ?? ""} ${item.intro ?? ""} ${(item.skills ?? []).join(" ")}`.toLowerCase();
    const qOk = !params.q || text.includes(params.q.toLowerCase());
    return areaOk && qOk;
  });

  return (
    <div className="page-wrap py-10">
      <h1 className="text-4xl font-bold">ค้นหาผู้ช่วยร่วมเดินทาง</h1>
      <p className="mt-3 text-lg text-muted">
        ดูประสบการณ์ ความสามารถ พื้นที่ให้บริการ และช่วงเวลาที่สะดวก แล้วเลือกคนที่เหมาะกับธุระของคุณ
      </p>

      <form className="card mt-6 grid gap-3 p-4 md:grid-cols-[1fr_220px_auto]">
        <input name="q" defaultValue={params.q} className="input" placeholder="ค้นหาชื่อ ความสามารถ หรือคำสำคัญ" />
        <select name="area" defaultValue={params.area} className="select">
          <option value="">ทุกพื้นที่</option>
          {AREA_OPTIONS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
        <button className="btn btn-primary">ค้นหา</button>
      </form>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {companions.length ? (
          companions.map((item) => {
            const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
            const rating = ratingMap.get(item.user_id);
            return (
              <CompanionCard
                key={item.user_id}
                id={item.user_id}
                name={profile?.full_name ?? "ผู้ช่วย"}
                avatarUrl={profile?.avatar_url}
                intro={item.intro}
                areas={item.service_areas ?? []}
                skills={item.skills ?? []}
                hourlyRate={item.hourly_rate}
                rating={rating ? rating.sum / rating.count : 0}
                reviewCount={rating?.count ?? 0}
              />
            );
          })
        ) : (
          <div className="md:col-span-3">
            <EmptyState title="ยังไม่พบผู้ช่วย" hint="ลองเปลี่ยนคำค้นหรือพื้นที่ หรือกลับมาใหม่เมื่อมีผู้ช่วยผ่านการตรวจสอบ" />
          </div>
        )}
      </div>
    </div>
  );
}
