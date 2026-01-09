import React, { useRef, useState } from "react";
import "./SpacesInsights.css";
import {
  AssetIcon,
  LastUpdated,
  SkeletonLoader,
  FilterBar,
} from "../../../components-v2";
import { TimePeriod } from "../../../components-v2/FilterBar/FilterBar.types";
import { StatsCard } from "../../Dashboard/components";
import { useTheme } from "../../../hooks/useTheme";

interface SpaceCategory {
  name: string;
  emoji: string;
  imageUrl?: string;
  spaces: number;
  percentage: number;
}

interface SpaceItem {
  rank: number;
  name: string;
  logo: string;
  members: number;
}

const SpacesInsightsSkeleton = () => (
  <main className="spaces-insights-page">
    <div className="insights-header">
      <SkeletonLoader width="120px" height="40px" />
    </div>

    <div className="stats-cards-row">
      {[1, 2].map((i) => (
        <div key={i} className="stats-card">
          <div
            className="stats-card-header"
            style={{ justifyContent: "space-between" }}
          >
            <SkeletonLoader width="200px" height="20px" />
            <SkeletonLoader width="60px" height="60px" borderRadius="23px" />
          </div>
          <SkeletonLoader width="80px" height="30px" className="mt-2" />
        </div>
      ))}
    </div>

    <div className="filter-section">
      <div className="time-period-filter">
        <SkeletonLoader width="100px" height="20px" />
        <SkeletonLoader width="250px" height="36px" borderRadius="8px" />
      </div>
    </div>

    <div className="insights-content-row">
      <div className="insights-card">
        <div className="insights-card-header">
          <SkeletonLoader width="200px" height="20px" />
        </div>
        <div className="categories-list">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="category-item">
              <SkeletonLoader width="40px" height="40px" borderRadius="50%" />
              <div className="category-info">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <SkeletonLoader width="150px" height="16px" />
                  <SkeletonLoader width="100px" height="16px" />
                </div>
                <SkeletonLoader
                  width="100%"
                  height="14px"
                  borderRadius="16px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="insights-card">
        <div className="insights-card-header">
          <SkeletonLoader width="200px" height="20px" />
        </div>
        <div className="spaces-list">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-item">
              <div className="space-info" style={{ gap: "16px" }}>
                <SkeletonLoader width="20px" height="20px" />
                <SkeletonLoader width="40px" height="40px" borderRadius="50%" />
                <SkeletonLoader width="150px" height="16px" />
              </div>
              <SkeletonLoader width="100px" height="16px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </main>
);

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { usePermissions } from "../../../hooks/usePermissions";
import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";

export const SpacesInsights: React.FC = () => {
  const { canExport } = usePermissions();
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const { theme } = useTheme();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const exportRef = useRef<HTMLElement | null>(null);

  const apiPeriod = timePeriod === "all-time" ? "all" : timePeriod;

  // Check permissions for this page
  const showExport = canExport("spaces_insights");

  // Filtered data for categories/top spaces
  const { data: insightsData, isLoading } = useQuery({
    queryKey: [
      "spacesInsights",
      timePeriod,
      selectedSchool?._id,
      selectedCampus?._id,
    ],
    queryFn: () =>
      apiClient.api.adminV2SpacesInsightsList({
        period: apiPeriod,
        schoolId: selectedSchool?._id,
        campusId: selectedCampus?._id,
      }),
    placeholderData: keepPreviousData,
  });

  // All-time totals for comparison
  const { data: allTimeInsights, isLoading: isAllTimeLoading } = useQuery({
    queryKey: [
      "spacesInsights",
      "all",
      selectedSchool?._id,
      selectedCampus?._id,
    ],
    queryFn: () =>
      apiClient.api.adminV2SpacesInsightsList({
        period: "all",
        schoolId: selectedSchool?._id,
        campusId: selectedCampus?._id,
      }),
  });

  // Helper to get trend text based on time period
  const getTrendText = () => {
    switch (timePeriod) {
      case "week":
        return "from last week";
      case "month":
        return "from last month";
      case "all-time":
        return "all time";
      default:
        return "from last period";
    }
  };

  // Helper to calculate and format trend data
  const calculateTrend = (current: number, allTime: number) => {
    if (timePeriod === "all-time" || allTime === 0) {
      return undefined;
    }

    // Calculate what percentage of all-time this period represents
    const percentage = Math.round((current / allTime) * 100);

    return {
      value: `${percentage}%`,
      direction: "neutral" as const,
      text: getTrendText(),
    };
  };

  // Type assertion for optional metadata fields not in generated types
  type InsightsWithMetadata = {
    lastUpdated?: string;
    updatedAt?: string;
    metadata?: { lastUpdated?: string };
  };
  const insightsDataExtended = insightsData?.data as
    | InsightsWithMetadata
    | undefined;
  const allTimeDataExtended = allTimeInsights?.data as
    | InsightsWithMetadata
    | undefined;
  const lastUpdated =
    insightsDataExtended?.lastUpdated ||
    insightsDataExtended?.updatedAt ||
    insightsDataExtended?.metadata?.lastUpdated ||
    allTimeDataExtended?.lastUpdated ||
    allTimeDataExtended?.updatedAt ||
    allTimeDataExtended?.metadata?.lastUpdated;
  const categories: SpaceCategory[] = (
    insightsData?.data.popularCategories || []
  ).map((category) => ({
    name: category.name || "",
    emoji: category.emoji || "",
    imageUrl: category.imageUrl,
    spaces: category.spaces || 0,
    percentage: category.percentage || 0,
  }));

  const topSpaces: SpaceItem[] = (insightsData?.data.topSpaces || []).map(
    (space) => ({
      rank: space.rank || 0,
      name: space.name || "",
      logo: space.logo || "",
      members: space.members || 0,
    })
  );

  if (isLoading || isAllTimeLoading) {
    return <SpacesInsightsSkeleton />;
  }

  return (
    <main className="spaces-insights-page" ref={exportRef}>
      {/* Filter Bar */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        exportTargetRef={exportRef}
        exportFileName={`spaces_insights_${timePeriod}`}
        showExport={showExport}
      />

      {/* Top 2 Stats Cards */}
      <div className="stats-cards-row">
        <StatsCard
          title="Total Spaces created"
          value={insightsData?.data.totalSpaces?.toString() || "0"}
          icon={
            <AssetIcon
              name="space-icon"
              size={24}
              color={theme.colors.iconBlue}
            />
          }
          iconBgColor="#d9e3f7"
          trend={calculateTrend(
            insightsData?.data.totalSpaces || 0,
            allTimeInsights?.data.totalSpaces || 0
          )}
        />
        <StatsCard
          title="Total members joined Spaces"
          value={insightsData?.data.totalMembers?.toString() || "0"}
          icon={
            <AssetIcon
              name="double-users-icon"
              size={24}
              color={theme.colors.iconPurple}
            />
          }
          iconBgColor={theme.colors.iconPurpleBg}
          trend={calculateTrend(
            insightsData?.data.totalMembers || 0,
            allTimeInsights?.data.totalMembers || 0
          )}
        />
      </div>

      {/* Two Column Layout */}
      <div className="insights-content-row">
        {/* Popular Spaces Categories */}
        <div className="insights-card">
          <div className="insights-card-header">
            <p className="insights-card-title">Popular Spaces categories</p>
          </div>

          <div className="categories-list">
            {categories.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-icon-container">
                  <div className="category-icon-bg">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="space-logo-img"
                      />
                    ) : (
                      <span className="category-emoji">{category.emoji}</span>
                    )}
                  </div>
                </div>
                <div className="category-info">
                  <div className="category-details">
                    <p className="category-name">{category.name}</p>
                    <p className="category-stats">
                      {category.spaces} Spaces ({category.percentage}%)
                    </p>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-background" />
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(
                          Math.max(category.percentage || 0, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spaces by Number of Members */}
        <div className="insights-card">
          <div className="insights-card-header">
            <p className="insights-card-title">Spaces by number of members</p>
          </div>

          <div className="spaces-list">
            {topSpaces.map((space) => (
              <div key={space.rank} className="space-item">
                <div className="space-info">
                  <span className="space-rank">{space.rank}.</span>
                  <div className="space-logo">
                    {space.logo ? (
                      <img
                        src={space.logo}
                        alt={space.name}
                        className="space-logo-img"
                      />
                    ) : (
                      <div className="space-logo-placeholder">
                        <AssetIcon
                          name="space-icon"
                          size={20}
                          color="#526AC9"
                        />
                      </div>
                    )}
                  </div>
                  <p className="space-name">{space.name}</p>
                </div>
                <p className="space-members">{space.members} Members</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LastUpdated className="insights-footer" lastUpdated={lastUpdated} />
    </main>
  );
};
