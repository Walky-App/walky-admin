import { apiClient } from "../API";

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  primary_role?: string;
  school_id?: {
    _id: string;
    name: string;
  };
  campus_id?: {
    _id: string;
    campus_name: string;
  };
  created_at?: string;
}

export interface UserWithRoles extends User {
  roles?: Array<{
    role: string;
    campus_id?: {
      _id: string;
      campus_name: string;
    };
    assigned_by: {
      _id: string;
      first_name: string;
      last_name: string;
    };
    assigned_at: string;
  }>;
}

export interface UsersListParams {
  page?: number;
  limit?: number;
  search?: string;
  school_id?: string;
  campus_id?: string;
  role?: string;
}

export interface UsersListResponse {
  users: UserWithRoles[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const userService = {
  // Get users list with optional filters
  getUsers: async (params?: UsersListParams): Promise<UsersListResponse> => {
    try {
      console.log("🚀 Fetching users with params:", params);

      const response = await apiClient.api.adminUsersList({
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
        school_id: params?.school_id,
        role: params?.role,
        // @ts-ignore - campus_id is missing in generated type but supported by backend
        campus_id: params?.campus_id
      }) as any;

      console.log("✅ Users response:", response.data);

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
      console.error("❌ Failed to fetch users:", error);
      throw error;
    }
  },

  // Search users by email or name
  searchUsers: async (query: string): Promise<User[]> => {
    try {
      console.log("🚀 Searching users with query:", query);
      const response = await apiClient.api.adminUsersSearchList({ q: query }) as any;
      console.log("✅ Search response:", response.data);
      return response.data.users || [];
    } catch (error) {
      console.error("❌ Failed to search users:", error);
      throw error;
    }
  },

  // Get single user details
  getUser: async (userId: string): Promise<UserWithRoles> => {
    try {
      console.log("🚀 Fetching user:", userId);
      const response = await apiClient.api.adminUsersDetail(userId) as any;
      console.log("✅ User details response:", response.data);
      return response.data.user;
    } catch (error) {
      console.error("❌ Failed to fetch user:", error);
      throw error;
    }
  },
};

export default userService;
