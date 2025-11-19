import React, { useState } from "react";
import { CRow, CCol } from "@coreui/react";
import {
  AssetIcon,
  FilterBar,
  TimePeriod,
  LastUpdated,
} from "../../../components-v2";
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

  // Mock data for different time periods
  // All time data (11 months)
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
  ];
  const invitationsDataMonth = [
    { sent: 400, accepted: 350, ignored: 200 },
    { sent: 450, accepted: 380, ignored: 220 },
    { sent: 500, accepted: 420, ignored: 250 },
    { sent: 550, accepted: 460, ignored: 280 },
    { sent: 600, accepted: 500, ignored: 300 },
    { sent: 650, accepted: 540, ignored: 320 },
    { sent: 700, accepted: 580, ignored: 350 },
    { sent: 750, accepted: 620, ignored: 380 },
    { sent: 800, accepted: 660, ignored: 400 },
    { sent: 850, accepted: 700, ignored: 420 },
    { sent: 900, accepted: 750, ignored: 450 },
  ];
  const ideasClicksDataMonth = [
    10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000,
  ];
  const eventsClicksDataMonth = [
    12000, 18000, 22000, 28000, 32000, 38000, 42000, 48000, 52000, 58000, 65000,
  ];

  // Week data (5 weeks in current month)
  const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
  const weekSubLabels = [
    "Oct 1 - Oct 5",
    "Oct 6 - Oct 12",
    "Oct 13 - Oct 19",
    "Oct 20 - Oct 26",
    "Oct 27 - Oct 31",
  ];
  const invitationsDataWeek = [
    { sent: 51, accepted: 45, ignored: 28 },
    { sent: 68, accepted: 49, ignored: 35 },
    { sent: 67, accepted: 28, ignored: 42 },
    { sent: 75, accepted: 48, ignored: 45 },
    { sent: 53, accepted: 41, ignored: 32 },
  ];
  const ideasClicksDataWeek = [25000, 58000, 42000, 48000, 75089];
  const eventsClicksDataWeek = [28000, 45000, 38000, 52000, 75089];

  // Day data (7 days)
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const invitationsDataDay = [
    { sent: 12, accepted: 10, ignored: 5 },
    { sent: 15, accepted: 12, ignored: 7 },
    { sent: 18, accepted: 14, ignored: 8 },
    { sent: 16, accepted: 13, ignored: 6 },
    { sent: 20, accepted: 16, ignored: 9 },
    { sent: 22, accepted: 18, ignored: 10 },
    { sent: 19, accepted: 15, ignored: 8 },
  ];
  const ideasClicksDataDay = [5000, 8000, 10000, 9000, 12000, 14000, 11000];
  const eventsClicksDataDay = [6000, 9000, 11000, 10000, 13000, 15000, 12000];

  // Select data based on time period
  const chartLabels =
    timePeriod === "week"
      ? dayLabels
      : timePeriod === "month"
      ? weekLabels
      : monthLabels;

  const chartSubLabels = timePeriod === "month" ? weekSubLabels : undefined;

  const invitationsData =
    timePeriod === "week"
      ? invitationsDataDay
      : timePeriod === "month"
      ? invitationsDataWeek
      : invitationsDataMonth;

  const ideasClicksData =
    timePeriod === "week"
      ? ideasClicksDataDay
      : timePeriod === "month"
      ? ideasClicksDataWeek
      : ideasClicksDataMonth;

  const eventsClicksData =
    timePeriod === "week"
      ? eventsClicksDataDay
      : timePeriod === "month"
      ? eventsClicksDataWeek
      : eventsClicksDataMonth;

  // Format weeks data for BarChart component
  const weeksFormatted = chartLabels.map((label, index) => ({
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
