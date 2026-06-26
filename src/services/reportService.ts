import { logger } from "../lib/logger";
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
      logger.debug("🚀 Fetching reports with filters:", filters);

      const response = await apiClient.api.adminReportsList(filters);
      logger.debug("✅ Reports response:", response.data);

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
      logger.error("❌ Failed to fetch reports:", error);
      throw error;
    }
  },

  // Get report details
  getReportDetails: async (reportId: string) => {
    try {
      logger.debug("🚀 Fetching report details for:", reportId);
      const response = await apiClient.api.adminReportsDetail(reportId);
      logger.debug("✅ Report details response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to fetch report details:", error);
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
      logger.debug("🚀 Updating report status:", reportId, data);
      const response = await apiClient.api.adminReportsStatusPartialUpdate(
        reportId,
        data,
      );
      logger.debug("✅ Update status response:", response.data);
      return response.data.report;
    } catch (error) {
      logger.error("❌ Failed to update report status:", error);
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
      logger.debug("🚀 Banning user from report:", reportId, data);
      const response = await apiClient.api.adminReportsBanUserCreate(
        reportId,
        data,
      );
      logger.debug("✅ Ban user response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to ban user:", error);
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
      logger.debug("🚀 Bulk updating reports:", data);
      const response = await apiClient.api.adminReportsBulkPartialUpdate(data);
      logger.debug("✅ Bulk update response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to bulk update reports:", error);
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
      logger.debug("🚀 Fetching banned users:", params);

      const response = await apiClient.api.adminUsersBannedList(params);
      logger.debug("✅ Banned users response:", response.data);

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
      logger.error("❌ Failed to fetch banned users:", error);
      throw error;
    }
  },

  // Unban user
  unbanUser: async (userId: string, data?: { unban_reason?: string }) => {
    try {
      logger.debug("🚀 Unbanning user:", userId, data);
      const response = await apiClient.api.adminUsersUnbanCreate(
        userId,
        data || {},
      );
      logger.debug("✅ Unban response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to unban user:", error);
      throw error;
    }
  },

  // Get user ban history
  getUserBanHistory: async (userId: string): Promise<UserBanHistory> => {
    try {
      logger.debug("🚀 Fetching ban history for user:", userId);
      const response = await apiClient.api.adminUsersBanHistoryList(userId);
      logger.debug("✅ Ban history response:", response.data);
      return response.data as unknown as UserBanHistory;
    } catch (error) {
      logger.error("❌ Failed to fetch ban history:", error);
      throw error;
    }
  },

  // Remove user (existing functionality)
  removeUser: async (userId: string, reason: string, sendEmail = true) => {
    try {
      logger.debug("🚀 Removing user:", userId);
      const response = await apiClient.http.instance.delete(
        `/api/admin/users/${userId}/remove`,
        {
          data: { reason, sendEmail },
          headers: { "Content-Type": "application/json" },
        }
      );
      logger.debug("✅ Remove user response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to remove user:", error);
      throw error;
    }
  },
};

export default reportService;
