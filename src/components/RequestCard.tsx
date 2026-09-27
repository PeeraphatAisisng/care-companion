import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { errandLabel, formatDate, formatTime } from "@/lib/utils";
import type { ServiceRequest } from "@/lib/types";

export function RequestCard({
  request,
  href,
}: {
  request: ServiceRequest;
  href: string;
}) {
  return (
    <Link href={href} className="card block p-5 transition hover:-translate-y-0.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="chip bg-sand text-teal">{errandLabel(request.errand_type)}</p>
        <StatusBadge status={request.status} />
      </div>
      <h3 className="mt-3 text-xl font-bold">{request.title}</h3>
      <p className="mt-3 flex items-center gap-2 text-muted">
        <Calendar className="h-4 w-4" />
        {formatDate(request.scheduled_date)} เวลา {formatTime(request.scheduled_time)}
      </p>
      <p className="mt-2 flex items-center gap-2 text-muted">
        <MapPin className="h-4 w-4" />
        {request.origin} → {request.destination}
      </p>
    </Link>
  );
}
