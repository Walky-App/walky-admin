import React, { useState } from "react";
import { CRow, CCol } from "@coreui/react";
import { AssetIcon, FilterBar, TimePeriod } from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import { LineChart } from "../components";
import { BarChart } from "./components/BarChart";
import "./UserInteractions.css";

const UserInteractions: React.FC = () => {
  const { theme } = useTheme();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");

  const handleExport = () => {
    console.log("Exporting data...");
  };

  // Mock data for invitations
  const invitationsData = {
    weeks: [
      { label: "Week 1", dateRange: "Oct 1 - Oct 5" },
      { label: "Week 2", dateRange: "Oct 6 - Oct 12" },
      { label: "Week 3", dateRange: "Oct 13 - Oct 19" },
      { label: "Week 4", dateRange: "Oct 20 - Oct 26" },
      { label: "Week 5", dateRange: "Oct 27 - Oct 31" },
    ],
    data: [
      { sent: 51, accepted: 45, ignored: 28 },
      { sent: 68, accepted: 49, ignored: 35 },
      { sent: 67, accepted: 28, ignored: 42 },
      { sent: 75, accepted: 48, ignored: 45 },
      { sent: 53, accepted: 41, ignored: 32 },
    ],
  };

  // Mock data for Ideas clicks
  const ideasClicksData = [25000, 58000, 42000, 48000, 75089];
  const ideasLabels = invitationsData.weeks.map((w) => w.label);

  // Mock data for Events clicks
  const eventsClicksData = [28000, 45000, 38000, 52000, 75089];
  const eventsLabels = invitationsData.weeks.map((w) => w.label);

  return (
    <main
      className="user-interactions-page"
      style={{ backgroundColor: theme.colors.bodyBg }}
      aria-label="User Interactions Dashboard"
    >
      {/* Filter Bar */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        dateRange="October 1 – October 31"
        onExport={handleExport}
      />

      {/* Header Section */}
      <div className="page-header">
        <div className="icon-container" aria-hidden="true">
          <div className="icon-circle" style={{ backgroundColor: "#e9fcf4" }}>
            <AssetIcon
              name="user-interactions-icon"
              color="#389001"
              size={30}
            />
          </div>
        </div>
        <h1 className="page-title" style={{ color: theme.colors.bodyColor }}>
          User Interactions
        </h1>
      </div>

      {/* Invitations Bar Chart */}
      <div className="invitations-section">
        <BarChart
          title="Invitations"
          weeks={invitationsData.weeks}
          data={invitationsData.data}
        />
      </div>

      {/* Line Charts Row */}
      <CRow className="charts-row">
        <CCol xs={12} lg={6}>
          <LineChart
            title="Clicks on collaborate in Ideas"
            data={ideasClicksData}
            labels={ideasLabels}
            color="#ebb129"
            backgroundColor="rgba(235, 177, 41, 0.2)"
            maxValue={100000}
          />
        </CCol>
        <CCol xs={12} lg={6}>
          <LineChart
            title="Clicks on going in Events"
            data={eventsClicksData}
            labels={eventsLabels}
            color="#ff8050"
            backgroundColor="rgba(255, 128, 80, 0.2)"
            maxValue={100000}
          />
        </CCol>
      </CRow>

      {/* Footer */}
      <div className="footer-container">
        <div
          className="suggest-container"
          style={{ backgroundColor: theme.colors.lastUpdatedBg }}
        >
          <p className="suggest-text" style={{ color: theme.colors.textMuted }}>
            Don't see the data you are looking for?
          </p>
          <button className="suggest-link" data-testid="suggest-data-button">
            Suggest here
          </button>
        </div>
        <div className="last-updated-container">
          <p
            className="last-updated-text"
            style={{ color: theme.colors.textMuted }}
          >
            Last updated: Oct 25, 2025
          </p>
        </div>
      </div>
    </main>
  );
};

export default UserInteractions;
