import api from "../API";
import {
  Role,
  GroupedPermissions,
  UserRole,
  AssignRoleRequest,
  RemoveRoleRequest,
  CheckPermissionRequest,
  CheckPermissionResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest,
  Permission,
} from "../types/role";

export const rolesService = {
  // Get all available roles
  getRoles: async (): Promise<{ success: boolean; roles: Role[] }> => {
    try {
      console.log("🚀 Fetching roles");
      const response = await api.get("/admin/roles");
      console.log("✅ Roles response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch roles:", error);
      throw error;
    }
  },

  // Get all available permissions
  getPermissions: async (): Promise<{ success: boolean; permissions: GroupedPermissions }> => {
    try {
      console.log("🚀 Fetching permissions");
      const response = await api.get("/admin/permissions");
      console.log("✅ Permissions response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch permissions:", error);
      throw error;
    }
  },

  // Get user's roles
  getUserRoles: async (userId: string): Promise<{ success: boolean; user: UserRole }> => {
    try {
      console.log("🚀 Fetching user roles for:", userId);
      const response = await api.get(`/admin/users/${userId}/roles`);
      console.log("✅ User roles response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch user roles:", error);
      throw error;
    }
  },

  // Assign role to user
  assignRole: async (userId: string, data: AssignRoleRequest): Promise<{ success: boolean; message: string; user: UserRole }> => {
    try {
      console.log("🚀 Assigning role to user:", userId, data);
      const response = await api.post(`/admin/users/${userId}/assign-role`, data);
      console.log("✅ Assign role response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to assign role:", error);
      throw error;
    }
  },

  // Remove role from user
  removeRole: async (userId: string, data: RemoveRoleRequest): Promise<{ success: boolean; message: string }> => {
    try {
      console.log("🚀 Removing role from user:", userId, data);
      const response = await api.delete(`/admin/users/${userId}/remove-role`, { data });
      console.log("✅ Remove role response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to remove role:", error);
      throw error;
    }
  },

  // Check if user has permission
  checkPermission: async (userId: string, data: CheckPermissionRequest): Promise<CheckPermissionResponse> => {
    try {
      console.log("🚀 Checking user permission:", userId, data);
      const response = await api.post(`/admin/users/${userId}/check-permission`, data);
      console.log("✅ Check permission response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to check permission:", error);
      throw error;
    }
  },

  // Create new role
  createRole: async (data: CreateRoleRequest): Promise<{ success: boolean; role: Role; message: string }> => {
    try {
      console.log("🚀 Creating new role:", data);
      const response = await api.post("/admin/roles", data);
      console.log("✅ Create role response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to create role:", error);
      throw error;
    }
  },

  // Update existing role
  updateRole: async (roleId: string, data: UpdateRoleRequest): Promise<{ success: boolean; role: Role; message: string }> => {
    try {
      console.log("🚀 Updating role:", roleId, data);
      const response = await api.put(`/admin/roles/${roleId}`, data);
      console.log("✅ Update role response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to update role:", error);
      throw error;
    }
  },

  // Delete role
  deleteRole: async (roleId: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log("🚀 Deleting role:", roleId);
      const response = await api.delete(`/admin/roles/${roleId}`);
      console.log("✅ Delete role response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to delete role:", error);
      throw error;
    }
  },

  // Create new permission
  createPermission: async (data: CreatePermissionRequest): Promise<{ success: boolean; permission: Permission; message: string }> => {
    try {
      console.log("🚀 Creating new permission:", data);
      const response = await api.post("/admin/permissions", data);
      console.log("✅ Create permission response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to create permission:", error);
      throw error;
    }
  },

  // Delete permission
  deletePermission: async (permissionId: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log("🚀 Deleting permission:", permissionId);
      const response = await api.delete(`/admin/permissions/${permissionId}`);
      console.log("✅ Delete permission response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to delete permission:", error);
      throw error;
    }
  },
};

export default rolesService;
