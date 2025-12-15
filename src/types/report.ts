// Report types for legacy pages
// Helper type for populated user references
export interface PopulatedUser {
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
}

export interface BannedUser {
  _id?: string;
  id?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  ban_date?: string;
  banned_at?: string;
  banned_by?: string | PopulatedUser;
  ban_reason?: string;
  ban_duration?: number; // API returns number
  ban_expires_at?: string;
  status?: string;
  report_count?: number;
  school_id?: string | { _id?: string; name?: string };
  campus_id?: string | { _id?: string; campus_name?: string };
}

export interface BanHistoryItem {
  _id?: string;
  banned_at?: string;
  banned_by?: string | PopulatedUser;
  reason?: string;
  duration?: string;
  expires_at?: string;
  unbanned_at?: string;
  unbanned_by?: string | PopulatedUser;
  unban_reason?: string;
}

export interface ReportItem {
  _id?: string;
  reported_at?: string;
  reported_by?: string | PopulatedUser;
  reason?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  created_at?: string;
  witnesses?: Array<{
    _id?: string;
    name?: string;
  }>;
}

export interface UserBanHistory {
  _id?: string;
  user_id?: string;
  ban_history?: BanHistoryItem[];
  reports?: ReportItem[];
}

// Related report in the relatedReports array
export interface RelatedReport {
  _id?: string;
  reason?: string;
  description?: string;
  created_at?: string;
  createdAt?: string;
  reported_by?: string | PopulatedUser;
  status?: string;
}

export interface Report {
  _id?: string;
  id?: string;
  reporter_id?: string;
  reported_user_id?: string;
  reason?: string;
  description?: string;
  status?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  relatedReports?: RelatedReport[];
}

// Reported user in report context - extended with additional fields
export interface ReportedUser {
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  is_banned?: boolean;
  report_count?: number;
  profile_bio?: string;
  school_id?: string | { _id?: string; name?: string };
  ban_reason?: string;
}

// Full report details with all populated fields
export interface ReportDetails extends Report {
  report_type?: ReportType;
  reporter?: PopulatedUser;
  reported_user?: PopulatedUser;
  reported_by?: PopulatedUser;
  reviewed_by?: PopulatedUser;
  school_id?: string | { _id?: string; name?: string };
  admin_notes?: string;
  resolved_at?: string;
  totalRelatedReports?: number;
  reportedItem?: ReportedUser;
  reported_item_snapshot?: {
    profile_bio?: string;
    avatar_url?: string;
  };
}

// Ban user request form - for the modal form state
export interface BanUserRequest {
  ban_duration?: number;
  ban_reason?: string;
  resolve_related_reports?: boolean;
}

// Report type enum
export type ReportType = "harassment" | "spam" | "inappropriate_content" | "fake_profile" | "other" | "user";

// Report type labels for display
export const ReportTypeLabels: Record<string, string> = {
  harassment: "Harassment",
  spam: "Spam",
  inappropriate_content: "Inappropriate Content",
  fake_profile: "Fake Profile",
  user: "User Report",
  other: "Other",
};
