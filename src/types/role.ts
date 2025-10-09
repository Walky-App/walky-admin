export interface Role {
  _id: string;
  name: string;
  display_name: string;
  description: string;
  permissions: string[];
  is_system_role: boolean;
  scope: 'global' | 'campus';
  created_at: Date;
  updated_at: Date;
}

export interface Permission {
  _id: string;
  resource: string;
  action: string;
  code: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface GroupedPermissions {
  [resource: string]: Array<{
    action: string;
    code: string;
    description: string;
  }>;
}

export interface UserRole {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  primary_role: string;
  roles: Array<{
    role: string;
    campus_id?: {
      _id: string;
      campus_name: string;
    };
    assigned_by: {
      _id: string;
      first_name: string;
      last_name: string;
      email: string;
    };
    assigned_at: Date;
  }>;
}

export interface AssignRoleRequest {
  role: string;
  campus_id?: string;
}

export interface RemoveRoleRequest {
  role: string;
  campus_id?: string;
}

export interface CheckPermissionRequest {
  permission: string;
  campus_id?: string;
}

export interface CheckPermissionResponse {
  success: boolean;
  has_permission: boolean;
  granted_by: string | null;
  permission: string;
  campus_id: string | null;
}

export interface CreateRoleRequest {
  name: string;
  display_name: string;
  description: string;
  permissions: string[];
  scope: 'global' | 'campus';
}

export interface UpdateRoleRequest {
  display_name?: string;
  description?: string;
  permissions?: string[];
  scope?: 'global' | 'campus';
}

export interface CreatePermissionRequest {
  resource: string;
  action: string;
  description: string;
}
