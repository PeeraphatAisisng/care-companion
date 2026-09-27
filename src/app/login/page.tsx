import { GoogleButton } from "@/components/GoogleButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="page-wrap flex justify-center py-16">
      <div className="card w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold">เข้าสู่ระบบ</h1>
        <p className="mt-3 text-lg text-muted">
          Care Companion ใช้บัญชี Google ทั้งสำหรับผู้ใช้บริการและผู้ช่วยร่วมเดินทาง
        </p>
        {params.error === "inactive" ? (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-red-700">
            บัญชีนี้ถูกระงับโดยผู้ดูแลระบบ
          </p>
        ) : null}
        <div className="mt-6">
          <GoogleButton next={params.next || "/dashboard"} />
        </div>
      </div>
    </div>
  );
}
