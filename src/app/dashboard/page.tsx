import Link from "next/link";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { EmptyState } from "@/components/EmptyState";
import { RequestCard } from "@/components/RequestCard";
import type { ServiceRequest } from "@/lib/types";

export default async function DashboardPage() {
  const { supabase, profile } = await requireProfile();

  if (profile.role === "admin") redirect("/admin");
  if (profile.role === "companion") redirect("/companion");

  const { data: requests } = await supabase
    .from("service_requests")
    .select("*")
    .eq("customer_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="page-wrap py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-muted">สวัสดี {profile.full_name}</p>
          <h1 className="text-4xl font-bold">แดชบอร์ดผู้ใช้บริการ</h1>
        </div>
        <Link href="/requests/new" className="btn btn-primary text-lg">
          สร้างคำขอใหม่
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-muted">คำขอทั้งหมด</p>
          <p className="mt-2 text-3xl font-bold">{requests?.length ?? 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-muted">กำลังดำเนินการ</p>
          <p className="mt-2 text-3xl font-bold">
            {(requests ?? []).filter((item) =>
              ["pending", "accepted", "in_progress"].includes(item.status),
            ).length}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-muted">เสร็จสิ้นแล้ว</p>
          <p className="mt-2 text-3xl font-bold">
            {(requests ?? []).filter((item) => item.status === "completed").length}
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-2xl font-bold">คำขอล่าสุด</h2>
      <div className="mt-4 grid gap-4">
        {(requests ?? []).length ? (
          (requests as ServiceRequest[]).map((request) => (
            <RequestCard key={request.id} request={request} href={`/requests/${request.id}`} />
          ))
        ) : (
          <EmptyState
            title="ยังไม่มีคำขอ"
            hint="ระบุประเภทธุระ วันเวลา และสถานที่ เพื่อค้นหาผู้ช่วยที่เหมาะสม"
            href="/requests/new"
            action="สร้างคำขอใช้บริการ"
          />
        )}
      </div>
    </div>
  );
}
