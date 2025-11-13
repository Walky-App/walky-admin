import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";

export interface Campus {
  _id: string;
  campus_name: string;
  school_id?: {
    _id: string;
    school_name: string;
  };
}

interface CampusContextType {
  selectedCampus: Campus | null;
  setSelectedCampus: (campus: Campus | null) => void;
  availableCampuses: Campus[];
  setAvailableCampuses: (campuses: Campus[]) => void;
  isLoadingCampuses: boolean;
  setIsLoadingCampuses: (loading: boolean) => void;
  clearCampusSelection: () => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

interface CampusProviderProps {
  children: ReactNode;
}

export const CampusProvider: React.FC<CampusProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [selectedCampus, setSelectedCampusState] = useState<Campus | null>(
    null
  );
  const [availableCampuses, setAvailableCampuses] = useState<Campus[]>([]);
  const [isLoadingCampuses, setIsLoadingCampuses] = useState(false);

  // Load selected campus from localStorage on mount
  useEffect(() => {
    const savedCampus = localStorage.getItem("selectedCampus");
    if (savedCampus) {
      try {
        setSelectedCampusState(JSON.parse(savedCampus));
      } catch (error) {
        console.error("Failed to parse saved campus:", error);
        localStorage.removeItem("selectedCampus");
      }
    }
  }, []);

  // Set selected campus and persist to localStorage
  const setSelectedCampus = (campus: Campus | null) => {
    setSelectedCampusState(campus);
    if (campus) {
      localStorage.setItem("selectedCampus", JSON.stringify(campus));
    } else {
      localStorage.removeItem("selectedCampus");
    }
  };

  // Clear campus selection
  const clearCampusSelection = () => {
    setSelectedCampusState(null);
    localStorage.removeItem("selectedCampus");
  };

  // Auto-select campus for campus_admin users
  useEffect(() => {
    if (user?.role === "campus_admin" && user?.campus_id && !selectedCampus) {
      // For campus_admin, auto-select their campus
      // This will be populated when campuses are fetched
    }
  }, [user, selectedCampus]);

  return (
    <CampusContext.Provider
      value={{
        selectedCampus,
        setSelectedCampus,
        availableCampuses,
        setAvailableCampuses,
        isLoadingCampuses,
        setIsLoadingCampuses,
        clearCampusSelection,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCampus = (): CampusContextType => {
  const context = useContext(CampusContext);
  if (context === undefined) {
    throw new Error("useCampus must be used within a CampusProvider");
  }
  return context;
};
