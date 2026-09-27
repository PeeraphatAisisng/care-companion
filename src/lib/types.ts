export type UserRole = "customer" | "companion" | "admin";
export type VerificationStatus = "pending" | "approved" | "rejected";
export type ErrandType =
  | "hospital"
  | "clinic"
  | "bank"
  | "government"
  | "shopping"
  | "other";
export type RequestStatus =
  | "open"
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rejected";
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export type Profile = {
  id: string;
  role: UserRole | null;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  bio: string | null;
  is_active: boolean;
  is_admin?: boolean;
  created_at: string;
  updated_at: string;
};

export type CompanionProfile = {
  user_id: string;
  experience_years: number | null;
  skills: string[];
  service_areas: string[];
  available_days: string[];
  available_from: string | null;
  available_to: string | null;
  hourly_rate: number | null;
  verification_status: VerificationStatus;
  id_document_url: string | null;
  intro: string | null;
  languages: string[];
  created_at: string;
  updated_at: string;
};

export type ServiceRequest = {
  id: string;
  customer_id: string;
  companion_id: string | null;
  errand_type: ErrandType;
  title: string;
  description: string | null;
  origin: string;
  destination: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_hours: number;
  status: RequestStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: string;
  request_id: string;
  companion_id: string;
  message: string | null;
  status: ApplicationStatus;
  created_at: string;
};

export type Review = {
  id: string;
  request_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type ServiceRequestWithPeople = ServiceRequest & {
  customer?: Pick<Profile, "id" | "full_name" | "avatar_url" | "phone"> | null;
  companion?: Pick<Profile, "id" | "full_name" | "avatar_url" | "phone"> | null;
};
