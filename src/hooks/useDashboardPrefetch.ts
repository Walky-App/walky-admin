import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../API";
import { useDashboard } from "../contexts/DashboardContext";
import { useSchool } from "../contexts/SchoolContext";
import { useCampus } from "../contexts/CampusContext";

// Prefetch all dashboard datasets across periods to make initial navigation instant
export const useDashboardPrefetch = () => {
  const queryClient = useQueryClient();
  const { timePeriod } = useDashboard();
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();

  useEffect(() => {
    const periods: Array<"week" | "month" | "all-time"> = [
      "week",
      "month",
      "all-time",
    ];

    const schoolId = selectedSchool?._id;
    const campusId = selectedCampus?._id;

    periods.forEach((period) => {
      queryClient.prefetchQuery({
        queryKey: ["dashboardStats", period, schoolId, campusId],
        queryFn: () =>
          apiClient.api.adminV2DashboardStatsList({
            period,
            schoolId,
            campusId,
          }),
      });

      queryClient.prefetchQuery({
        queryKey: ["engagementStats", period, schoolId, campusId],
        queryFn: () =>
          apiClient.api.adminV2DashboardEngagementList({
            period,
            schoolId,
            campusId,
          }),
      });

      queryClient.prefetchQuery({
        queryKey: ["retentionStats", period, schoolId, campusId],
        queryFn: () =>
          apiClient.api.adminV2DashboardRetentionList({
            period,
            schoolId,
            campusId,
          }),
      });

      queryClient.prefetchQuery({
        queryKey: ["communityCreation", period, schoolId, campusId],
        queryFn: () =>
          apiClient.api.adminV2DashboardCommunityCreationList({
            period,
            schoolId,
            campusId,
          }),
      });

      queryClient.prefetchQuery({
        queryKey: ["studentSafety", period, schoolId, campusId],
        queryFn: () =>
          apiClient.api.adminV2DashboardStudentSafetyList({
            period,
            schoolId,
            campusId,
          }),
      });

      queryClient.prefetchQuery({
        queryKey: ["studentBehavior", period, schoolId, campusId],
        queryFn: () =>
          apiClient.api.adminV2DashboardStudentBehaviorList({
            period,
            schoolId,
            campusId,
          }),
      });

      queryClient.prefetchQuery({
        queryKey: ["userInteractions", period, schoolId, campusId],
        queryFn: () =>
          apiClient.api.adminV2DashboardUserInteractionsList({
            period,
            schoolId,
            campusId,
          }),
      });

      ["most_popular", "least_popular"].forEach((sortBy) => {
        queryClient.prefetchQuery({
          queryKey: [
            "popularFeatures",
            period,
            schoolId,
            campusId,
            sortBy === "most_popular" ? "most" : "least",
          ],
          queryFn: () =>
            apiClient.api.adminV2DashboardPopularFeaturesList({
              period,
              schoolId,
              campusId,
              sortBy: sortBy as "most_popular" | "least_popular",
            }),
        });
      });
    });
  }, [queryClient, selectedCampus?._id, selectedSchool?._id, timePeriod]);
};
