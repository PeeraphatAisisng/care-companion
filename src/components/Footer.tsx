import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-card">
      <div className="page-wrap grid gap-6 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-teal">Care Companion</p>
          <p className="mt-2 text-muted">
            แพลตฟอร์มเชื่อมผู้ที่ต้องการผู้ช่วยร่วมเดินทาง กับผู้ให้บริการอำนวยความสะดวกในการทำธุระ
            ไม่ใช่บริการทางการแพทย์
          </p>
        </div>
        <div className="grid gap-2 font-semibold">
          <Link href="/companions">ค้นหาผู้ช่วย</Link>
          <Link href="/how-it-works">วิธีใช้งาน</Link>
          <Link href="/login">เข้าสู่ระบบด้วย Google</Link>
        </div>
        <p className="text-sm text-muted">
          ผู้ช่วยร่วมเดินทางมีหน้าที่ช่วยเหลือและอำนวยความสะดวกเท่านั้น
          ไม่ใช่ผู้ให้บริการทางการแพทย์หรือผู้ดูแลรักษาผู้ป่วย
        </p>
      </div>
    </footer>
  );
}
