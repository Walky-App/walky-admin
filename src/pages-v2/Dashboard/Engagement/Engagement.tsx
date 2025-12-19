import React, { useEffect, useRef, useState } from "react";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "../../../API";
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import { AssetIcon, FilterBar, LastUpdated } from "../../../components-v2";
import {
  StatsCard,
  LineChart,
  DonutChart,
  DashboardSkeleton,
} from "../components";
import { useTheme } from "../../../hooks/useTheme";
import { usePermissions } from "../../../hooks/usePermissions";
import "./Engagement.css";

import { useDashboard } from "../../../contexts/DashboardContext";
import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";

const Engagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const { timePeriod, setTimePeriod } = useDashboard();
  const { canExport } = usePermissions();
  const [selectedMetric, setSelectedMetric] = useState("user-engagement");
  const exportRef = useRef<HTMLElement | null>(null);

  // Check if user can export engagement data
  const showExport = canExport("engagement");

  const fetchDashboardStats = (period: "week" | "month" | "all-time") =>
    apiClient.api.adminV2DashboardStatsList({
      period,
      schoolId: selectedSchool?._id,
      campusId: selectedCampus?._id,
    });

  const fetchEngagementStats = (period: "week" | "month" | "all-time") =>
    apiClient.api.adminV2DashboardEngagementList({
      period,
      schoolId: selectedSchool?._id,
      campusId: selectedCampus?._id,
    });

  const fetchRetentionStats = (period: "week" | "month" | "all-time") =>
    apiClient.api.adminV2DashboardRetentionList({
      period,
      schoolId: selectedSchool?._id,
      campusId: selectedCampus?._id,
    });

  const { data: engagementData, isLoading: isEngagementLoading } = useQuery({
    queryKey: [
      "engagementStats",
      timePeriod,
      selectedSchool?._id,
      selectedCampus?._id,
    ],
    queryFn: () =>
      fetchEngagementStats(timePeriod as "week" | "month" | "all-time"),
    placeholderData: keepPreviousData,
  });

  const { data: retentionData, isLoading: isRetentionLoading } = useQuery({
    queryKey: [
      "retentionStats",
      timePeriod,
      selectedSchool?._id,
      selectedCampus?._id,
    ],
    queryFn: () =>
      fetchRetentionStats(timePeriod as "week" | "month" | "all-time"),
    placeholderData: keepPreviousData,
  });

  const { data: dashboardStats, isLoading: isStatsLoading } = useQuery({
    queryKey: [
      "dashboardStats",
      timePeriod,
      selectedSchool?._id,
      selectedCampus?._id,
    ],
    queryFn: () =>
      fetchDashboardStats(timePeriod as "week" | "month" | "all-time"),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const periods: Array<"week" | "month" | "all-time"> = [
      "week",
      "month",
      "all-time",
    ];

    periods.forEach((period) => {
      queryClient.prefetchQuery({
        queryKey: [
          "dashboardStats",
          period,
          selectedSchool?._id,
          selectedCampus?._id,
        ],
        queryFn: () => fetchDashboardStats(period),
      });
      queryClient.prefetchQuery({
        queryKey: [
          "engagementStats",
          period,
          selectedSchool?._id,
          selectedCampus?._id,
        ],
        queryFn: () => fetchEngagementStats(period),
      });
      queryClient.prefetchQuery({
        queryKey: [
          "retentionStats",
          period,
          selectedSchool?._id,
          selectedCampus?._id,
        ],
        queryFn: () => fetchRetentionStats(period),
      });
    });
  }, [queryClient, selectedCampus?._id, selectedSchool?._id]);

  const isLoading = isEngagementLoading || isRetentionLoading || isStatsLoading;

  // Helper to format trend data for StatsCard
  const formatTrend = (
    changeData:
      | { changePercentage?: string; changeDirection?: string }
      | undefined
  ) => {
    if (!changeData) {
      return undefined;
    }
    const direction: "up" | "down" | "neutral" =
      changeData.changeDirection === "neutral" ||
      changeData.changePercentage === "0%" ||
      changeData.changePercentage === "N/A"
        ? "neutral"
        : changeData.changeDirection === "up"
        ? "up"
        : "down";
    const value =
      changeData.changePercentage === "N/A"
        ? "0%"
        : changeData.changePercentage || "0%";
    return {
      value,
      direction,
      text: "from last period",
    };
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Engagement Data
  const userEngagementData = engagementData?.data.userEngagement || [];
  const sessionDurationData = engagementData?.data.sessionDuration || [];
  const totalChatsData = engagementData?.data.totalChats || [];
  const donutData = (engagementData?.data.donutData || []).map((item) => ({
    label: item.label || "",
    value: item.value || 0,
    percentage: item.percentage || "0%",
    color: item.color || "#000",
  }));
  const chartLabels = engagementData?.data.labels || [];
  const chartSubLabels = engagementData?.data.subLabels;

  // Retention Data
  const connectionRateData = retentionData?.data.connectionRate || [];
  const inactiveSignupsData = retentionData?.data.inactiveSignups || [];
  const newRegistrationsData = retentionData?.data.newRegistrations || [];
  const avgAppOpensData = retentionData?.data.avgAppOpens || [];
  const retentionLabels = retentionData?.data.labels || [];
  const retentionSubLabels = retentionData?.data.subLabels;

  return (
    <main
      className="engagement-page"
      aria-label="User Engagement Dashboard"
      ref={exportRef}
    >
      {/* Filter Bar */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        exportTargetRef={exportRef}
        exportFileName={`engagement_${timePeriod}`}
        showExport={showExport}
      />

      {/* Stats Cards */}
      <CRow className="stats-container">
        <CCol xs={12} sm={6} md={6} lg={3}>
          <StatsCard
            title="Total Students"
            value={(dashboardStats?.data as any)?.totalStudents?.toString() || dashboardStats?.data.totalUsers?.toString() || "0"}
            icon={
              <AssetIcon
                name="double-users-icon"
                color={theme.colors.iconPurple}
              />
            }
            iconBgColor={theme.colors.iconPurpleBg}
            trend={formatTrend((dashboardStats?.data as any)?.studentsChange || (dashboardStats?.data as any)?.usersChange)}
          />
        </CCol>
        <CCol xs={12} sm={6} md={6} lg={3}>
          <StatsCard
            title="Deactivated Students"
            value={(dashboardStats?.data as any)?.deactivatedStudents?.toString() || "0"}
            icon={
              <AssetIcon
                name="double-users-icon"
                color="#dc3545"
              />
            }
            iconBgColor="#f8d7da"
            trend={formatTrend((dashboardStats?.data as any)?.deactivatedStudentsChange)}
          />
        </CCol>
        <CCol xs={12} sm={6} md={6} lg={3}>
          <StatsCard
            title="Total Active Events"
            value={dashboardStats?.data.totalActiveEvents?.toString() || "0"}
            icon={
              <AssetIcon name="calendar-icon" color={theme.colors.iconOrange} />
            }
            iconBgColor="#ffded1"
            trend={formatTrend((dashboardStats?.data as any)?.eventsChange)}
          />
        </CCol>
        <CCol xs={12} sm={6} md={6} lg={3}>
          <StatsCard
            title="Total Spaces Created"
            value={dashboardStats?.data.totalSpaces?.toString() || "0"}
            icon={<AssetIcon name="space-icon" color={theme.colors.iconBlue} />}
            iconBgColor="#d9e3f7"
            trend={formatTrend((dashboardStats?.data as any)?.spacesChange)}
          />
        </CCol>
        <CCol xs={12} sm={6} md={6} lg={3}>
          <StatsCard
            title="Total Ideas Created"
            value={dashboardStats?.data.totalIdeas?.toString() || "0"}
            icon={<AssetIcon name="ideas-icons" color="#ffb830" />}
            iconBgColor="#fff3d6"
            trend={formatTrend((dashboardStats?.data as any)?.ideasChange)}
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
              onClick={() => setSelectedMetric("user-engagement")}
              active={selectedMetric === "user-engagement"}
            >
              User engagement over time
            </CDropdownItem>
            <CDropdownItem
              onClick={() => setSelectedMetric("new-retention")}
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
                title="Engaged users"
                data={userEngagementData}
                labels={chartLabels}
                subLabels={chartSubLabels}
                color="#00b69b"
                backgroundColor="rgba(0, 182, 155, 0.2)"
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
                titleTooltip="New users who actually connect with someone in their first week"
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
                titleTooltip="Users who signed up but never did anything"
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
