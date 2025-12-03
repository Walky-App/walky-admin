import { apiClient } from "../API";

interface GetLockedUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface UnlockUserParams {
  reason?: string;
  clearAttempts?: boolean;
}

interface BulkUnlockParams {
  userIds: string[];
  reason?: string;
  clearAttempts?: boolean;
}

interface UpdateLockSettingsParams {
  maxAttempts?: number;
  lockDurationHours?: number;
}

class LockedUsersService {
  async getLockedUsers(params: GetLockedUsersParams = {}) {
    try {
      const response = await apiClient.api.adminLockedUsersList(params) as any;
      return response.data;
    } catch (error) {
       
      throw new Error((error as any).response?.data?.error || "Failed to fetch locked users");
    }
  }

  async unlockUser(userId: string, params: UnlockUserParams = {}) {
    try {
      const response = await apiClient.api.adminUnlockUserCreate(userId, params) as any;
      return response.data;
    } catch (error) {
       
      throw new Error((error as any).response?.data?.error || "Failed to unlock user");
    }
  }

  async bulkUnlockUsers(params: BulkUnlockParams) {
    try {
      const response = await apiClient.api.adminBulkUnlockUsersCreate(params) as any;
      return response.data;
    } catch (error) {
       
      throw new Error((error as any).response?.data?.error || "Failed to bulk unlock users");
    }
  }

  async getUnlockStats() {
    try {
      const response = await apiClient.api.adminUnlockStatsList() as any;
      return response.data;
    } catch (error) {
       
      throw new Error((error as any).response?.data?.error || "Failed to fetch unlock stats");
    }
  }

  async updateLockSettings(userId: string, params: UpdateLockSettingsParams) {
    try {
      const response = await apiClient.api.adminLockSettingsUpdate(userId, params) as any;
      return response.data;
    } catch (error) {
       
      throw new Error((error as any).response?.data?.error || "Failed to update lock settings");
    }
  }
}

export const lockedUsersService = new LockedUsersService();