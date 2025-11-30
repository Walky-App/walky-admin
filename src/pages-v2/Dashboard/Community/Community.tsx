import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import {
  AssetIcon,
  FilterBar,
  TimePeriod,
  LastUpdated,
} from "../../../components-v2";
import { BarChart } from "./components/BarChart";
import "./Community.css";

const Community: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['communityCreation', timePeriod],
    queryFn: () => apiClient.api.adminV2DashboardCommunityCreationList({ period: timePeriod }),
  });

  const handleExport = () => {
    console.log("Exporting community data...");
  };

  const chartLabels = apiData?.data.labels || [];
  const chartSubLabels = apiData?.data.subLabels;
  const creationData = (apiData?.data.data || []).map((item: any) => ({
    events: item.events || 0,
    ideas: item.ideas || 0,
    spaces: item.spaces || 0,
  }));

  // Format data for BarChart component
  const weeksFormatted = chartLabels.map((label: string, index: number) => ({
    label,
    dateRange: chartSubLabels?.[index] || "",
  }));

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <main className="community-page" aria-label="Community Dashboard">
      {/* Filter Bar */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        onExport={handleExport}
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
