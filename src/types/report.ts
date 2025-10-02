export enum ReportType {
  USER = "user",
  EVENT = "event",
  SPACE = "space",
  IDEA = "idea",
  MESSAGE = "message",
}

export interface Report {
  _id: string;
  reported_by: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
    school_id?: string;
    campus_id?: string;
  };
  report_type: ReportType;
  reported_item_id: string;
  reason:
    | "harassment_threats"
    | "inappropriate_content"
    | "spam_fake"
    | "underage_policy"
    | "made_uncomfortable"
    | "violence_dangerous"
    | "intellectual_property"
    | "other";
  description: string;
  status: "pending" | "under_review" | "resolved" | "dismissed";
  reviewed_by?: {
    _id: string;
    first_name: string;
    last_name: string;
    email?: string;
  };
  admin_notes?: string;
  resolved_at?: string;
  school_id: {
    _id: string;
    name: string;
  };
  reported_item_snapshot?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ReportDetails extends Report {
  reportedItem?: ReportedUser | Record<string, unknown>;
  relatedReports?: Report[];
  totalRelatedReports?: number;
}

export interface ReportedUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  profile_bio?: string;
  is_banned?: boolean;
  ban_reason?: string;
  report_count?: number;
  school_id?: {
    _id: string;
    name: string;
  };
}

export interface BannedUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  ban_date: string;
  ban_reason?: string;
  ban_duration?: number;
  ban_expires_at?: string;
  report_count?: number;
  banned_by?: {
    _id: string;
    first_name: string;
    last_name: string;
  };
  school_id?: {
    _id: string;
    name: string;
  };
}

export interface BanHistory {
  banned_at: string;
  banned_by: {
    _id: string;
    first_name: string;
    last_name: string;
  };
  reason: string;
  duration?: number;
  unbanned_at?: string;
  unbanned_by?: {
    _id: string;
    first_name: string;
    last_name: string;
  };
  unban_reason?: string;
}

export interface UserBanHistory {
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    report_count?: number;
  };
  ban_history: BanHistory[];
  reports: Report[];
}

export interface UpdateReportStatusRequest {
  status: "pending" | "under_review" | "resolved" | "dismissed";
  admin_notes?: string;
}

export interface BanUserRequest {
  ban_duration?: number; // in days, undefined for permanent
  ban_reason?: string;
  resolve_related_reports?: boolean;
}

export interface UnbanUserRequest {
  unban_reason?: string;
}

export interface BulkUpdateReportsRequest {
  report_ids: string[];
  action: "resolve" | "dismiss" | "under_review";
  admin_notes?: string;
}

export interface ReportFilters {
  status?: "pending" | "under_review" | "resolved" | "dismissed";
  report_type?: ReportType;
  school_id?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
