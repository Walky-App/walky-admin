import { AxiosError } from "axios";
import { apiClient } from "../API";

class LockedUsersService {
  async getLockedUsers(params: { page?: number; limit?: number; search?: string } = {}) {
    try {
      const response = await apiClient.api.adminLockedUsersList(params);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      throw new Error(axiosError.response?.data?.error || "Failed to fetch locked users");
    }
  }

  async unlockUser(userId: string, params: { reason?: string; clearAttempts?: boolean } = {}) {
    try {
      const response = await apiClient.api.adminUnlockUserCreate(userId, params);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      throw new Error(axiosError.response?.data?.error || "Failed to unlock user");
    }
  }

  async bulkUnlockUsers(params: { userIds: string[]; reason?: string; clearAttempts?: boolean }) {
    try {
      const response = await apiClient.api.adminBulkUnlockUsersCreate(params);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      throw new Error(axiosError.response?.data?.error || "Failed to bulk unlock users");
    }
  }

  async getUnlockStats() {
    try {
      const response = await apiClient.api.adminUnlockStatsList();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      throw new Error(axiosError.response?.data?.error || "Failed to fetch unlock stats");
    }
  }

  async updateLockSettings(userId: string, params: { maxAttempts?: number; lockDurationHours?: number }) {
    try {
      const response = await apiClient.api.adminLockSettingsUpdate(userId, params);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      throw new Error(axiosError.response?.data?.error || "Failed to update lock settings");
    }
  }
}

export const lockedUsersService = new LockedUsersService();