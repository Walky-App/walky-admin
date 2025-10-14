import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export interface School {
  _id: string;
  school_name: string;
  display_name?: string;
  email_domain?: string;
  logo_url?: string;
  is_active?: boolean;
}

interface SchoolContextType {
  selectedSchool: School | null;
  setSelectedSchool: (school: School | null) => void;
  availableSchools: School[];
  setAvailableSchools: (schools: School[]) => void;
  isLoadingSchools: boolean;
  setIsLoadingSchools: (loading: boolean) => void;
  clearSchoolSelection: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

interface SchoolProviderProps {
  children: ReactNode;
}

export const SchoolProvider: React.FC<SchoolProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [selectedSchool, setSelectedSchoolState] = useState<School | null>(null);
  const [availableSchools, setAvailableSchools] = useState<School[]>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);

  // Load selected school from localStorage on mount
  useEffect(() => {
    const savedSchool = localStorage.getItem('selectedSchool');
    if (savedSchool) {
      try {
        setSelectedSchoolState(JSON.parse(savedSchool));
      } catch (error) {
        console.error('Failed to parse saved school:', error);
        localStorage.removeItem('selectedSchool');
      }
    }
  }, []);

  // Set selected school and persist to localStorage
  const setSelectedSchool = (school: School | null) => {
    setSelectedSchoolState(school);
    if (school) {
      localStorage.setItem('selectedSchool', JSON.stringify(school));
    } else {
      localStorage.removeItem('selectedSchool');
    }
  };

  // Clear school selection
  const clearSchoolSelection = () => {
    setSelectedSchoolState(null);
    localStorage.removeItem('selectedSchool');
  };

  // Auto-select school for school_admin users
  useEffect(() => {
    if (user?.role === 'school_admin' && user?.school_id && !selectedSchool) {
      // For school_admin, auto-select their school
      // This will be populated when schools are fetched
    }
  }, [user, selectedSchool]);

  return (
    <SchoolContext.Provider
      value={{
        selectedSchool,
        setSelectedSchool,
        availableSchools,
        setAvailableSchools,
        isLoadingSchools,
        setIsLoadingSchools,
        clearSchoolSelection,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = (): SchoolContextType => {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
