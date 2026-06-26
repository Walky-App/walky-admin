import { logger } from "../lib/logger";
import { apiClient } from "../API";

export const rolesService = {
  // Get all available roles
  getRoles: async () => {
    try {
      logger.debug("🚀 Fetching roles");
      const response = await apiClient.api.adminRolesList();
      logger.debug("✅ Roles response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to fetch roles:", error);
      throw error;
    }
  },

  // Get all available permissions
  getPermissions: async () => {
    try {
      logger.debug("🚀 Fetching permissions");
      const response = await apiClient.api.adminPermissionsList();
      logger.debug("✅ Permissions response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to fetch permissions:", error);
      throw error;
    }
  },

  // Get user's roles
  getUserRoles: async (userId: string) => {
    try {
      logger.debug("🚀 Fetching user roles for:", userId);
      const response = await apiClient.api.adminUsersRolesList(userId);
      logger.debug("✅ User roles response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to fetch user roles:", error);
      throw error;
    }
  },

  // Assign role to user
  assignRole: async (
    userId: string,
    data: {
      role:
        | "super_admin"
        | "school_admin"
        | "campus_admin"
        | "editor"
        | "moderator"
        | "staff"
        | "viewer"
        | "student"
        | "faculty"
        | "parent";
      campus_id?: string;
      school_id?: string;
    }
  ) => {
    try {
      logger.debug("🚀 Assigning role to user:", userId, data);
      const response = await apiClient.api.adminUsersAssignRoleCreate(
        userId,
        data
      );
      logger.debug("✅ Assign role response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to assign role:", error);
      throw error;
    }
  },

  // Remove role from user
  removeRole: async (
    userId: string,
    data: { role: string; campus_id?: string }
  ) => {
    try {
      logger.debug("🚀 Removing role from user:", userId, data);
      const response = await apiClient.api.adminUsersRemoveRoleDelete(
        userId,
        data
      );
      logger.debug("✅ Remove role response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to remove role:", error);
      throw error;
    }
  },

  // Check if user has permission
  checkPermission: async (
    userId: string,
    data: { permission: string; campus_id?: string; school_id?: string }
  ) => {
    try {
      logger.debug("🚀 Checking user permission:", userId, data);
      const response = await apiClient.api.adminUsersCheckPermissionCreate(
        userId,
        data
      );
      logger.debug("✅ Check permission response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to check permission:", error);
      throw error;
    }
  },

  // Create new role
  createRole: async (data: {
    name: string;
    display_name: string;
    description: string;
    permissions?: string[];
    scope: "global" | "school" | "campus";
  }) => {
    try {
      logger.debug("🚀 Creating new role:", data);
      const response = await apiClient.api.adminRolesCreate(data);
      logger.debug("✅ Create role response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to create role:", error);
      throw error;
    }
  },

  // Update existing role
  updateRole: async (
    roleId: string,
    data: {
      display_name?: string;
      description?: string;
      permissions?: string[];
    }
  ) => {
    try {
      logger.debug("🚀 Updating role:", roleId, data);
      const response = await apiClient.api.adminRolesUpdate(roleId, data);
      logger.debug("✅ Update role response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to update role:", error);
      throw error;
    }
  },

  // Delete role
  deleteRole: async (roleId: string) => {
    try {
      logger.debug("🚀 Deleting role:", roleId);
      const response = await apiClient.api.adminRolesDelete(roleId);
      logger.debug("✅ Delete role response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to delete role:", error);
      throw error;
    }
  },

  // Create new permission
  createPermission: async (data: {
    resource: string;
    action: "create" | "read" | "update" | "delete" | "manage" | "assign";
    description: string;
  }) => {
    try {
      logger.debug("🚀 Creating new permission:", data);
      const response = await apiClient.api.adminPermissionsCreate(data);
      logger.debug("✅ Create permission response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to create permission:", error);
      throw error;
    }
  },

  // Delete permission
  deletePermission: async (permissionId: string) => {
    try {
      logger.debug("🚀 Deleting permission:", permissionId);
      const response = await apiClient.api.adminPermissionsDelete(permissionId);
      logger.debug("✅ Delete permission response:", response.data);
      return response.data;
    } catch (error) {
      logger.error("❌ Failed to delete permission:", error);
      throw error;
    }
  },
};

export default rolesService;
