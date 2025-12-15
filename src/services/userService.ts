import { apiClient } from "../API";
import { User } from "../API/WalkyAPI";

// Extended User type with role-related properties
// Uses Omit to avoid type conflicts with base User interface
export interface UserWithRoles extends Omit<User, "school_id" | "campus_id" | "roles"> {
  _id?: string;
  primary_role?: string;
  role_assignments?: Array<{
    role?: string;
    campus_id?: string | { _id?: string; campus_name?: string };
    school_id?: string | { _id?: string; name?: string };
  }>;
  roles?: Array<{
    role?: string;
    campus_id?: string | { _id?: string; campus_name?: string };
    school_id?: string | { _id?: string; name?: string };
  }>;
  school_id?: string | { _id?: string; name?: string };
  campus_id?: string | { _id?: string; campus_name?: string };
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
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Type for API response pagination with optional fields
interface ApiPagination {
  page?: number;
  limit?: number;
  total?: number;
  pages?: number;
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
        campus_id: params?.campus_id,
        role: params?.role,
      });

      console.log("✅ Users response:", response.data);

      const apiPagination = response.data.pagination as ApiPagination | undefined;
      return {
        users: response.data.users || [],
        pagination: {
          page: apiPagination?.page ?? 1,
          limit: apiPagination?.limit ?? 20,
          total: apiPagination?.total ?? 0,
          pages: apiPagination?.pages ?? 0,
        },
      };
    } catch (error) {
      console.error("❌ Failed to fetch users:", error);
      throw error;
    }
  },

  // Search users by email or name
  searchUsers: async (query: string) => {
    try {
      console.log("🚀 Searching users with query:", query);
      const response = await apiClient.api.adminUsersSearchList({ q: query });
      console.log("✅ Search response:", response.data);
      // Return search results with available fields
      return (response.data.users || []).map((u) => ({
        email: u.email || "",
        _id: u._id,
        first_name: u.first_name,
        last_name: u.last_name,
        avatar_url: u.avatar_url,
        role: u.role,
      }));
    } catch (error) {
      console.error("❌ Failed to search users:", error);
      throw error;
    }
  },

  // Get single user details
  getUser: async (userId: string): Promise<User> => {
    try {
      console.log("🚀 Fetching user:", userId);
      const response = await apiClient.api.adminUsersDetail(userId);
      console.log("✅ User details response:", response.data);
      return response.data.user as User;
    } catch (error) {
      console.error("❌ Failed to fetch user:", error);
      throw error;
    }
  },
};

export default userService;
