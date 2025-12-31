import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import {
  PermissionResource,
  PermissionAction,
  ResourcePermission,
  getPermissions,
  hasPermission,
  canAccessRoute,
} from '../lib/permissions';

/**
 * Hook for checking user permissions based on their role
 *
 * Usage:
 * ```tsx
 * const { can, canRead, canUpdate, canExport, canCreate, canDelete, getResourcePermissions } = usePermissions();
 *
 * // Check specific permission
 * if (can('active_students', 'update')) {
 *   // Show edit button
 * }
 *
 * // Use shorthand methods
 * if (canExport('engagement')) {
 *   // Show export button
 * }
 * ```
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role || '';

  /**
   * Check if user has a specific permission for a resource
   */
  const can = useCallback(
    (resource: PermissionResource, action: PermissionAction): boolean => {
      return hasPermission(userRole, resource, action);
    },
    [userRole]
  );

  /**
   * Check if user can read a resource
   */
  const canRead = useCallback(
    (resource: PermissionResource): boolean => {
      return hasPermission(userRole, resource, 'read');
    },
    [userRole]
  );

  /**
   * Check if user can create in a resource
   */
  const canCreate = useCallback(
    (resource: PermissionResource): boolean => {
      return hasPermission(userRole, resource, 'create');
    },
    [userRole]
  );

  /**
   * Check if user can update a resource
   */
  const canUpdate = useCallback(
    (resource: PermissionResource): boolean => {
      return hasPermission(userRole, resource, 'update');
    },
    [userRole]
  );

  /**
   * Check if user can delete from a resource
   */
  const canDelete = useCallback(
    (resource: PermissionResource): boolean => {
      return hasPermission(userRole, resource, 'delete');
    },
    [userRole]
  );

  /**
   * Check if user can export from a resource
   */
  const canExport = useCallback(
    (resource: PermissionResource): boolean => {
      return hasPermission(userRole, resource, 'export');
    },
    [userRole]
  );

  /**
   * Check if user can manage a resource (full control)
   */
  const canManage = useCallback(
    (resource: PermissionResource): boolean => {
      return hasPermission(userRole, resource, 'manage');
    },
    [userRole]
  );

  /**
   * Check if user can access a specific route
   */
  const canAccessPath = useCallback(
    (path: string): boolean => {
      return canAccessRoute(userRole, path);
    },
    [userRole]
  );

  /**
   * Get all permissions for a resource
   */
  const getResourcePermissions = useCallback(
    (resource: PermissionResource): ResourcePermission => {
      return getPermissions(userRole, resource);
    },
    [userRole]
  );

  /**
   * Check if user is a super admin (Walky Admin)
   */
  const isSuperAdmin = useMemo(() => userRole === 'super_admin', [userRole]);

  /**
   * Check if user is a school admin
   */
  const isSchoolAdmin = useMemo(() => userRole === 'school_admin', [userRole]);

  /**
   * Check if user is a campus admin
   */
  const isCampusAdmin = useMemo(() => userRole === 'campus_admin', [userRole]);

  /**
   * Check if user is a moderator
   */
  const isModerator = useMemo(() => userRole === 'moderator', [userRole]);

  /**
   * Check if user is Walky Internal (read-only employee access)
   */
  const isWalkyInternal = useMemo(() => userRole === 'walky_internal', [userRole]);

  /**
   * Check if user has admin-level access (super_admin, school_admin, or campus_admin)
   */
  const isAdmin = useMemo(
    () => isSuperAdmin || isSchoolAdmin || isCampusAdmin,
    [isSuperAdmin, isSchoolAdmin, isCampusAdmin]
  );

  return {
    // Permission checking methods
    can,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    canExport,
    canManage,
    canAccessPath,
    getResourcePermissions,
    // Role checks
    isSuperAdmin,
    isSchoolAdmin,
    isCampusAdmin,
    isModerator,
    isWalkyInternal,
    isAdmin,
    // Current user role
    userRole,
  };
};

export default usePermissions;
