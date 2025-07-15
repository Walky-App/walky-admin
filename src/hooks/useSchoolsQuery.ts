import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { schoolService } from "../services/schoolService";
import { School } from "../types/school";

// Query key factory for schools
export const schoolKeys = {
  all: ["schools"] as const,
  lists: () => [...schoolKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...schoolKeys.lists(), { filters }] as const,
  details: () => [...schoolKeys.all, "detail"] as const,
  detail: (id: string) => [...schoolKeys.details(), id] as const,
};

// Hook to get all schools
export const useSchools = (): UseQueryResult<School[], Error> => {
  return useQuery({
    queryKey: schoolKeys.lists(),
    queryFn: () => schoolService.getAllSchools(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook to get a specific school by ID
export const useSchool = (schoolId: string): UseQueryResult<School, Error> => {
  return useQuery({
    queryKey: schoolKeys.detail(schoolId),
    queryFn: () => schoolService.getSchoolById(schoolId),
    enabled: !!schoolId, // Only run if schoolId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get the currently selected school
export const useSelectedSchoolData = () => {
  const selectedSchoolId = schoolService.getSelectedSchool();

  return useQuery({
    queryKey: schoolKeys.detail(selectedSchoolId || ""),
    queryFn: () => schoolService.getSchoolById(selectedSchoolId!),
    enabled: !!selectedSchoolId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
