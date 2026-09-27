"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function FileUpload({
  userId,
  bucket,
  folder,
  currentUrl,
  label,
  onUploadedField,
}: {
  userId: string;
  bucket: "avatars" | "documents";
  folder?: string;
  currentUrl?: string | null;
  label: string;
  onUploadedField: "avatar_url" | "id_document_url";
}) {
  const [message, setMessage] = useState("");

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("กำลังอัปโหลด...");
    const supabase = createClient();
    const path = `${userId}/${folder ?? "file"}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      setMessage(error.message);
      return;
    }

    if (onUploadedField === "avatar_url") {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", userId);
    } else {
      await supabase.from("companion_profiles").update({ id_document_url: path }).eq("user_id", userId);
    }
    setMessage("อัปโหลดสำเร็จ");
  }

  return (
    <div className="field">
      <label>{label}</label>
      {currentUrl && bucket === "avatars" ? (
        <img src={currentUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
      ) : null}
      <input type="file" accept="image/*,.pdf" onChange={onChange} className="input" />
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </div>
  );
}
