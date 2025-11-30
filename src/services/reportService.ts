import { apiClient } from "../API";
import { ContentType } from "../API/WalkyAPI";
import {
  Report,
  ReportDetails,
  UserBanHistory,
  UpdateReportStatusRequest,
  BanUserRequest,
  UnbanUserRequest,
  BulkUpdateReportsRequest,
  ReportFilters,
} from "../types/report";

export const reportService = {
  // Get all reports with filters
  getReports: async (filters?: ReportFilters) => {
    try {
      console.log("🚀 Fetching reports with filters:", filters);

      const response = await apiClient.api.adminReportsList(filters as any) as any;
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
  getReportDetails: async (reportId: string): Promise<ReportDetails> => {
    try {
      console.log("🚀 Fetching report details for:", reportId);
      const response = await apiClient.api.adminReportsDetail(reportId) as any;
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
    data: UpdateReportStatusRequest
  ): Promise<Report> => {
    try {
      console.log("🚀 Updating report status:", reportId, data);
      const response = await apiClient.api.adminReportsStatusPartialUpdate(reportId, data) as any;
      console.log("✅ Update status response:", response.data);
      return response.data.report;
    } catch (error) {
      console.error("❌ Failed to update report status:", error);
      throw error;
    }
  },

  // Ban user from report
  banUserFromReport: async (reportId: string, data: BanUserRequest) => {
    try {
      console.log("🚀 Banning user from report:", reportId, data);
      const response = await apiClient.api.adminReportsBanUserCreate(reportId, data) as any;
      console.log("✅ Ban user response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to ban user:", error);
      throw error;
    }
  },

  // Bulk update reports
  bulkUpdateReports: async (data: BulkUpdateReportsRequest) => {
    try {
      console.log("🚀 Bulk updating reports:", data);
      const response = await apiClient.api.adminReportsBulkPartialUpdate(data) as any;
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
  }) => {
    try {
      console.log("🚀 Fetching banned users:", params);

      const response = await apiClient.api.adminUsersBannedList(params) as any;
      console.log("✅ Banned users response:", response.data);

      return {
        users: response.data.users || [],
        pagination: response.data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        },
      };
    } catch (error) {
      console.error("❌ Failed to fetch banned users:", error);
      throw error;
    }
  },

  // Unban user
  unbanUser: async (userId: string, data?: UnbanUserRequest) => {
    try {
      console.log("🚀 Unbanning user:", userId, data);
      const response = await apiClient.api.adminUsersUnbanCreate(userId, data || {}) as any;
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
      const response = await apiClient.api.adminUsersBanHistoryList(userId) as any;
      console.log("✅ Ban history response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch ban history:", error);
      throw error;
    }
  },

  // Remove user (existing functionality)
  removeUser: async (userId: string, reason: string, sendEmail = true) => {
    try {
      console.log("🚀 Removing user:", userId);
      const response = await apiClient.http.request({
        path: `/api/admin/users/${userId}/remove`,
        method: "DELETE",
        body: { reason, sendEmail },
        secure: true,
        type: ContentType.Json,
      });
      console.log("✅ Remove user response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to remove user:", error);
      throw error;
    }
  },
};

export default reportService;
