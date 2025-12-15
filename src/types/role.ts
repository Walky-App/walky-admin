// Role types for legacy pages

// Role name enum for type safety
export type RoleName =
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

export interface Role {
  _id?: string;
  name?: string;
  display_name?: string;
  description?: string;
  scope?: "global" | "school" | "campus";
  permissions?: string[];
  is_system_role?: boolean;
}

export interface Permission {
  _id?: string;
  action?: string;
  description?: string;
  resource?: string;
}

export interface GroupedPermissions {
  [resource: string]: Permission[];
}

// Request type for assigning role - role can be any string for form handling
export interface AssignRoleRequest {
  role: string;
  campus_id?: string;
  school_id?: string;
}

// API-compatible request type with strict role typing
export interface AssignRoleApiRequest {
  role: RoleName;
  campus_id?: string;
  school_id?: string;
}

export interface RemoveRoleRequest {
  role: string;
  campus_id?: string;
}
