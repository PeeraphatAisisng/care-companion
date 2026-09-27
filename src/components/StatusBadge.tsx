import { REQUEST_STATUS, VERIFICATION_STATUS } from "@/lib/constants";
import type { RequestStatus, VerificationStatus } from "@/lib/types";

const tones = {
  neutral: "bg-stone-100 text-stone-700",
  info: "bg-teal-soft text-teal",
  warning: "bg-amber-100 text-amber-800",
  success: "bg-emerald-100 text-emerald-800",
  danger: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const item = REQUEST_STATUS[status];
  return <span className={`chip ${tones[item.tone]}`}>{item.label}</span>;
}

export function VerifyBadge({ status }: { status: VerificationStatus }) {
  const item = VERIFICATION_STATUS[status];
  return <span className={`chip ${tones[item.tone]}`}>{item.label}</span>;
}
