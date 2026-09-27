import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { OnboardingForm } from "@/components/forms/OnboardingForm";

export default async function OnboardingPage() {
  const { profile } = await requireUser();
  if (profile?.role) redirect("/dashboard");

  return (
    <div className="page-wrap py-12">
      <h1 className="text-4xl font-bold">ตั้งค่าบัญชีครั้งแรก</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        เลือกบทบาทและกรอกข้อมูลที่จำเป็น เพื่อให้ระบบแนะนำบริการที่เหมาะสม
      </p>
      <div className="mt-8">
        <OnboardingForm profile={profile} />
      </div>
    </div>
  );
}
