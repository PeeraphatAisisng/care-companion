import { getCompanionProfile, requireRole } from "@/lib/auth";
import { updateCompanionProfile, updateProfile } from "@/app/actions/profile";
import { FileUpload } from "@/components/FileUpload";
import { CompanionFields, ProfileFields } from "@/components/forms/ProfileFields";
import { VerifyBadge } from "@/components/StatusBadge";

export default async function CompanionProfilePage() {
  const { profile } = await requireRole("companion");
  const companion = await getCompanionProfile(profile.id);

  return (
    <div className="page-wrap py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-bold">โปรไฟล์ผู้ช่วยร่วมเดินทาง</h1>
        {companion ? <VerifyBadge status={companion.verification_status} /> : null}
      </div>
      <p className="mt-3 max-w-3xl text-lg text-muted">
        ข้อมูลนี้จะช่วยให้ลูกค้าตัดสินใจเลือกผู้ช่วย เช่น ประสบการณ์ ความสามารถ พื้นที่ และช่วงเวลาที่สะดวก
      </p>

      <div className="card mt-6 grid max-w-3xl gap-5 p-6">
        <FileUpload
          userId={profile.id}
          bucket="avatars"
          currentUrl={profile.avatar_url}
          label="รูปโปรไฟล์"
          onUploadedField="avatar_url"
        />
        <FileUpload
          userId={profile.id}
          bucket="documents"
          folder="id"
          currentUrl={companion?.id_document_url}
          label="เอกสารยืนยันตัวตน (เก็บใน Supabase Storage)"
          onUploadedField="id_document_url"
        />
      </div>

      <form action={updateProfile} className="card mt-6 grid max-w-3xl gap-5 p-6">
        <h2 className="text-2xl font-bold">ข้อมูลส่วนตัว</h2>
        <ProfileFields profile={profile} />
        <button className="btn btn-primary">บันทึกข้อมูลส่วนตัว</button>
      </form>

      <form action={updateCompanionProfile} className="card mt-6 grid max-w-3xl gap-5 p-6">
        <h2 className="text-2xl font-bold">ข้อมูลการให้บริการ</h2>
        <CompanionFields companion={companion} />
        <button className="btn btn-primary">บันทึกข้อมูลผู้ช่วย</button>
      </form>
    </div>
  );
}
