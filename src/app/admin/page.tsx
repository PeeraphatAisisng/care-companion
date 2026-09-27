import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { REQUEST_STATUS } from "@/lib/constants";

export default async function AdminPage() {
  const { supabase } = await requireRole("admin");

  const [{ count: users }, { count: customers }, { count: companions }, { count: requests }, { data: byStatus }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "companion"),
      supabase.from("service_requests").select("*", { count: "exact", head: true }),
      supabase.from("service_requests").select("status"),
    ]);

  const statusCounts = Object.fromEntries(
    Object.keys(REQUEST_STATUS).map((status) => [
      status,
      (byStatus ?? []).filter((item) => item.status === status).length,
    ]),
  );

  const { count: pendingCompanions } = await supabase
    .from("companion_profiles")
    .select("*", { count: "exact", head: true })
    .eq("verification_status", "pending");

  return (
    <div className="page-wrap py-10">
      <h1 className="text-4xl font-bold">แดชบอร์ดผู้ดูแลระบบ</h1>
      <p className="mt-3 text-lg text-muted">บริหารข้อมูลภาพรวมของแพลตฟอร์ม รวมถึงลูกค้า ผู้ช่วย และคำขอใช้บริการ</p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ["ผู้ใช้ทั้งหมด", users ?? 0, "/admin/users"],
          ["ลูกค้า", customers ?? 0, "/admin/users"],
          ["ผู้ช่วย", companions ?? 0, "/admin/companions"],
          ["คำขอทั้งหมด", requests ?? 0, "/admin/requests"],
        ].map(([label, value, href]) => (
          <Link key={label} href={String(href)} className="card p-5">
            <p className="text-muted">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-2xl font-bold">สถานะคำขอ</h2>
          <div className="mt-4 grid gap-3">
            {Object.entries(REQUEST_STATUS).map(([status, meta]) => {
              const count = statusCounts[status] ?? 0;
              const width = requests ? Math.max(8, Math.round((count / (requests || 1)) * 100)) : 8;
              return (
                <div key={status}>
                  <div className="mb-1 flex justify-between text-sm font-semibold">
                    <span>{meta.label}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-3 rounded-full bg-sand">
                    <div className="h-3 rounded-full bg-teal" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-2xl font-bold">งานที่ต้องดูแล</h2>
          <p className="mt-4 text-lg">ผู้ช่วยรอตรวจสอบ: {pendingCompanions ?? 0} คน</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/admin/companions" className="btn btn-primary">
              ตรวจสอบผู้ช่วย
            </Link>
            <Link href="/admin/users" className="btn btn-ghost">
              จัดการผู้ใช้
            </Link>
            <Link href="/admin/requests" className="btn btn-ghost">
              จัดการคำขอ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
