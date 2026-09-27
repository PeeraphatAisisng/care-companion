import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export async function Navbar() {
  const { profile } = await getCurrentProfile();
  const homeHref =
    profile?.role === "admin"
      ? "/admin"
      : profile?.role === "companion"
        ? "/companion"
        : "/dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-[#f6f1e8]/90 backdrop-blur">
      <div className="page-wrap flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-teal">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal text-white">
            <HeartHandshake className="h-5 w-5" />
          </span>
          <span className="text-lg">Care Companion</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold md:flex">
          <Link href="/companions">ค้นหาผู้ช่วย</Link>
          <Link href="/how-it-works">วิธีใช้งาน</Link>
          {profile?.role === "customer" || profile?.is_admin ? <Link href="/requests">คำขอของฉัน</Link> : null}
          {profile?.role === "companion" ? <Link href="/companion/jobs">งานของฉัน</Link> : null}
          {profile?.role === "admin" || profile?.is_admin ? <Link href="/admin">แดชบอร์ดแอดมิน</Link> : null}
          {profile ? <Link href={profile.role === "companion" ? "/companion/profile" : "/profile"}>โปรไฟล์</Link> : null}
        </nav>

        <div className="flex items-center gap-2">
          {profile ? (
            <>
              <Link href={profile.role ? homeHref : "/onboarding"} className="btn btn-ghost">
                {profile.full_name || "บัญชีของฉัน"}
              </Link>
              <form action={signOut}>
                <button className="btn btn-ghost">ออกจากระบบ</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary">
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
