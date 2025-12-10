import React, { useState } from "react";
import "./SpacesInsights.css";
import { AssetIcon, ExportButton } from "../../../components-v2";

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

import SkeletonLoader from "../../../components/SkeletonLoader";

const SpacesInsightsSkeleton = () => (
  <main className="spaces-insights-page">
    <div className="insights-header">
      <SkeletonLoader width="120px" height="40px" />
    </div>

    <div className="stats-cards-row">
      {[1, 2].map((i) => (
        <div key={i} className="stats-card">
          <div className="stats-card-header" style={{ justifyContent: "space-between" }}>
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
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <SkeletonLoader width="150px" height="16px" />
                  <SkeletonLoader width="100px" height="16px" />
                </div>
                <SkeletonLoader width="100%" height="14px" borderRadius="16px" />
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

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";

export const SpacesInsights: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<"all" | "week" | "month">(
    "month"
  );

  const { data: insightsData, isLoading } = useQuery({
    queryKey: ['spacesInsights', timePeriod],
    queryFn: () => apiClient.api.adminV2SpacesInsightsList({ period: timePeriod }),
  });

  const categories: SpaceCategory[] = (insightsData?.data.popularCategories || []).map((category: any) => ({
    name: category.name,
    emoji: category.emoji,
    imageUrl: category.imageUrl,
    spaces: category.spaces,
    percentage: category.percentage,
  }));

  const topSpaces: SpaceItem[] = (insightsData?.data.topSpaces || []).map((space: any) => ({
    rank: space.rank,
    name: space.name,
    logo: space.logo || "",
    members: space.members,
  }));

  if (isLoading) {
    return <SpacesInsightsSkeleton />;
  }

  return (
    <main className="spaces-insights-page">
      {/* Header with Export Button */}
      <div className="insights-header">
        <ExportButton />
      </div>

      {/* Top 2 Stats Cards */}
      <div className="stats-cards-row">
        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">
              Total Spaces created historically
            </p>
            <div className="stats-card-icon spaces-icon-bg">
              <AssetIcon name="space-icon" size={35} color="#4A4CD9" />
            </div>
          </div>
          <p className="stats-card-value">{insightsData?.data.totalSpaces || 0}</p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">
              Total members joined Spaces historically
            </p>
            <div className="stats-card-icon user-icon-bg">
              <AssetIcon name="double-users-icon" size={24} color="#8280FF" />
            </div>
          </div>
          <p className="stats-card-value">{insightsData?.data.totalMembers || 0}</p>
        </div>
      </div>

      {/* Time Period Filter */}
      <div className="filter-section">
        <div className="time-period-filter">
          <p className="filter-label">Time period:</p>
          <div className="time-selector">
            <button
              data-testid="time-all-btn"
              className={`time-option first ${timePeriod === "all" ? "active" : ""
                }`}
              onClick={() => setTimePeriod("all")}
            >
              All time
            </button>
            <button
              data-testid="time-week-btn"
              className={`time-option ${timePeriod === "week" ? "active" : ""}`}
              onClick={() => setTimePeriod("week")}
            >
              Week
            </button>
            <button
              data-testid="time-month-btn"
              className={`time-option last ${timePeriod === "month" ? "active" : ""
                }`}
              onClick={() => setTimePeriod("month")}
            >
              Month
            </button>
          </div>
        </div>
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
                      style={{ width: `${category.percentage * 12}px` }}
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
                        <AssetIcon name="space-icon" size={20} color="#526AC9" />
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
    </main>
  );
};
