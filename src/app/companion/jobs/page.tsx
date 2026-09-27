import { requireRole } from "@/lib/auth";
import { EmptyState } from "@/components/EmptyState";
import { RequestCard } from "@/components/RequestCard";
import type { ServiceRequest } from "@/lib/types";

export default async function CompanionJobsPage() {
  const { supabase, profile } = await requireRole("companion");
  const { data: assigned } = await supabase
    .from("service_requests")
    .select("*")
    .eq("companion_id", profile.id)
    .order("scheduled_date", { ascending: true });

  const { data: openJobs } = await supabase
    .from("service_requests")
    .select("*")
    .eq("status", "open")
    .order("scheduled_date", { ascending: true });

  return (
    <div className="page-wrap py-10">
      <h1 className="text-4xl font-bold">งานของผู้ช่วย</h1>
      <section className="mt-8">
        <h2 className="text-2xl font-bold">งานที่ได้รับมอบหมาย / รอตอบรับ</h2>
        <div className="mt-4 grid gap-4">
          {(assigned ?? []).length ? (
            (assigned as ServiceRequest[]).map((job) => (
              <RequestCard key={job.id} request={job} href={`/companion/jobs/${job.id}`} />
            ))
          ) : (
            <EmptyState title="ยังไม่มีงานของฉัน" hint="สมัครงานที่เปิดรับ หรือรอลูกค้าส่งคำขอถึงคุณ" />
          )}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-bold">งานที่เปิดรับผู้ช่วย</h2>
        <div className="mt-4 grid gap-4">
          {(openJobs ?? []).length ? (
            (openJobs as ServiceRequest[]).map((job) => (
              <RequestCard key={job.id} request={job} href={`/companion/jobs/${job.id}`} />
            ))
          ) : (
            <EmptyState title="ยังไม่มีงานเปิดรับ" hint="ยังไม่มีคำขอที่เปิดให้สมัครในขณะนี้" />
          )}
        </div>
      </section>
    </div>
  );
}
