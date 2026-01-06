import React, { createContext, useContext, useState, useCallback } from "react";

interface DeactivatedUserContextType {
  isDeactivated: boolean;
  setDeactivated: (value: boolean) => void;
  handleLogout: () => void;
}

const DeactivatedUserContext = createContext<DeactivatedUserContextType | undefined>(undefined);

export const DeactivatedUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDeactivated, setIsDeactivated] = useState(false);

  const setDeactivated = useCallback((value: boolean) => {
    setIsDeactivated(value);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }, []);

  return (
    <DeactivatedUserContext.Provider value={{ isDeactivated, setDeactivated, handleLogout }}>
      {children}
    </DeactivatedUserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDeactivatedUser = () => {
  const context = useContext(DeactivatedUserContext);
  if (context === undefined) {
    throw new Error("useDeactivatedUser must be used within a DeactivatedUserProvider");
  }
  return context;
};

// Global setter for use in API interceptor (outside React)
let globalSetDeactivated: ((value: boolean) => void) | null = null;

// eslint-disable-next-line react-refresh/only-export-components
export const registerDeactivatedSetter = (setter: (value: boolean) => void) => {
  globalSetDeactivated = setter;
};

// eslint-disable-next-line react-refresh/only-export-components
export const triggerDeactivatedModal = () => {
  if (globalSetDeactivated) {
    globalSetDeactivated(true);
  }
};
