import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { adminUpdateRequestStatus } from "@/app/actions/admin";
import { StatusBadge } from "@/components/StatusBadge";
import { REQUEST_STATUS } from "@/lib/constants";
import { errandLabel, formatDate } from "@/lib/utils";
import type { RequestStatus, ServiceRequest } from "@/lib/types";

export default async function AdminRequestsPage() {
  const { supabase } = await requireRole("admin");
  const { data: requests } = await supabase
    .from("service_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="page-wrap py-10">
      <h1 className="text-4xl font-bold">จัดการคำขอใช้บริการ</h1>
      <div className="mt-6 grid gap-4">
        {(requests as ServiceRequest[] | null)?.map((request) => (
          <article key={request.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="chip bg-sand text-teal">{errandLabel(request.errand_type)}</p>
                <h2 className="mt-2 text-xl font-bold">{request.title}</h2>
                <p className="text-muted">
                  {formatDate(request.scheduled_date)} · {request.origin} → {request.destination}
                </p>
              </div>
              <StatusBadge status={request.status} />
            </div>
            <form action={adminUpdateRequestStatus} className="mt-4 flex flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={request.id} />
              <select name="status" className="select max-w-56" defaultValue={request.status}>
                {(Object.keys(REQUEST_STATUS) as RequestStatus[]).map((status) => (
                  <option key={status} value={status}>
                    {REQUEST_STATUS[status].label}
                  </option>
                ))}
              </select>
              <button className="btn btn-primary">อัปเดตสถานะ</button>
              <Link href={`/requests/${request.id}`} className="btn btn-ghost">
                ดูรายละเอียด
              </Link>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
