import API from "../API";

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
      const response = await API.get("/admin/users/locked", {
        params,
      });
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any).response?.data?.error || "Failed to fetch locked users");
    }
  }

  async unlockUser(userId: string, params: UnlockUserParams = {}) {
    try {
      const response = await API.post(
        `/admin/users/${userId}/unlock`,
        params
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any).response?.data?.error || "Failed to unlock user");
    }
  }

  async bulkUnlockUsers(params: BulkUnlockParams) {
    try {
      const response = await API.post(
        "/admin/users/bulk-unlock",
        params
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any).response?.data?.error || "Failed to bulk unlock users");
    }
  }

  async getUnlockStats() {
    try {
      const response = await API.get("/admin/users/unlock-stats");
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any).response?.data?.error || "Failed to fetch unlock stats");
    }
  }

  async updateLockSettings(userId: string, params: UpdateLockSettingsParams) {
    try {
      const response = await API.put(
        `/admin/users/${userId}/lock-settings`,
        params
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any).response?.data?.error || "Failed to update lock settings");
    }
  }
}

export const lockedUsersService = new LockedUsersService();