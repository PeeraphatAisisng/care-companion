import type { CompanionProfile, Profile } from "@/lib/types";
import { AREA_OPTIONS, DAY_OPTIONS, LANGUAGE_OPTIONS, SKILL_OPTIONS } from "@/lib/constants";
import { CheckboxGroup } from "@/components/CheckboxGroup";

export function ProfileFields({ profile }: { profile?: Profile | null }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="field">
          <label htmlFor="full_name">ชื่อ-นามสกุล</label>
          <input id="full_name" name="full_name" className="input" required defaultValue={profile?.full_name ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="phone">เบอร์โทรศัพท์</label>
          <input id="phone" name="phone" className="input" required defaultValue={profile?.phone ?? ""} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="field">
          <label htmlFor="date_of_birth">วันเกิด</label>
          <input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            className="input"
            defaultValue={profile?.date_of_birth ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="address">ที่อยู่ / ย่านที่อยู่</label>
          <input id="address" name="address" className="input" defaultValue={profile?.address ?? ""} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="field">
          <label htmlFor="emergency_contact_name">ผู้ติดต่อฉุกเฉิน</label>
          <input
            id="emergency_contact_name"
            name="emergency_contact_name"
            className="input"
            defaultValue={profile?.emergency_contact_name ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="emergency_contact_phone">เบอร์ผู้ติดต่อฉุกเฉิน</label>
          <input
            id="emergency_contact_phone"
            name="emergency_contact_phone"
            className="input"
            defaultValue={profile?.emergency_contact_phone ?? ""}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="bio">แนะนำตัวสั้น ๆ</label>
        <textarea id="bio" name="bio" className="textarea" defaultValue={profile?.bio ?? ""} />
      </div>
    </>
  );
}

export function CompanionFields({ companion }: { companion?: CompanionProfile | null }) {
  return (
    <>
      <div className="field">
        <label htmlFor="intro">ข้อมูลสำหรับลูกค้า</label>
        <textarea
          id="intro"
          name="intro"
          className="textarea"
          defaultValue={companion?.intro ?? ""}
          placeholder="ประสบการณ์ ความสามารถ และสไตล์การดูแล"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="field">
          <label htmlFor="experience_years">ประสบการณ์ (ปี)</label>
          <input
            id="experience_years"
            name="experience_years"
            type="number"
            min="0"
            className="input"
            defaultValue={companion?.experience_years ?? 0}
          />
        </div>
        <div className="field">
          <label htmlFor="hourly_rate">อัตราค่าบริการต่อชั่วโมง (บาท)</label>
          <input
            id="hourly_rate"
            name="hourly_rate"
            type="number"
            min="0"
            className="input"
            defaultValue={companion?.hourly_rate ?? ""}
          />
        </div>
      </div>
      <div className="field">
        <span>ความสามารถ</span>
        <CheckboxGroup name="skills" options={SKILL_OPTIONS} selected={companion?.skills ?? []} />
      </div>
      <div className="field">
        <span>พื้นที่ให้บริการ</span>
        <CheckboxGroup name="service_areas" options={AREA_OPTIONS} selected={companion?.service_areas ?? []} />
      </div>
      <div className="field">
        <span>วันที่สะดวก</span>
        <CheckboxGroup name="available_days" options={DAY_OPTIONS} selected={companion?.available_days ?? []} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="field">
          <label htmlFor="available_from">เวลาเริ่มสะดวก</label>
          <input
            id="available_from"
            name="available_from"
            type="time"
            className="input"
            defaultValue={companion?.available_from?.slice(0, 5) ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="available_to">เวลาสิ้นสุด</label>
          <input
            id="available_to"
            name="available_to"
            type="time"
            className="input"
            defaultValue={companion?.available_to?.slice(0, 5) ?? ""}
          />
        </div>
      </div>
      <div className="field">
        <span>ภาษาที่สื่อสารได้</span>
        <CheckboxGroup name="languages" options={LANGUAGE_OPTIONS} selected={companion?.languages ?? ["ไทย"]} />
      </div>
    </>
  );
}
