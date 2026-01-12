import { apiClient } from "../API";
import { BannedUser, UserBanHistory } from "../types/report";

// Type for pagination response
interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Type for banned users response
interface BannedUsersResponse {
  users: BannedUser[];
  pagination: Pagination;
}

export const reportService = {
  // Get all reports with filters
  getReports: async (filters?: {
    status?: "pending" | "under_review" | "resolved" | "dismissed";
    report_type?: string;
    school_id?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      console.log("🚀 Fetching reports with filters:", filters);

      const response = await apiClient.api.adminReportsList(filters);
      console.log("✅ Reports response:", response.data);

      return {
        reports: response.data.reports || [],
        pagination: response.data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        },
      };
    } catch (error) {
      console.error("❌ Failed to fetch reports:", error);
      throw error;
    }
  },

  // Get report details
  getReportDetails: async (reportId: string) => {
    try {
      console.log("🚀 Fetching report details for:", reportId);
      const response = await apiClient.api.adminReportsDetail(reportId);
      console.log("✅ Report details response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch report details:", error);
      throw error;
    }
  },

  // Update report status
  updateReportStatus: async (
    reportId: string,
    data: {
      status: "pending" | "under_review" | "resolved" | "dismissed";
      admin_notes?: string;
    },
  ) => {
    try {
      console.log("🚀 Updating report status:", reportId, data);
      const response = await apiClient.api.adminReportsStatusPartialUpdate(
        reportId,
        data,
      );
      console.log("✅ Update status response:", response.data);
      return response.data.report;
    } catch (error) {
      console.error("❌ Failed to update report status:", error);
      throw error;
    }
  },

  // Ban user from report
  banUserFromReport: async (
    reportId: string,
    data: {
      ban_duration?: number;
      ban_reason?: string;
      resolve_related_reports?: boolean;
    },
  ) => {
    try {
      console.log("🚀 Banning user from report:", reportId, data);
      const response = await apiClient.api.adminReportsBanUserCreate(
        reportId,
        data,
      );
      console.log("✅ Ban user response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to ban user:", error);
      throw error;
    }
  },

  // Bulk update reports
  bulkUpdateReports: async (data: {
    report_ids: string[];
    action: "resolve" | "dismiss" | "under_review";
    admin_notes?: string;
  }) => {
    try {
      console.log("🚀 Bulk updating reports:", data);
      const response = await apiClient.api.adminReportsBulkPartialUpdate(data);
      console.log("✅ Bulk update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to bulk update reports:", error);
      throw error;
    }
  },

  // Get banned users
  getBannedUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    school_id?: string;
  }): Promise<BannedUsersResponse> => {
    try {
      console.log("🚀 Fetching banned users:", params);

      const response = await apiClient.api.adminUsersBannedList(params);
      console.log("✅ Banned users response:", response.data);

      return {
        users: (response.data.users || []) as BannedUser[],
        pagination: {
          page: response.data.pagination?.page ?? 1,
          limit: response.data.pagination?.limit ?? 20,
          total: response.data.pagination?.total ?? 0,
          pages: response.data.pagination?.pages ?? 0,
        },
      };
    } catch (error) {
      console.error("❌ Failed to fetch banned users:", error);
      throw error;
    }
  },

  // Unban user
  unbanUser: async (userId: string, data?: { unban_reason?: string }) => {
    try {
      console.log("🚀 Unbanning user:", userId, data);
      const response = await apiClient.api.adminUsersUnbanCreate(
        userId,
        data || {},
      );
      console.log("✅ Unban response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to unban user:", error);
      throw error;
    }
  },

  // Get user ban history
  getUserBanHistory: async (userId: string): Promise<UserBanHistory> => {
    try {
      console.log("🚀 Fetching ban history for user:", userId);
      const response = await apiClient.api.adminUsersBanHistoryList(userId);
      console.log("✅ Ban history response:", response.data);
      return response.data as unknown as UserBanHistory;
    } catch (error) {
      console.error("❌ Failed to fetch ban history:", error);
      throw error;
    }
  },

  // Remove user (existing functionality)
  removeUser: async (userId: string, reason: string, sendEmail = true) => {
    try {
      console.log("🚀 Removing user:", userId);
      const response = await apiClient.http.instance.delete(
        `/api/admin/users/${userId}/remove`,
        {
          data: { reason, sendEmail },
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("✅ Remove user response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to remove user:", error);
      throw error;
    }
  },
};

export default reportService;
