export interface School {
  _id: string;
  school_name: string;
  display_name: string;
  email_domain: string;
  ambassador_ids: string[];
  campuses: string[];
  created_by: string;
  logo_url?: string;
  disallowed_staff_emails: string[];
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
