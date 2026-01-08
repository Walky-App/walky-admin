// Permission system for role-based access control
// Based on the permission matrix for Walky Admin, School Admin, Campus Admin, and Moderator roles

export type RoleName = 'super_admin' | 'school_admin' | 'campus_admin' | 'moderator' | 'walky_internal';

export type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'export' | 'manage';

// Resource names that match the permission matrix
export type PermissionResource =
  // Dashboard
  | 'engagement'
  | 'popular_features'
  | 'user_interactions'
  | 'community'
  | 'student_safety'
  | 'student_behavior'
  // Campus - Manage Students
  | 'active_students'
  | 'banned_students'
  | 'inactive_students'
  | 'disengaged_students'
  | 'reported_content'
  // Events
  | 'events_manager'
  | 'events_insights'
  // Spaces
  | 'spaces_manager'
  | 'spaces_insights'
  // Ideas
  | 'ideas_manager'
  | 'ideas_insights'
  // Moderation
  | 'report_safety'
  | 'report_history'
  // Admin
  | 'campuses'
  | 'ambassadors'
  | 'role_management';

// Permission definition for a resource
export interface ResourcePermission {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  export: boolean;
  manage: boolean;
}

// Default no permissions
const noPermissions: ResourcePermission = {
  read: false,
  create: false,
  update: false,
  delete: false,
  export: false,
  manage: false,
};

// Read only permissions
const readOnly: ResourcePermission = {
  read: true,
  create: false,
  update: false,
  delete: false,
  export: false,
  manage: false,
};

// Read and export permissions
const readExport: ResourcePermission = {
  read: true,
  create: false,
  update: false,
  delete: false,
  export: true,
  manage: false,
};

// Read, update, export permissions
const readUpdateExport: ResourcePermission = {
  read: true,
  create: false,
  update: true,
  delete: false,
  export: true,
  manage: false,
};

// Read, update, delete, export permissions (for content management)
const readUpdateDeleteExport: ResourcePermission = {
  read: true,
  create: false,
  update: true,
  delete: true,
  export: true,
  manage: false,
};

// Create, read, delete permissions (for Ambassadors)
const createReadDelete: ResourcePermission = {
  read: true,
  create: true,
  update: false,
  delete: true,
  export: false,
  manage: false,
};

// CRUD + manage permissions (for Role Management)
const fullCrudManage: ResourcePermission = {
  read: true,
  create: true,
  update: true,
  delete: true,
  export: false,
  manage: true,
};

// Read, update permissions (for Campuses)
const readUpdate: ResourcePermission = {
  read: true,
  create: false,
  update: true,
  delete: false,
  export: false,
  manage: false,
};

// Permission matrix for each role
// Based on the provided permission documentation
type PermissionMatrix = Record<RoleName, Record<PermissionResource, ResourcePermission>>;

export const permissionMatrix: PermissionMatrix = {
  // Walky Admin - Full system access across all campuses and schools
  super_admin: {
    // Dashboard
    engagement: readExport,
    popular_features: readExport,
    user_interactions: readExport,
    community: readExport,
    student_safety: readExport,
    student_behavior: readExport,
    // Campus - Manage Students
    active_students: readUpdateExport,
    banned_students: readUpdateExport,
    inactive_students: readUpdateExport,
    disengaged_students: readExport,
    reported_content: readUpdateExport,
    // Events
    events_manager: readUpdateDeleteExport,
    events_insights: readExport,
    // Spaces
    spaces_manager: readUpdateDeleteExport,
    spaces_insights: readExport,
    // Ideas
    ideas_manager: readUpdateDeleteExport,
    ideas_insights: readExport,
    // Moderation
    report_safety: readUpdateExport,
    report_history: readUpdateExport,
    // Admin
    campuses: readUpdate,
    ambassadors: createReadDelete,
    role_management: fullCrudManage,
  },

  // School Admin - Full access to manage all campuses and users within a specific school
  school_admin: {
    // Dashboard
    engagement: readExport,
    popular_features: readExport,
    user_interactions: readExport,
    community: readExport,
    student_safety: readExport,
    student_behavior: readExport,
    // Campus - Manage Students
    active_students: readUpdateExport,
    banned_students: readUpdateExport,
    inactive_students: readUpdateExport,
    disengaged_students: readExport,
    reported_content: readUpdateExport,
    // Events
    events_manager: readUpdateDeleteExport,
    events_insights: readExport,
    // Spaces
    spaces_manager: readUpdateDeleteExport,
    spaces_insights: readExport,
    // Ideas
    ideas_manager: readUpdateDeleteExport,
    ideas_insights: readExport,
    // Moderation
    report_safety: readUpdateExport,
    report_history: readUpdateExport,
    // Admin
    campuses: readUpdate,
    ambassadors: createReadDelete,
    role_management: fullCrudManage,
  },

  // Campus Admin - Full access within assigned campus
  campus_admin: {
    // Dashboard
    engagement: readExport,
    popular_features: readExport,
    user_interactions: readExport,
    community: readExport,
    student_safety: readExport,
    student_behavior: readExport,
    // Campus - Manage Students
    active_students: readUpdateExport,
    banned_students: readUpdateExport,
    inactive_students: readUpdateExport,
    disengaged_students: readExport,
    reported_content: readUpdateExport,
    // Events
    events_manager: readUpdateDeleteExport,
    events_insights: readExport,
    // Spaces
    spaces_manager: readUpdateDeleteExport,
    spaces_insights: readExport,
    // Ideas
    ideas_manager: readUpdateDeleteExport,
    ideas_insights: readExport,
    // Moderation
    report_safety: readUpdateExport,
    report_history: readUpdateExport,
    // Admin
    campuses: readUpdate,
    ambassadors: createReadDelete,
    role_management: fullCrudManage,
  },

  // Moderator - Can read and delete resources within campus (limited permissions)
  moderator: {
    // Dashboard - Read only, no export
    engagement: readOnly,
    popular_features: readOnly,
    user_interactions: readOnly,
    community: readOnly,
    student_safety: readOnly,
    student_behavior: readOnly,
    // Campus - Manage Students - No access
    active_students: noPermissions,
    banned_students: noPermissions,
    inactive_students: noPermissions,
    disengaged_students: noPermissions,
    reported_content: noPermissions,
    // Events - Read only
    events_manager: readOnly,
    events_insights: readOnly,
    // Spaces - Read only
    spaces_manager: readOnly,
    spaces_insights: readOnly,
    // Ideas - Read only
    ideas_manager: readOnly,
    ideas_insights: readOnly,
    // Moderation - Read, Update, Export (this is where moderators have more power)
    report_safety: readUpdateExport,
    report_history: readUpdateExport,
    // Admin - No access
    campuses: noPermissions,
    ambassadors: noPermissions,
    role_management: noPermissions,
  },

  // Walky Internal - Read-only visibility for Walky employees (analytics, monitoring, support)
  // No create, update, delete, export, or manage permissions
  walky_internal: {
    // Dashboard - Read only, no export
    engagement: readOnly,
    popular_features: readOnly,
    user_interactions: readOnly,
    community: readOnly,
    student_safety: readOnly,
    student_behavior: readOnly,
    // Campus - Manage Students - No access for walky_internal
    active_students: noPermissions,
    banned_students: noPermissions,
    inactive_students: noPermissions,
    disengaged_students: noPermissions,
    reported_content: noPermissions,
    // Events - Read only
    events_manager: readOnly,
    events_insights: readOnly,
    // Spaces - Read only
    spaces_manager: readOnly,
    spaces_insights: readOnly,
    // Ideas - Read only
    ideas_manager: readOnly,
    ideas_insights: readOnly,
    // Moderation/Reports - No access for walky_internal
    report_safety: noPermissions,
    report_history: noPermissions,
    // Admin - Read-only access to campuses/ambassadors for visibility
    campuses: readOnly,
    ambassadors: readOnly,
    role_management: readOnly,
  },
};

// Helper function to get permissions for a role and resource
export function getPermissions(role: string, resource: PermissionResource): ResourcePermission {
  const normalizedRole = role as RoleName;
  if (permissionMatrix[normalizedRole]) {
    return permissionMatrix[normalizedRole][resource] || noPermissions;
  }
  return noPermissions;
}

// Helper function to check a specific permission
export function hasPermission(
  role: string,
  resource: PermissionResource,
  action: PermissionAction
): boolean {
  const permissions = getPermissions(role, resource);
  return permissions[action];
}

// Route to resource mapping for route protection
export const routeResourceMap: Record<string, PermissionResource> = {
  // Dashboard routes
  '/dashboard/engagement': 'engagement',
  '/dashboard/popular-features': 'popular_features',
  '/dashboard/user-interactions': 'user_interactions',
  '/dashboard/community': 'community',
  '/dashboard/student-safety': 'student_safety',
  '/dashboard/student-behavior': 'student_behavior',
  // Campus - Manage Students routes
  '/manage-students/active': 'active_students',
  '/manage-students/banned': 'banned_students',
  '/manage-students/deactivated': 'inactive_students',
  '/manage-students/disengaged': 'disengaged_students',
  // Events routes
  '/events': 'events_manager',
  '/events/insights': 'events_insights',
  // Spaces routes
  '/spaces': 'spaces_manager',
  '/spaces/insights': 'spaces_insights',
  // Ideas routes
  '/ideas': 'ideas_manager',
  '/ideas/insights': 'ideas_insights',
  // Moderation routes
  '/report-safety': 'report_safety',
  '/report-history': 'report_history',
  // Admin routes
  '/admin/campuses': 'campuses',
  '/admin/ambassadors': 'ambassadors',
  '/admin/role-management': 'role_management',
};

// Get resource from route path
export function getResourceFromRoute(path: string): PermissionResource | null {
  return routeResourceMap[path] || null;
}

// Check if user can access a specific route
export function canAccessRoute(role: string, path: string): boolean {
  const resource = getResourceFromRoute(path);
  if (!resource) {
    // If no mapping exists, allow access by default (e.g., for settings page)
    return true;
  }
  return hasPermission(role, resource, 'read');
}

// Display name type for roles (used in UI)
export type RoleDisplayName = 'Walky Admin' | 'School Admin' | 'Campus Admin' | 'Moderator' | 'Walky Internal';

// Mapping between internal role names and display names
export const roleDisplayNameMap: Record<RoleName, RoleDisplayName> = {
  super_admin: 'Walky Admin',
  school_admin: 'School Admin',
  campus_admin: 'Campus Admin',
  moderator: 'Moderator',
  walky_internal: 'Walky Internal',
};

// Mapping from display names to internal role names
export const displayNameToRoleMap: Record<RoleDisplayName, RoleName> = {
  'Walky Admin': 'super_admin',
  'School Admin': 'school_admin',
  'Campus Admin': 'campus_admin',
  'Moderator': 'moderator',
  'Walky Internal': 'walky_internal',
};

/**
 * Role hierarchy for member creation/role assignment
 * Defines which roles each role can assign to new or existing members:
 * - Walky Admin (super_admin): can add School Admin, Campus Admin, Moderator
 * - School Admin (school_admin): can add Campus Admin, Moderator
 * - Campus Admin (campus_admin): can add Moderator
 * - Moderator: cannot add anyone
 * - Walky Internal: cannot add anyone
 */
const roleHierarchy: Record<RoleName, RoleName[]> = {
  super_admin: ['school_admin', 'campus_admin', 'moderator'],
  school_admin: ['campus_admin', 'moderator'],
  campus_admin: ['moderator'],
  moderator: [],
  walky_internal: [],
};

/**
 * Get the roles that a user with the given role can assign to others
 * @param userRole - The current user's role (internal name like 'super_admin')
 * @returns Array of internal role names that can be assigned
 */
export function getAssignableRoles(userRole: string): RoleName[] {
  const normalizedRole = userRole as RoleName;
  return roleHierarchy[normalizedRole] || [];
}

/**
 * Get the display names of roles that a user can assign
 * @param userRole - The current user's role (internal name like 'super_admin')
 * @returns Array of display role names (like 'School Admin')
 */
export function getAssignableRoleDisplayNames(userRole: string): RoleDisplayName[] {
  const assignableRoles = getAssignableRoles(userRole);
  return assignableRoles.map(role => roleDisplayNameMap[role]);
}

/**
 * Check if a user with the given role can assign a specific role
 * @param userRole - The current user's role (internal name)
 * @param targetRole - The role to check if assignable (internal name)
 * @returns Boolean indicating if the role can be assigned
 */
export function canAssignRole(userRole: string, targetRole: string): boolean {
  const assignableRoles = getAssignableRoles(userRole);
  return assignableRoles.includes(targetRole as RoleName);
}

/**
 * Check if a user can assign a role using display names
 * @param userRole - The current user's role (internal name like 'super_admin')
 * @param targetRoleDisplayName - The target role display name (like 'School Admin')
 * @returns Boolean indicating if the role can be assigned
 */
export function canAssignRoleByDisplayName(userRole: string, targetRoleDisplayName: string): boolean {
  const targetRole = displayNameToRoleMap[targetRoleDisplayName as RoleDisplayName];
  if (!targetRole) return false;
  return canAssignRole(userRole, targetRole);
}
