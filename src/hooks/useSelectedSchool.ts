import { useState, useEffect } from "react";
import { schoolService } from "../services/schoolService";
import { useAuth } from "./useAuth";
import { getCurrentUserRole } from "../utils/UserRole";
import { Role } from "../types/Role";
import { useSelectedSchoolData } from "./useSchoolsQuery";

export const useSelectedSchool = () => {
  const { user } = useAuth();
  const role = getCurrentUserRole();
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [selectedSchoolName, setSelectedSchoolName] = useState<string | null>(
    null
  );

  // Use React Query to fetch the selected school data
  const { data: selectedSchool, isLoading: loading } = useSelectedSchoolData();

  useEffect(() => {
    const schoolId = schoolService.getSelectedSchool();
    const schoolName = schoolService.getSelectedSchoolName();

    setSelectedSchoolId(schoolId);
    setSelectedSchoolName(schoolName);
  }, [role]);

  const selectSchool = (schoolId: string, schoolName: string) => {
    schoolService.setSelectedSchool(schoolId, schoolName);
    setSelectedSchoolId(schoolId);
    setSelectedSchoolName(schoolName);
  };

  const clearSchool = () => {
    schoolService.clearSelectedSchool();
    setSelectedSchoolId(null);
    setSelectedSchoolName(null);
  };

  const hasSelectedSchool = Boolean(selectedSchoolId);
  const requiresSchoolSelection =
    user && role === Role.ADMIN && !hasSelectedSchool;

  return {
    selectedSchoolId,
    selectedSchoolName,
    selectedSchool,
    hasSelectedSchool,
    requiresSchoolSelection,
    loading,
    selectSchool,
    clearSchool,
  };
};
