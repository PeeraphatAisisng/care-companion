import { requireRole } from "@/lib/auth";
import { RequestForm } from "@/components/forms/RequestForm";

export default async function NewRequestPage() {
  await requireRole("customer");

  return (
    <div className="page-wrap py-10">
      <h1 className="text-4xl font-bold">สร้างคำขอใช้บริการ</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        ระบุประเภทธุระ วัน เวลา สถานที่ต้นทาง จุดหมาย ระยะเวลา และรายละเอียดที่จำเป็น
      </p>
      <div className="mt-6 max-w-3xl">
        <RequestForm />
      </div>
    </div>
  );
}
