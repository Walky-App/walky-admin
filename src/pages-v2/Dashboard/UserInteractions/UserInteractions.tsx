import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { CRow, CCol } from "@coreui/react";
import { AssetIcon, FilterBar, LastUpdated } from "../../../components-v2";
import { DashboardSkeleton, LineChart } from "../components";
import { BarChart } from "./components/BarChart";
import "./UserInteractions.css";

import { useDashboard } from "../../../contexts/DashboardContext";
import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";

const UserInteractions: React.FC = () => {
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const { timePeriod, setTimePeriod } = useDashboard();

  // ... (inside component)

  const { data: apiData, isLoading } = useQuery({
    queryKey: [
      "userInteractions",
      timePeriod,
      selectedSchool?._id,
      selectedCampus?._id,
    ],
    queryFn: () =>
      apiClient.api.adminV2DashboardUserInteractionsList({
        period: timePeriod,
        schoolId: selectedSchool?._id,
        campusId: selectedCampus?._id,
      }),
  });

  interface InvitationData {
    sent: number;
    accepted: number;
    ignored: number;
  }
  const data = apiData?.data || { labels: [], subLabels: [], invitationsData: [], ideasClicksData: [], eventsClicksData: [] };
  const chartLabels = data.labels || [];
  const chartSubLabels = data.subLabels;
  const invitationsData = (data.invitationsData || []) as InvitationData[];
  const ideasClicksData = data.ideasClicksData || [];
  const eventsClicksData = data.eventsClicksData || [];

  // Keep hooks before any early returns to preserve hook order
  const exportRef = useRef<HTMLElement | null>(null);

  if (isLoading) {
    return <DashboardSkeleton />;
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
      ref={exportRef}
    >
      {/* Filter Bar */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        exportTargetRef={exportRef}
        exportFileName={`user_interactions_${timePeriod}`}
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
          />
        </CCol>
      </CRow>

      {/* Last Updated Footer */}
      <LastUpdated />
    </main>
  );
};

export default UserInteractions;
