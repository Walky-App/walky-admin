import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { AssetIcon, FilterBar, LastUpdated } from "../../../components-v2";
import { BarChart } from "./components/BarChart";
import { DashboardSkeleton } from "../components";
import "./Community.css";

import { useDashboard } from "../../../contexts/DashboardContext";
import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";

const Community: React.FC = () => {
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const { timePeriod, setTimePeriod } = useDashboard();

  const { data: apiData, isLoading } = useQuery({
    queryKey: [
      "communityCreation",
      timePeriod,
      selectedSchool?._id,
      selectedCampus?._id,
    ],
    queryFn: () =>
      apiClient.api.adminV2DashboardCommunityCreationList({
        period: timePeriod,
        schoolId: selectedSchool?._id,
        campusId: selectedCampus?._id,
      }),
  });

  // ... (inside component)

  const chartLabels = apiData?.data.labels || [];
  const chartSubLabels = apiData?.data.subLabels;
  const creationData = (apiData?.data.data || []).map((item: any) => ({
    events: item.events || 0,
    ideas: item.ideas || 0,
    spaces: item.spaces || 0,
  }));

  // Keep hooks before any early returns to preserve hook order
  const exportRef = useRef<HTMLElement | null>(null);

  // Format data for BarChart component
  const weeksFormatted = chartLabels.map((label: string, index: number) => ({
    label,
    dateRange: chartSubLabels?.[index] || "",
  }));

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <main
      className="community-page"
      aria-label="Community Dashboard"
      ref={exportRef}
    >
      {/* Filter Bar */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        exportTargetRef={exportRef}
        exportFileName={`community_${timePeriod}`}
      />

      {/* Header Section */}
      <div className="page-header">
        <div className="icon-container" aria-hidden="true">
          <div className="icon-circle">
            <AssetIcon name="popular-emoji-icon" color="#f69b39" size={30} />
          </div>
        </div>
        <h1 className="community-title">Community Creation</h1>
      </div>

      {/* Creation Metrics Bar Chart */}
      <div className="creation-section">
        <BarChart
          title="Creation metrics by type"
          weeks={weeksFormatted}
          data={creationData}
        />
      </div>

      {/* Last Updated Footer */}
      <LastUpdated />
    </main>
  );
};

export default Community;
