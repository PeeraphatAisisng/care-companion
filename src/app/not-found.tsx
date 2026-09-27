import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-wrap py-20 text-center">
      <h1 className="text-4xl font-bold">ไม่พบหน้านี้</h1>
      <p className="mt-3 text-muted">ลิงก์อาจไม่ถูกต้อง หรือข้อมูลถูกลบแล้ว</p>
      <Link href="/" className="btn btn-primary mt-6">
        กลับหน้าแรก
      </Link>
    </div>
  );
}
