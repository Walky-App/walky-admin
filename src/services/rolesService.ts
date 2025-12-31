import { apiClient } from "../API";

export const rolesService = {
  // Get all available roles
  getRoles: async () => {
    try {
      console.log("🚀 Fetching roles");
      const response = await apiClient.api.adminRolesList();
      console.log("✅ Roles response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch roles:", error);
      throw error;
    }
  },

  // Get all available permissions
  getPermissions: async () => {
    try {
      console.log("🚀 Fetching permissions");
      const response = await apiClient.api.adminPermissionsList();
      console.log("✅ Permissions response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch permissions:", error);
      throw error;
    }
  },

  // Get user's roles
  getUserRoles: async (userId: string) => {
    try {
      console.log("🚀 Fetching user roles for:", userId);
      const response = await apiClient.api.adminUsersRolesList(userId);
      console.log("✅ User roles response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch user roles:", error);
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
      console.log("🚀 Assigning role to user:", userId, data);
      const response = await apiClient.api.adminUsersAssignRoleCreate(
        userId,
        data
      );
      console.log("✅ Assign role response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to assign role:", error);
      throw error;
    }
  },

  // Remove role from user
  removeRole: async (
    userId: string,
    data: { role: string; campus_id?: string }
  ) => {
    try {
      console.log("🚀 Removing role from user:", userId, data);
      const response = await apiClient.api.adminUsersRemoveRoleDelete(
        userId,
        data
      );
      console.log("✅ Remove role response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to remove role:", error);
      throw error;
    }
  },

  // Check if user has permission
  checkPermission: async (
    userId: string,
    data: { permission: string; campus_id?: string; school_id?: string }
  ) => {
    try {
      console.log("🚀 Checking user permission:", userId, data);
      const response = await apiClient.api.adminUsersCheckPermissionCreate(
        userId,
        data
      );
      console.log("✅ Check permission response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to check permission:", error);
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
      console.log("🚀 Creating new role:", data);
      const response = await apiClient.api.adminRolesCreate(data);
      console.log("✅ Create role response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to create role:", error);
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
      console.log("🚀 Updating role:", roleId, data);
      const response = await apiClient.api.adminRolesUpdate(roleId, data);
      console.log("✅ Update role response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to update role:", error);
      throw error;
    }
  },

  // Delete role
  deleteRole: async (roleId: string) => {
    try {
      console.log("🚀 Deleting role:", roleId);
      const response = await apiClient.api.adminRolesDelete(roleId);
      console.log("✅ Delete role response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to delete role:", error);
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
      console.log("🚀 Creating new permission:", data);
      const response = await apiClient.api.adminPermissionsCreate(data);
      console.log("✅ Create permission response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to create permission:", error);
      throw error;
    }
  },

  // Delete permission
  deletePermission: async (permissionId: string) => {
    try {
      console.log("🚀 Deleting permission:", permissionId);
      const response = await apiClient.api.adminPermissionsDelete(permissionId);
      console.log("✅ Delete permission response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to delete permission:", error);
      throw error;
    }
  },
};

export default rolesService;
