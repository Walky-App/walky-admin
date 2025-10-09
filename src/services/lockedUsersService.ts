import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async getLockedUsers(params: GetLockedUsersParams = {}) {
    try {
      const response = await axios.get(`${API_URL}/admin/users/locked`, {
        headers: this.getAuthHeaders(),
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
      const response = await axios.post(
        `${API_URL}/admin/users/${userId}/unlock`,
        params,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any).response?.data?.error || "Failed to unlock user");
    }
  }

  async bulkUnlockUsers(params: BulkUnlockParams) {
    try {
      const response = await axios.post(
        `${API_URL}/admin/users/bulk-unlock`,
        params,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any).response?.data?.error || "Failed to bulk unlock users");
    }
  }

  async getUnlockStats() {
    try {
      const response = await axios.get(`${API_URL}/admin/users/unlock-stats`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any).response?.data?.error || "Failed to fetch unlock stats");
    }
  }

  async updateLockSettings(userId: string, params: UpdateLockSettingsParams) {
    try {
      const response = await axios.put(
        `${API_URL}/admin/users/${userId}/lock-settings`,
        params,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any).response?.data?.error || "Failed to update lock settings");
    }
  }
}

export const lockedUsersService = new LockedUsersService();