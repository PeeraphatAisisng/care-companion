"use client";

import { useState } from "react";
import { completeOnboarding } from "@/app/actions/profile";
import { CompanionFields, ProfileFields } from "@/components/forms/ProfileFields";
import type { Profile } from "@/lib/types";

export function OnboardingForm({ profile }: { profile: Profile | null }) {
  const [role, setRole] = useState<"customer" | "companion">("customer");

  return (
    <form action={completeOnboarding} className="card grid gap-6 p-6">
      <input type="hidden" name="role" value={role} />
      <div>
        <p className="mb-3 font-bold">เลือกบทบาทของคุณ</p>
        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`rounded-3xl border p-5 text-left ${
              role === "customer" ? "border-teal bg-teal-soft" : "border-line bg-white"
            }`}
          >
            <strong className="text-lg">ผู้ใช้บริการ (Customer)</strong>
            <p className="mt-2 text-muted">ต้องการผู้ช่วยร่วมเดินทางไปทำธุระ</p>
          </button>
          <button
            type="button"
            onClick={() => setRole("companion")}
            className={`rounded-3xl border p-5 text-left ${
              role === "companion" ? "border-teal bg-teal-soft" : "border-line bg-white"
            }`}
          >
            <strong className="text-lg">ผู้ช่วยร่วมเดินทาง (Companion)</strong>
            <p className="mt-2 text-muted">พร้อมช่วยเหลือและอำนวยความสะดวกในการเดินทาง</p>
          </button>
        </div>
      </div>

      <ProfileFields profile={profile} />
      {role === "companion" ? <CompanionFields /> : null}

      <button className="btn btn-primary text-lg">เริ่มใช้งาน Care Companion</button>
    </form>
  );
}
