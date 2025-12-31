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

  const syncUserFromStorage = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
        return;
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    syncUserFromStorage();
    setIsLoading(false);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user" || event.key === "token" || event.key === null) {
        syncUserFromStorage();
      }
    };

    const handleUserUpdated = () => {
      syncUserFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth:user-updated", handleUserUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth:user-updated", handleUserUpdated);
    };
     
  }, []);

  const updateUser = (nextUser: User | null) => {
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
      setUser(nextUser);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    }

    // Notify other hooks/components to refresh their local state
    window.dispatchEvent(new Event("auth:user-updated"));
  };

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
    updateUser,
  };
};
