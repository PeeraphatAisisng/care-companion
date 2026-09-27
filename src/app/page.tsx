import Link from "next/link";
import {
  Building2,
  HeartHandshake,
  Hospital,
  Landmark,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CompanionCard } from "@/components/CompanionCard";
import { ERRAND_TYPES } from "@/lib/constants";

const icons = {
  hospital: Hospital,
  clinic: HeartHandshake,
  bank: Landmark,
  government: Building2,
  shopping: ShoppingBag,
  other: Users,
};

export default async function HomePage() {
  let companions: Array<{
    user_id: string;
    intro: string | null;
    service_areas: string[] | null;
    skills: string[] | null;
    hourly_rate: number | null;
    profiles: { full_name: string; avatar_url: string | null } | { full_name: string; avatar_url: string | null }[] | null;
  }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("companion_profiles")
      .select("*, profiles(*)")
      .eq("verification_status", "approved")
      .limit(3);
    companions = data ?? [];
  } catch {
    companions = [];
  }

  return (
    <div>
      <section className="page-wrap grid items-center gap-10 py-14 md:grid-cols-2">
        <div>
          <p className="chip bg-teal-soft text-teal">เพื่อผู้สูงอายุและผู้ที่เดินทางคนเดียวไม่สะดวก</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
            มีเพื่อนร่วมทาง เวลาต้องออกไปทำธุระ
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            Care Companion เชื่อมผู้ที่ต้องการผู้ช่วยร่วมเดินทาง กับผู้ให้บริการที่พร้อมพาไปโรงพยาบาล
            ธนาคาร หน่วยงานราชการ หรือซื้อของ โดยไม่ใช่บริการทางการแพทย์
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="btn btn-primary text-lg">
              เริ่มต้นด้วย Google
            </Link>
            <Link href="/companions" className="btn btn-ghost text-lg">
              ดูผู้ช่วยที่พร้อมให้บริการ
            </Link>
          </div>
        </div>
        <div className="card p-8">
          <div className="grid gap-4">
            {[
              ["1", "เข้าสู่ระบบด้วย Google และเลือกบทบาท"],
              ["2", "สร้างคำขอหรือเลือกผู้ช่วยที่เหมาะสม"],
              ["3", "ผู้ช่วยตอบรับ แล้วเดินทางไปทำธุระด้วยกัน"],
              ["4", "ปิดงานและให้คะแนนเมื่อบริการเสร็จสิ้น"],
            ].map(([step, text]) => (
              <div key={step} className="flex gap-4 rounded-2xl bg-sand/70 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-teal font-bold text-white">
                  {step}
                </span>
                <p className="self-center font-semibold">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card py-14">
        <div className="page-wrap">
          <h2 className="text-3xl font-bold">ธุระที่ระบบรองรับ</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {ERRAND_TYPES.map((item) => {
              const Icon = icons[item.value];
              return (
                <div key={item.value} className="rounded-3xl border border-line p-5">
                  <Icon className="h-8 w-8 text-teal" />
                  <h3 className="mt-3 text-xl font-bold">{item.label}</h3>
                  <p className="mt-2 text-muted">{item.hint}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-wrap py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">ผู้ช่วยที่ผ่านการตรวจสอบ</h2>
            <p className="mt-2 text-muted">ดูประสบการณ์ พื้นที่ให้บริการ และช่วงเวลาที่สะดวก</p>
          </div>
          <Link href="/companions" className="btn btn-ghost">
            ดูทั้งหมด
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {companions.length ? (
            companions.map((item) => {
              const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
              return (
                <CompanionCard
                  key={String(item.user_id)}
                  id={String(item.user_id)}
                  name={profile?.full_name ?? "ผู้ช่วย"}
                  avatarUrl={profile?.avatar_url}
                  intro={item.intro as string | null}
                  areas={(item.service_areas as string[]) ?? []}
                  skills={(item.skills as string[]) ?? []}
                  hourlyRate={item.hourly_rate as number | null}
                />
              );
            })
          ) : (
            <div className="card col-span-full p-8 text-muted">
              ยังไม่มีผู้ช่วยที่ได้รับการยืนยัน แสดงข้อมูลสาธารณะของแพลตฟอร์มได้ตามปกติ
            </div>
          )}
        </div>
      </section>

      <section className="page-wrap pb-16">
        <div className="card grid gap-6 p-8 md:grid-cols-3">
          <div>
            <ShieldCheck className="h-8 w-8 text-teal" />
            <h3 className="mt-3 text-xl font-bold">เข้าสู่ระบบด้วย Google</h3>
            <p className="mt-2 text-muted">ทั้ง Customer และ Companion ต้องยืนยันตัวตนด้วยบัญชี Google</p>
          </div>
          <div>
            <Users className="h-8 w-8 text-teal" />
            <h3 className="mt-3 text-xl font-bold">แยกสิทธิ์ตามบทบาท</h3>
            <p className="mt-2 text-muted">ลูกค้า ผู้ช่วย และแอดมินเห็นข้อมูลเฉพาะที่จำเป็นต่อหน้าที่ของตน</p>
          </div>
          <div>
            <HeartHandshake className="h-8 w-8 text-teal" />
            <h3 className="mt-3 text-xl font-bold">ครบกระบวนการให้บริการ</h3>
            <p className="mt-2 text-muted">ค้นหา ร้องขอ ตอบรับ เริ่มงาน ปิดงาน และรีวิวได้ในที่เดียว</p>
          </div>
        </div>
      </section>
    </div>
  );
}
