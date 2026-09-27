import type { ErrandType, RequestStatus, VerificationStatus } from "./types";

export const APP_NAME = "Care Companion";

export const ERRAND_TYPES: {
  value: ErrandType;
  label: string;
  hint: string;
}[] = [
  { value: "hospital", label: "โรงพยาบาล", hint: "พบแพทย์ตามนัด รับยา หรือตรวจสุขภาพ" },
  { value: "clinic", label: "คลินิก / พบแพทย์", hint: "คลินิกเอกชน หรือพบแพทย์เฉพาะทาง" },
  { value: "bank", label: "ธนาคาร", hint: "ฝาก-ถอน เปิดบัญชี หรือทำธุรกรรม" },
  { value: "government", label: "หน่วยงานราชการ", hint: "ทะเบียนราษฎร์ ประกันสังคม หรือเอกสารราชการ" },
  { value: "shopping", label: "ซื้อสินค้า", hint: "ตลาด ห้าง หรือร้านขายยา" },
  { value: "other", label: "ธุระอื่น ๆ", hint: "ธุระนอกบ้านที่ต้องการคนร่วมเดินทาง" },
];

export const REQUEST_STATUS: Record<
  RequestStatus,
  { label: string; tone: "neutral" | "info" | "warning" | "success" | "danger" }
> = {
  open: { label: "เปิดรับผู้ช่วย", tone: "info" },
  pending: { label: "รอตอบรับ", tone: "warning" },
  accepted: { label: "ตอบรับแล้ว", tone: "success" },
  in_progress: { label: "กำลังให้บริการ", tone: "info" },
  completed: { label: "เสร็จสิ้น", tone: "success" },
  cancelled: { label: "ยกเลิก", tone: "neutral" },
  rejected: { label: "ปฏิเสธ", tone: "danger" },
};

export const VERIFICATION_STATUS: Record<
  VerificationStatus,
  { label: string; tone: "neutral" | "info" | "warning" | "success" | "danger" }
> = {
  pending: { label: "รอตรวจสอบ", tone: "warning" },
  approved: { label: "ยืนยันแล้ว", tone: "success" },
  rejected: { label: "ไม่ผ่าน", tone: "danger" },
};

export const SKILL_OPTIONS = [
  "ช่วยเดินทาง",
  "พูดคุยเป็นเพื่อน",
  "ช่วยถือของ",
  "ช่วยกรอกเอกสาร",
  "ดูแลผู้สูงอายุ",
  "ขับรถได้",
  "พูดภาษาอังกฤษ",
  "ช่วยใช้สมาร์ทโฟน",
];

export const AREA_OPTIONS = [
  "กรุงเทพฯ",
  "นนทบุรี",
  "ปทุมธานี",
  "สมุทรปราการ",
  "สมุทรสาคร",
  "นครปฐม",
  "ชลบุรี",
  "อื่น ๆ",
];

export const DAY_OPTIONS = [
  { value: "mon", label: "จันทร์" },
  { value: "tue", label: "อังคาร" },
  { value: "wed", label: "พุธ" },
  { value: "thu", label: "พฤหัสบดี" },
  { value: "fri", label: "ศุกร์" },
  { value: "sat", label: "เสาร์" },
  { value: "sun", label: "อาทิตย์" },
];

export const LANGUAGE_OPTIONS = ["ไทย", "อังกฤษ", "จีน", "ญี่ปุ่น"];
