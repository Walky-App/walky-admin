import React, { useState } from "react";
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import {
  AssetIcon,
  FilterBar,
  TimePeriod,
  LastUpdated,
} from "../../../components-v2";
import { StatsCard, LineChart, DonutChart } from "../components";
import { useTheme } from "../../../hooks/useTheme";
import { useMixpanel } from "../../../hooks/useMixpanel";
import "./Engagement.css";

const Engagement: React.FC = () => {
  const { theme } = useTheme();
  const { trackEvent } = useMixpanel();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [selectedMetric, setSelectedMetric] = useState("user-engagement");

  // Mock data for charts - User engagement over time (all months from Jan to Nov 2025)
  const userEngagementDataMonth = [
    10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 75089,
  ];
  const sessionDurationDataMonth = [
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 15.25,
  ];
  const totalChatsDataMonth = [30, 35, 40, 45, 50, 55, 60, 65, 70, 72, 75];
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

  // Mock data for week period (7 days)
  const userEngagementDataWeek = [
    20000, 25000, 30000, 28000, 35000, 50000, 45000,
  ];
  const sessionDurationDataWeek = [10, 12, 13, 11, 14, 15, 14];
  const totalChatsDataWeek = [50, 55, 60, 58, 65, 70, 68];

  // Labels for week view (days of the week)
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Mock data for New users & retention - Week labels and data (5 weeks)
  const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
  const weekSubLabels = [
    "Oct 1 - Oct 5",
    "Oct 6 - Oct 12",
    "Oct 13 - Oct 19",
    "Oct 20 - Oct 26",
    "Oct 27 - Oct 31",
  ];

  // Connection rate data
  const connectionRateDataWeek = [20, 25, 30, 28, 35, 40, 38];
  const connectionRateDataMonth = [20, 30, 35, 40, 60];
  const connectionRateDataAllTime = [
    15, 20, 25, 30, 35, 40, 45, 50, 55, 65, 75,
  ];

  // Inactive signups data
  const inactiveSignupsDataWeek = [2, 3, 4, 5, 6, 7, 6];
  const inactiveSignupsDataMonth = [3, 5, 4, 6, 7];
  const inactiveSignupsDataAllTime = [1, 2, 3, 4, 5, 6, 5, 6, 7, 8, 7];

  // New registrations data
  const newRegistrationsDataWeek = [3000, 4000, 5000, 6000, 7000, 8000, 7500];
  const newRegistrationsDataMonth = [20000, 30000, 25000, 35000, 40000];
  const newRegistrationsDataAllTime = [
    5000, 8000, 12000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000,
  ];

  // Average app opens data
  const avgAppOpensDataWeek = [25, 30, 40, 45, 50, 55, 52];
  const avgAppOpensDataMonth = [30, 45, 55, 60, 70];
  const avgAppOpensDataAllTime = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];

  // Select retention data based on time period
  const connectionRateData =
    timePeriod === "week"
      ? connectionRateDataWeek
      : timePeriod === "month"
      ? connectionRateDataMonth
      : connectionRateDataAllTime;

  const inactiveSignupsData =
    timePeriod === "week"
      ? inactiveSignupsDataWeek
      : timePeriod === "month"
      ? inactiveSignupsDataMonth
      : inactiveSignupsDataAllTime;

  const newRegistrationsData =
    timePeriod === "week"
      ? newRegistrationsDataWeek
      : timePeriod === "month"
      ? newRegistrationsDataMonth
      : newRegistrationsDataAllTime;

  const avgAppOpensData =
    timePeriod === "week"
      ? avgAppOpensDataWeek
      : timePeriod === "month"
      ? avgAppOpensDataMonth
      : avgAppOpensDataAllTime;

  // Labels for retention charts
  const retentionLabels =
    timePeriod === "week"
      ? dayLabels
      : timePeriod === "month"
      ? weekLabels
      : monthLabels;

  const retentionSubLabels = timePeriod === "month" ? weekSubLabels : undefined;

  // For month view, show weekly data. For week view, show daily data. For all-time, show monthly data
  const userEngagementData =
    timePeriod === "all-time"
      ? userEngagementDataMonth
      : userEngagementDataWeek;
  const sessionDurationData =
    timePeriod === "all-time"
      ? sessionDurationDataMonth
      : sessionDurationDataWeek;
  const totalChatsData =
    timePeriod === "all-time" ? totalChatsDataMonth : totalChatsDataWeek;

  // Week: days of the week (Mon, Tue, Wed, etc.) - NO sub-labels
  // Month: weeks (Week 1, Week 2, etc.) - WITH date sub-labels
  // All-time: months (Jan, Feb, etc.) - NO sub-labels
  const chartLabels =
    timePeriod === "week"
      ? dayLabels
      : timePeriod === "month"
      ? weekLabels
      : monthLabels;

  const chartSubLabels = timePeriod === "month" ? weekSubLabels : undefined;

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

  const handleTimePeriodChange = (newPeriod: TimePeriod) => {
    trackEvent("Engagement - Filter Time Period Changed", {
      previous_value: timePeriod,
      new_value: newPeriod,
    });
    setTimePeriod(newPeriod);
  };

  const handleMetricChange = (metric: string) => {
    trackEvent("Engagement - Metric View Changed", {
      metric_type: metric,
      previous_metric: selectedMetric,
    });
    setSelectedMetric(metric);
  };

  const handleExport = () => {
    trackEvent("Engagement - Data Exported", {
      time_period: timePeriod,
      selected_metric: selectedMetric,
    });
    console.log("Exporting data...");
    // Implement export logic here
  };

  return (
    <main className="engagement-page" aria-label="User Engagement Dashboard">
      {/* Filter Bar */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={handleTimePeriodChange}
        onExport={handleExport}
      />

      {/* Stats Cards */}
      <CRow className="stats-container">
        <CCol xs={12} sm={6} md={6} lg={3}>
          <StatsCard
            title="Total User"
            value="75089"
            icon={
              <AssetIcon
                name="double-users-icon"
                color={theme.colors.iconPurple}
              />
            }
            iconBgColor={theme.colors.iconPurpleBg}
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
            icon={
              <AssetIcon name="calendar-icon" color={theme.colors.iconOrange} />
            }
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
            icon={<AssetIcon name="space-icon" color={theme.colors.iconBlue} />}
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
            icon={<AssetIcon name="ideas-icons" color="#ffb830" />}
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
            style={{ backgroundColor: theme.colors.iconPurpleBg }}
          >
            <AssetIcon
              name="double-users-icon"
              color={theme.colors.iconPurple}
              size={24}
            />
          </div>
          <h2
            className="section-title"
            style={{ color: theme.colors.bodyColor }}
          >
            Engagement
          </h2>
        </div>
        <CDropdown className="selector-dropdown">
          <CDropdownToggle
            color="link"
            className="engagement-metric-toggle"
            style={{
              border: `1px solid ${
                theme.isDark ? theme.colors.dropdownBorder : "#CAC4D0"
              }`,
              borderRadius: "8px",
              padding: "12px 16px",
              backgroundColor: theme.colors.cardBg,
              color: theme.colors.bodyColor,
            }}
          >
            <span className="selector-value">
              {selectedMetric === "user-engagement"
                ? "User engagement over time"
                : "New users & retention"}
            </span>
            <AssetIcon
              name="arrow-down"
              size={20}
              color={theme.colors.bodyColor}
            />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem
              onClick={() => handleMetricChange("user-engagement")}
              active={selectedMetric === "user-engagement"}
            >
              User engagement over time
            </CDropdownItem>
            <CDropdownItem
              onClick={() => handleMetricChange("new-retention")}
              active={selectedMetric === "new-retention"}
            >
              New users & retention
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>

      {/* Charts Row 1 */}
      {selectedMetric === "user-engagement" ? (
        <>
          <CRow className="charts-row">
            <CCol xs={12} lg={6}>
              <LineChart
                title="Total active users"
                data={userEngagementData}
                labels={chartLabels}
                subLabels={chartSubLabels}
                color="#00b69b"
                backgroundColor="rgba(0, 182, 155, 0.2)"
                maxValue={100000}
              />
            </CCol>
            <CCol xs={12} lg={6}>
              <LineChart
                title="Total chats"
                data={totalChatsData}
                labels={chartLabels}
                subLabels={chartSubLabels}
                color="#4379ee"
                backgroundColor="rgba(67, 121, 238, 0.3)"
                maxValue={100}
              />
            </CCol>
          </CRow>

          {/* Charts Row 2 */}
          <CRow className="charts-row">
            <CCol xs={12} lg={6}>
              <LineChart
                title="Session duration"
                data={sessionDurationData}
                labels={chartLabels}
                subLabels={chartSubLabels}
                color="#24aff5"
                backgroundColor="rgba(36, 175, 245, 0.3)"
                yAxisLabel=" Min"
                maxValue={25}
              />
            </CCol>
            <CCol xs={12} lg={6}>
              <DonutChart title="Events by Users vs Spaces" data={donutData} />
            </CCol>
          </CRow>
        </>
      ) : (
        <>
          <CRow className="charts-row">
            <CCol xs={12} lg={6}>
              <LineChart
                title="Connection rate"
                data={connectionRateData}
                labels={retentionLabels}
                subLabels={retentionSubLabels}
                color="#00c943"
                backgroundColor="rgba(0, 201, 67, 0.2)"
                maxValue={100}
                yAxisLabel="%"
              />
            </CCol>
            <CCol xs={12} lg={6}>
              <LineChart
                title="Inactive signups"
                data={inactiveSignupsData}
                labels={retentionLabels}
                subLabels={retentionSubLabels}
                color="#ee4343"
                backgroundColor="rgba(238, 67, 67, 0.2)"
                maxValue={10}
              />
            </CCol>
          </CRow>

          {/* Charts Row 2 - New users & retention */}
          <CRow className="charts-row">
            <CCol xs={12} lg={6}>
              <LineChart
                title="New registrations"
                data={newRegistrationsData}
                labels={retentionLabels}
                subLabels={retentionSubLabels}
                color="#5e00b6"
                backgroundColor="rgba(94, 0, 182, 0.2)"
                maxValue={100000}
              />
            </CCol>
            <CCol xs={12} lg={6}>
              <LineChart
                title="Average app opens"
                data={avgAppOpensData}
                labels={retentionLabels}
                subLabels={retentionSubLabels}
                color="#4379ee"
                backgroundColor="rgba(67, 121, 238, 0.3)"
                maxValue={100}
              />
            </CCol>
          </CRow>
        </>
      )}

      {/* Last Updated Footer */}
      <LastUpdated />
    </main>
  );
};

export default Engagement;
