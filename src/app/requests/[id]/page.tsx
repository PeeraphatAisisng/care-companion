import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { Avatar } from "@/components/Avatar";
import { StatusBadge } from "@/components/StatusBadge";
import { ReviewForm } from "@/components/ReviewForm";
import { ApplicationDecision, ApplyForm, StatusForm } from "@/components/RequestActions";
import { errandLabel, formatDate, formatTime } from "@/lib/utils";
import type { Application, Profile, Review, ServiceRequest } from "@/lib/types";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, profile } = await requireProfile();
  const { data: request } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!request) notFound();
  const item = request as ServiceRequest;

  const ids = [item.customer_id, item.companion_id].filter(Boolean) as string[];
  const { data: people } = await supabase.from("profiles").select("*").in("id", ids);
  const customer = (people as Profile[] | null)?.find((person) => person.id === item.customer_id) ?? null;
  const companion = (people as Profile[] | null)?.find((person) => person.id === item.companion_id) ?? null;

  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .eq("request_id", id)
    .order("created_at", { ascending: false });

  const applicantIds = (applications ?? []).map((app) => app.companion_id);
  const { data: applicants } = applicantIds.length
    ? await supabase.from("profiles").select("*").in("id", applicantIds)
    : { data: [] as Profile[] };

  const { data: reviews } = await supabase.from("reviews").select("*").eq("request_id", id);
  const myReview = (reviews as Review[] | null)?.find((review) => review.reviewer_id === profile.id);
  const myApplication = (applications ?? []).find((app) => app.companion_id === profile.id);
  const isCustomer = profile.id === item.customer_id;
  const canSeeContact = ["accepted", "in_progress", "completed"].includes(item.status);

  return (
    <div className="page-wrap grid gap-6 py-10 lg:grid-cols-[1.2fr_.8fr]">
      <section className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="chip bg-sand text-teal">{errandLabel(item.errand_type)}</p>
          <StatusBadge status={item.status} />
        </div>
        <h1 className="mt-4 text-3xl font-bold">{item.title}</h1>
        <p className="mt-4 text-lg text-muted">{item.description}</p>
        <div className="mt-6 grid gap-2 text-lg">
          <p>วันที่: {formatDate(item.scheduled_date)}</p>
          <p>เวลา: {formatTime(item.scheduled_time)}</p>
          <p>ระยะเวลา: {item.duration_hours} ชั่วโมง</p>
          <p>ต้นทาง: {item.origin}</p>
          <p>จุดหมาย: {item.destination}</p>
          {item.notes ? <p>หมายเหตุ: {item.notes}</p> : null}
        </div>
      </section>

      <aside className="grid gap-4">
        <div className="card p-5">
          <h2 className="font-bold">ผู้ใช้บริการ</h2>
          <div className="mt-3 flex items-center gap-3">
            <Avatar name={customer?.full_name ?? "ลูกค้า"} src={customer?.avatar_url} />
            <div>
              <p className="font-bold">{customer?.full_name}</p>
              {canSeeContact ? (
                <p className="text-muted">{customer?.phone}</p>
              ) : (
                <p className="text-muted">เบอร์โทรจะแสดงหลังตอบรับงาน</p>
              )}
            </div>
          </div>
        </div>

        {companion ? (
          <div className="card p-5">
            <h2 className="font-bold">ผู้ช่วยร่วมเดินทาง</h2>
            <div className="mt-3 flex items-center gap-3">
              <Avatar name={companion.full_name} src={companion.avatar_url} />
              <div>
                <p className="font-bold">{companion.full_name}</p>
                {canSeeContact ? <p className="text-muted">{companion.phone}</p> : null}
              </div>
            </div>
          </div>
        ) : null}

        {isCustomer && item.status === "open" ? (
          <StatusForm requestId={id} status="cancelled" label="ยกเลิกคำขอ" danger />
        ) : null}
        {isCustomer && item.status === "accepted" ? (
          <StatusForm requestId={id} status="in_progress" label="เริ่มการเดินทาง" />
        ) : null}
        {(isCustomer || item.companion_id === profile.id) && item.status === "in_progress" ? (
          <StatusForm requestId={id} status="completed" label="ปิดงาน / บริการเสร็จสิ้น" />
        ) : null}
        {item.companion_id === profile.id && item.status === "pending" ? (
          <div className="flex gap-2">
            <StatusForm requestId={id} status="accepted" label="ตอบรับงาน" />
            <StatusForm requestId={id} status="rejected" label="ปฏิเสธ" danger />
          </div>
        ) : null}
        {item.companion_id === profile.id && item.status === "accepted" ? (
          <StatusForm requestId={id} status="in_progress" label="เริ่มให้บริการ" />
        ) : null}

        {profile.role === "companion" && item.status === "open" && !myApplication ? (
          <ApplyForm requestId={id} />
        ) : null}
        {myApplication ? (
          <p className="card p-4">คุณส่งใบสมัครแล้ว สถานะ: {myApplication.status}</p>
        ) : null}

        {item.status === "completed" && !myReview && (isCustomer || item.companion_id === profile.id) ? (
          <ReviewForm requestId={id} />
        ) : null}
      </aside>

      {isCustomer && item.status === "open" ? (
        <section className="card p-6 lg:col-span-2">
          <h2 className="text-2xl font-bold">ผู้ช่วยที่เสนอตัว</h2>
          <div className="mt-4 grid gap-4">
            {(applications ?? []).length ? (
              (applications ?? []).map((application) => {
                const person = (applicants as Profile[] | null)?.find(
                  (applicant) => applicant.id === application.companion_id,
                );
                return (
                  <div key={application.id} className="rounded-2xl border border-line p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={person?.full_name ?? "ผู้ช่วย"} src={person?.avatar_url} />
                        <div>
                          <p className="font-bold">{person?.full_name}</p>
                          <p className="text-muted">{application.message || "พร้อมให้ความช่วยเหลือ"}</p>
                        </div>
                      </div>
                      {application.status === "pending" ? (
                        <ApplicationDecision application={application as Application} />
                      ) : (
                        <p>{application.status}</p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted">ยังไม่มีผู้ช่วยสมัครเข้ามา</p>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
