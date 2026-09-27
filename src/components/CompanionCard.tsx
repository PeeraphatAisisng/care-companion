import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { formatBaht } from "@/lib/utils";

type Props = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  intro?: string | null;
  areas: string[];
  skills: string[];
  hourlyRate?: number | null;
  rating?: number;
  reviewCount?: number;
};

export function CompanionCard({
  id,
  name,
  avatarUrl,
  intro,
  areas,
  skills,
  hourlyRate,
  rating = 0,
  reviewCount = 0,
}: Props) {
  return (
    <article className="card flex h-full flex-col p-5">
      <div className="flex items-start gap-3">
        <Avatar name={name} src={avatarUrl} size={56} />
        <div>
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {reviewCount ? `${rating.toFixed(1)} (${reviewCount} รีวิว)` : "ยังไม่มีรีวิว"}
          </p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-muted">{intro || "พร้อมเป็นเพื่อนร่วมเดินทางและช่วยทำธุระ"}</p>
      <p className="mt-3 flex items-center gap-1 text-sm">
        <MapPin className="h-4 w-4 text-teal" />
        {areas.slice(0, 3).join(", ") || "พื้นที่ยืดหยุ่น"}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.slice(0, 3).map((skill) => (
          <span key={skill} className="chip bg-teal-soft text-teal">
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between pt-5">
        <strong>{formatBaht(hourlyRate)} / ชม.</strong>
        <Link href={`/companions/${id}`} className="btn btn-primary">
          ดูโปรไฟล์
        </Link>
      </div>
    </article>
  );
}
