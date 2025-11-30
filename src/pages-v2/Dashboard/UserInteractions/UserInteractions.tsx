import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { CRow, CCol } from "@coreui/react";
import {
  AssetIcon,
  FilterBar,
  TimePeriod,
  LastUpdated,
} from "../../../components-v2";
import { LineChart } from "../components";
import { BarChart } from "./components/BarChart";
import "./UserInteractions.css";

const UserInteractions: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");

  const handleExport = () => {
    console.log("Exporting data...");
  };

  // Mock data for different time periods
  // All time data (11 months)
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['userInteractions', timePeriod],
    queryFn: () => apiClient.api.adminV2DashboardUserInteractionsList({ period: timePeriod }),
  });

  const data = (apiData?.data || {}) as any;
  const chartLabels = data.labels || [];
  const chartSubLabels = data.subLabels;
  const invitationsData = data.invitationsData || [];
  const ideasClicksData = data.ideasClicksData || [];
  const eventsClicksData = data.eventsClicksData || [];

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  // Format weeks data for BarChart component
  const weeksFormatted = chartLabels.map((label: string, index: number) => ({
    label,
    dateRange: chartSubLabels?.[index] || "",
  }));

  return (
    <main
      className="user-interactions-page"
      aria-label="User Interactions Dashboard"
    >
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
            <AssetIcon
              name="user-interactions-icon"
              color="#389001"
              size={30}
            />
          </div>
        </div>
        <h1 className="user-interactions-title">User Interactions</h1>
      </div>

      {/* Invitations Bar Chart */}
      <div className="invitations-section">
        <BarChart
          title="Invitations"
          weeks={weeksFormatted}
          data={invitationsData}
        />
      </div>

      {/* Line Charts Row */}
      <CRow className="charts-row">
        <CCol xs={12} lg={6}>
          <LineChart
            title="Clicks on collaborate in Ideas"
            data={ideasClicksData}
            labels={chartLabels}
            subLabels={chartSubLabels}
            color="#ebb129"
            backgroundColor="rgba(235, 177, 41, 0.2)"
            maxValue={100000}
          />
        </CCol>
        <CCol xs={12} lg={6}>
          <LineChart
            title="Clicks on going in Events"
            data={eventsClicksData}
            labels={chartLabels}
            subLabels={chartSubLabels}
            color="#ff8050"
            backgroundColor="rgba(255, 128, 80, 0.2)"
            maxValue={100000}
          />
        </CCol>
      </CRow>

      {/* Last Updated Footer */}
      <LastUpdated />
    </main>
  );
};

export default UserInteractions;
