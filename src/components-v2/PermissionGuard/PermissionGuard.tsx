import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PermissionResource, PermissionAction } from '../../lib/permissions';

interface PermissionGuardProps {
  /**
   * The resource to check permissions for
   */
  resource: PermissionResource;
  /**
   * The action to check (default: 'read')
   */
  action?: PermissionAction;
  /**
   * Content to render when user has permission
   */
  children: React.ReactNode;
  /**
   * What to render when user doesn't have permission
   * - 'hidden': render nothing (default for inline elements)
   * - 'redirect': redirect to access denied page
   * - React element: render custom fallback
   */
  fallback?: 'hidden' | 'redirect' | React.ReactNode;
  /**
   * Path to redirect to when fallback is 'redirect' (default: '/dashboard/engagement')
   */
  redirectTo?: string;
}

/**
 * Component for protecting content based on user permissions
 *
 * Usage examples:
 *
 * ```tsx
 * // Hide element if no permission (default behavior)
 * <PermissionGuard resource="active_students" action="update">
 *   <button data-testid="edit-student-btn">Edit Student</button>
 * </PermissionGuard>
 *
 * // Redirect if no permission (useful for route protection)
 * <PermissionGuard resource="campuses" action="read" fallback="redirect">
 *   <CampusesPage />
 * </PermissionGuard>
 *
 * // Custom fallback content
 * <PermissionGuard
 *   resource="role_management"
 *   action="read"
 *   fallback={<div>You don't have access to this feature</div>}
 * >
 *   <RoleManagementPage />
 * </PermissionGuard>
 * ```
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  resource,
  action = 'read',
  children,
  fallback = 'hidden',
  redirectTo = '/dashboard/engagement',
}) => {
  const { can } = usePermissions();

  const hasPermission = can(resource, action);

  if (hasPermission) {
    return <>{children}</>;
  }

  // Handle fallback
  if (fallback === 'hidden') {
    return null;
  }

  if (fallback === 'redirect') {
    return <Navigate to={redirectTo} replace />;
  }

  // Custom fallback element
  return <>{fallback}</>;
};

/**
 * Higher-order component version for wrapping entire components
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  resource: PermissionResource,
  action: PermissionAction = 'read',
  fallback: 'hidden' | 'redirect' | React.ReactNode = 'redirect'
) {
  const WithPermissionComponent: React.FC<P> = (props) => {
    return (
      <PermissionGuard resource={resource} action={action} fallback={fallback}>
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };

  WithPermissionComponent.displayName = `WithPermission(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithPermissionComponent;
}

export default PermissionGuard;
