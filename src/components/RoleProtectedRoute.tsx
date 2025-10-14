import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ReactElement } from 'react';

interface RoleProtectedRouteProps {
  children: ReactElement;
  allowedRoles: string[];
}

/**
 * Role-based route protection component
 * Checks if the authenticated user has one of the allowed roles
 * Redirects to /unauthorized if user doesn't have the required role
 * Redirects to /login if user is not authenticated
 */
export const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    console.warn(`Access denied: User role "${user.role}" not in allowed roles:`, allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  // User has required role - render children
  return children;
};
