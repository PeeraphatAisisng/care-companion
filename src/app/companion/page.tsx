import Link from "next/link";
import { getCompanionProfile, requireRole } from "@/lib/auth";
import { EmptyState } from "@/components/EmptyState";
import { RequestCard } from "@/components/RequestCard";
import { VerifyBadge } from "@/components/StatusBadge";
import type { ServiceRequest } from "@/lib/types";

export default async function CompanionDashboardPage() {
  const { supabase, profile } = await requireRole("companion");
  const companion = await getCompanionProfile(profile.id);

  const { data: myJobs } = await supabase
    .from("service_requests")
    .select("*")
    .eq("companion_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: openJobs } = await supabase
    .from("service_requests")
    .select("*")
    .eq("status", "open")
    .order("scheduled_date", { ascending: true })
    .limit(5);

  return (
    <div className="page-wrap py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-muted">สวัสดี {profile.full_name}</p>
          <h1 className="text-4xl font-bold">แดชบอร์ดผู้ช่วยร่วมเดินทาง</h1>
        </div>
        <div className="flex gap-2">
          {companion ? <VerifyBadge status={companion.verification_status} /> : null}
          <Link href="/companion/profile" className="btn btn-ghost">
            แก้ไขโปรไฟล์ผู้ช่วย
          </Link>
        </div>
      </div>

      {companion?.verification_status !== "approved" ? (
        <div className="card mt-6 p-5">
          บัญชีผู้ช่วยต้องรอแอดมินตรวจสอบก่อนจึงจะสมัครงานหรือปรากฏในหน้าค้นหาได้
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-muted">งานของฉัน</p>
          <p className="mt-2 text-3xl font-bold">{myJobs?.length ?? 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-muted">งานที่เปิดรับ</p>
          <p className="mt-2 text-3xl font-bold">{openJobs?.length ?? 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-muted">พื้นที่ให้บริการ</p>
          <p className="mt-2 text-xl font-bold">{(companion?.service_areas ?? []).join(", ") || "-"}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">งานของฉัน</h2>
            <Link href="/companion/jobs" className="font-bold text-teal">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="grid gap-4">
            {(myJobs ?? []).length ? (
              (myJobs as ServiceRequest[]).map((job) => (
                <RequestCard key={job.id} request={job} href={`/companion/jobs/${job.id}`} />
              ))
            ) : (
              <EmptyState title="ยังไม่มีงานที่ตอบรับ" hint="ไปดูงานที่เปิดรับแล้วเสนอตัวเป็นผู้ช่วย" />
            )}
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-2xl font-bold">งานที่เปิดรับ</h2>
          <div className="grid gap-4">
            {(openJobs ?? []).length ? (
              (openJobs as ServiceRequest[]).map((job) => (
                <RequestCard key={job.id} request={job} href={`/companion/jobs/${job.id}`} />
              ))
            ) : (
              <EmptyState title="ยังไม่มีงานเปิดรับ" hint="เมื่อลูกค้าสร้างคำขอ งานจะปรากฏที่นี่" />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
