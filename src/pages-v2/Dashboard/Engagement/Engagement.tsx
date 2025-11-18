import React, { useState } from "react";
import { CRow, CCol } from "@coreui/react";
import { AssetIcon } from "../../../components-v2";
import { StatsCard } from "../components/StatsCard/StatsCard";
import { TimeSelector } from "../components/TimeSelector/TimeSelector";
import { ExportButton } from "../components/ExportButton/ExportButton";
import { LineChart } from "../components/LineChart/LineChart";
import { DonutChart } from "../components/DonutChart/DonutChart";
import { useTheme } from "../../../hooks/useTheme";
import "./Engagement.css";

type TimePeriod = "all-time" | "week" | "month";

const Engagement: React.FC = () => {
  const { theme } = useTheme();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");

  // Mock data for charts
  const userEngagementData = [
    0, 25000, 30000, 28000, 35000, 30000, 40000, 45000, 40000, 50000, 55000,
    75089,
  ];
  const sessionDurationData = [0, 8, 10, 8, 12, 10, 14, 15, 14, 16, 18, 15.25];
  const totalChatsData = [0, 20, 25, 30, 35, 40, 50, 60, 55, 65, 70, 75];
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
    "Dec",
  ];

  const donutData = [
    {
      label: "Events organized by spaces",
      value: 70.16,
      percentage: "70.16%",
      color: "#526ac9",
    },
    {
      label: "Events organized by users",
      value: 29.84,
      percentage: "29.84%",
      color: "#321fdb",
    },
  ];

  const handleExport = () => {
    console.log("Exporting data...");
    // Implement export logic here
  };

  return (
    <main className="engagement-page" aria-label="User Engagement Dashboard">
      {/* Filter Container */}
      <div className="filter-container">
        <div className="filter-options-container">
          <p className="filter-label" style={{ color: theme.colors.bodyColor }}>
            Filter by:
          </p>
          <div className="filter-options">
            <div className="time-period-filter">
              <p
                className="filter-option-label"
                style={{ color: theme.colors.bodyColor }}
              >
                Time period:
              </p>
              <TimeSelector selected={timePeriod} onChange={setTimePeriod} />
            </div>
          </div>
        </div>
        <ExportButton onClick={handleExport} />
      </div>

      {/* Stats Cards */}
      <CRow className="stats-container">
        <CCol xs={12} sm={6} md={6} lg={3}>
          <StatsCard
            title="Total User"
            value="75089"
            icon={
              <AssetIcon name="double-users-icon" color="#8280ff" size={24} />
            }
            iconBgColor="#e5e4ff"
            trend={{
              value: "8.5%",
              direction: "up",
              text: "from last month",
            }}
          />
        </CCol>
        <CCol xs={12} sm={6} md={6} lg={3}>
          <StatsCard
            title="Total Active Events"
            value="10293"
            icon={<AssetIcon name="calendar-icon" color="#ff6b35" size={24} />}
            iconBgColor="#ffded1"
            trend={{
              value: "1.3%",
              direction: "down",
              text: "Up from last month",
            }}
          />
        </CCol>
        <CCol xs={12} sm={6} md={6} lg={3}>
          <StatsCard
            title="Total Spaces Created"
            value="2040"
            icon={<AssetIcon name="space-icon" color="#4a4cd9" size={24} />}
            iconBgColor="#d9e3f7"
            trend={{
              value: "1.3%",
              direction: "up",
              text: "Up from last month",
            }}
          />
        </CCol>
        <CCol xs={12} sm={6} md={6} lg={3}>
          <StatsCard
            title="Total Ideas Created"
            value="10293"
            icon={<AssetIcon name="ideas-icons" color="#ffb830" size={24} />}
            iconBgColor="#fff3d6"
            trend={{
              value: "1.3%",
              direction: "up",
              text: "Up from last month",
            }}
          />
        </CCol>
      </CRow>

      {/* Section Header */}
      <div className="section-header">
        <div className="section-title-container">
          <div
            className="section-icon-container"
            style={{ backgroundColor: "#e5e4ff" }}
          >
            <AssetIcon name="double-users-icon" color="#8280ff" size={24} />
          </div>
          <h2
            className="section-title"
            style={{ color: theme.colors.bodyColor }}
          >
            Engagement
          </h2>
        </div>
        <div className="section-dropdown">
          <select
            className="engagement-dropdown"
            aria-label="Select engagement metric"
            style={{
              backgroundColor: "#fcfdfd",
              borderColor: "#a9abac",
              color: "#5b6168",
            }}
            defaultValue="user-engagement"
          >
            <option value="user-engagement">User Engagement Over Time</option>
          </select>
        </div>
      </div>

      {/* Charts Row 1 */}
      <CRow className="charts-row">
        <CCol xs={12} lg={8}>
          <LineChart
            title="Total active users"
            data={userEngagementData}
            labels={monthLabels}
            color="#00b69b"
            backgroundColor="rgba(0, 182, 155, 0.2)"
            maxValue={100000}
          />
        </CCol>
        <CCol xs={12} lg={4}>
          <LineChart
            title="Total chats"
            data={totalChatsData}
            labels={monthLabels}
            color="#4379ee"
            backgroundColor="rgba(67, 121, 238, 0.3)"
            maxValue={100}
          />
        </CCol>
      </CRow>

      {/* Charts Row 2 */}
      <CRow className="charts-row">
        <CCol xs={12} lg={8}>
          <LineChart
            title="Session duration"
            data={sessionDurationData}
            labels={monthLabels}
            color="#24aff5"
            backgroundColor="rgba(36, 175, 245, 0.3)"
            yAxisLabel=" Min"
            maxValue={20}
          />
        </CCol>
        <CCol xs={12} lg={4}>
          <DonutChart title="Events by Users vs Spaces" data={donutData} />
        </CCol>
      </CRow>

      {/* Last Updated Footer */}
      <div
        className="last-updated-container"
        style={{ backgroundColor: "#ebf0fa" }}
      >
        <p
          className="last-updated-text"
          style={{ color: theme.colors.textMuted }}
        >
          Last updated: 25 oct 2025 - 9:33:00
        </p>
      </div>
    </main>
  );
};

export default Engagement;
