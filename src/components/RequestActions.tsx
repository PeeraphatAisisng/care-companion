import { applyToRequest, decideApplication } from "@/app/actions/applications";
import { updateRequestStatus } from "@/app/actions/requests";
import type { Application, RequestStatus } from "@/lib/types";

export function StatusForm({
  requestId,
  status,
  label,
  danger,
}: {
  requestId: string;
  status: RequestStatus;
  label: string;
  danger?: boolean;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await updateRequestStatus(requestId, status);
      }}
    >
      <button className={danger ? "btn btn-danger" : "btn btn-primary"}>{label}</button>
    </form>
  );
}

export function ApplyForm({ requestId }: { requestId: string }) {
  return (
    <form action={applyToRequest} className="card grid gap-3 p-5">
      <input type="hidden" name="request_id" value={requestId} />
      <h3 className="font-bold">เสนอตัวเป็นผู้ช่วย</h3>
      <textarea
        name="message"
        className="textarea"
        placeholder="แนะนำตัวสั้น ๆ และบอกว่าช่วยอะไรได้บ้าง"
      />
      <button className="btn btn-primary">ส่งใบสมัคร</button>
    </form>
  );
}

export function ApplicationDecision({ application }: { application: Application }) {
  return (
    <div className="flex gap-2">
      <form
        action={async () => {
          "use server";
          await decideApplication(application.id, true);
        }}
      >
        <button className="btn btn-primary">เลือกผู้ช่วยคนนี้</button>
      </form>
      <form
        action={async () => {
          "use server";
          await decideApplication(application.id, false);
        }}
      >
        <button className="btn btn-ghost">ไม่เลือก</button>
      </form>
    </div>
  );
}
