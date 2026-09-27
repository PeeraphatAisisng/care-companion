import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-line bg-card">
        <div className="page-wrap flex flex-wrap gap-4 py-3 font-bold">
          <Link href="/admin">ภาพรวม</Link>
          <Link href="/admin/users">ผู้ใช้</Link>
          <Link href="/admin/companions">ผู้ช่วย</Link>
          <Link href="/admin/requests">คำขอ</Link>
        </div>
      </div>
      {children}
    </div>
  );
}
