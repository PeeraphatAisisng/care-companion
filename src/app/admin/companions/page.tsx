import { requireRole } from "@/lib/auth";
import { adminVerifyCompanion } from "@/app/actions/admin";
import { Avatar } from "@/components/Avatar";
import { VerifyBadge } from "@/components/StatusBadge";

export default async function AdminCompanionsPage() {
  const { supabase } = await requireRole("admin");
  const { data: companions } = await supabase
    .from("companion_profiles")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="page-wrap py-10">
      <h1 className="text-4xl font-bold">ตรวจสอบผู้ช่วยร่วมเดินทาง</h1>
      <div className="mt-6 grid gap-4">
        {(companions ?? []).map((item) => {
          const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
          return (
            <article key={item.user_id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-3">
                  <Avatar name={profile?.full_name ?? "ผู้ช่วย"} src={profile?.avatar_url} />
                  <div>
                    <h2 className="text-xl font-bold">{profile?.full_name}</h2>
                    <p className="text-muted">{item.intro || profile?.bio}</p>
                    <p className="mt-2 text-sm">พื้นที่: {(item.service_areas ?? []).join(", ") || "-"}</p>
                    <p className="text-sm">ความสามารถ: {(item.skills ?? []).join(", ") || "-"}</p>
                  </div>
                </div>
                <VerifyBadge status={item.verification_status} />
              </div>
              <form action={adminVerifyCompanion} className="mt-4 flex flex-wrap gap-2">
                <input type="hidden" name="user_id" value={item.user_id} />
                <button name="status" value="approved" className="btn btn-primary">
                  อนุมัติ
                </button>
                <button name="status" value="rejected" className="btn btn-danger">
                  ไม่อนุมัติ
                </button>
                <button name="status" value="pending" className="btn btn-ghost">
                  รอตรวจสอบ
                </button>
              </form>
            </article>
          );
        })}
      </div>
    </div>
  );
}
