import { createContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  role: string;
  // Add other user properties as needed
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on mount
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Use the existing API setup
      const API = (await import("../API")).default;
      const response = await API.post("/login", {
        email,
        password,
      });

      const token = response?.data?.access_token;
      const userData = response?.data?.user || {
        id: "1", // Default fallback
        email: email,
        role: response?.data?.role || "7891", // Default to admin for now
      };

      if (token) {
        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userRole", userData.role);
        setUser(userData);
      } else {
        throw new Error("Token not found in response");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("selectedSchool");
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
