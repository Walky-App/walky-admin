import { useState, useEffect } from "react";

interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
  campus_id?: string;
  school_id?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const hasRole = (allowedRoles: string[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const isSuperAdmin = (): boolean => {
    return user?.role === "super_admin";
  };

  const isCampusAdmin = (): boolean => {
    return user?.role === "campus_admin";
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    isSuperAdmin,
    isCampusAdmin,
  };
};
