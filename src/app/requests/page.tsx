import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { EmptyState } from "@/components/EmptyState";
import { RequestCard } from "@/components/RequestCard";
import type { ServiceRequest } from "@/lib/types";

export default async function RequestsPage() {
  const { supabase, profile } = await requireRole("customer");
  const { data: requests } = await supabase
    .from("service_requests")
    .select("*")
    .eq("customer_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <div className="page-wrap py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl font-bold">คำขอใช้บริการของฉัน</h1>
        <Link href="/requests/new" className="btn btn-primary">
          สร้างคำขอใหม่
        </Link>
      </div>
      <div className="mt-6 grid gap-4">
        {(requests ?? []).length ? (
          (requests as ServiceRequest[]).map((request) => (
            <RequestCard key={request.id} request={request} href={`/requests/${request.id}`} />
          ))
        ) : (
          <EmptyState
            title="ยังไม่มีคำขอ"
            hint="สร้างคำขอเพื่อค้นหาหรือเลือกผู้ช่วยที่เหมาะสม"
            href="/requests/new"
            action="สร้างคำขอ"
          />
        )}
      </div>
    </div>
  );
}
