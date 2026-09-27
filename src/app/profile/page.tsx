import { requireProfile } from "@/lib/auth";
import { updateProfile } from "@/app/actions/profile";
import { FileUpload } from "@/components/FileUpload";
import { ProfileFields } from "@/components/forms/ProfileFields";

export default async function ProfilePage() {
  const { profile } = await requireProfile();

  return (
    <div className="page-wrap py-10">
      <h1 className="text-4xl font-bold">โปรไฟล์ของฉัน</h1>
      <div className="card mt-6 max-w-3xl p-6">
        <FileUpload
          userId={profile.id}
          bucket="avatars"
          currentUrl={profile.avatar_url}
          label="รูปโปรไฟล์"
          onUploadedField="avatar_url"
        />
      </div>
      <form action={updateProfile} className="card mt-6 grid max-w-3xl gap-5 p-6">
        <ProfileFields profile={profile} />
        <button className="btn btn-primary">บันทึกโปรไฟล์</button>
      </form>
    </div>
  );
}
