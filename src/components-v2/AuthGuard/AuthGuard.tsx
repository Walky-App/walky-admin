import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component that protects routes requiring authentication.
 *
 * - Shows nothing while auth state is loading (prevents flash redirects)
 * - Redirects to /login if user is not authenticated
 * - Renders children if user is authenticated
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Wait for auth state to load before making any decisions
  if (isLoading) {
    return null;
  }

  // Not authenticated - redirect to login, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated - render protected content
  return <>{children}</>;
};

export default AuthGuard;
