import React, { useState } from "react";
import "./SpacesInsights.css";
import AssetIcon from "../../components-v2/AssetIcon/AssetIcon";
import { ExportButton } from "../../components-v2";

interface SpaceCategory {
  name: string;
  emoji: string;
  spaces: number;
  percentage: number;
}

interface SpaceItem {
  rank: number;
  name: string;
  logo: string;
  members: number;
}

export const SpacesInsights: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<"all" | "week" | "month">(
    "month"
  );

  // Mock data from Figma design - using emojis as placeholders for category icons
  const categories: SpaceCategory[] = [
    { name: "Clubs", emoji: "🎗️", spaces: 19, percentage: 7.1 },
    { name: "Club Sports", emoji: "👕", spaces: 18, percentage: 6.7 },
    { name: "IM Teams", emoji: "🏀", spaces: 16, percentage: 6.0 },
    {
      name: "Fraternities",
      emoji: "Σ",
      spaces: 16,
      percentage: 6.0,
    },
    {
      name: "Academics & Honors",
      emoji: "📜",
      spaces: 16,
      percentage: 6.0,
    },
  ];

  const topSpaces: SpaceItem[] = [
    { rank: 1, name: "Pi Lambda Phi", logo: "", members: 70 },
    { rank: 2, name: "MMC Mountaineers", logo: "", members: 65 },
    { rank: 3, name: "FIU Surfers", logo: "", members: 63 },
    { rank: 4, name: "Future Leaders Council", logo: "", members: 60 },
    { rank: 5, name: "Victory Nets Club", logo: "", members: 59 },
  ];

  return (
    <div className="spaces-insights-page">
      {/* Header with Export Button */}
      <div className="insights-header">
        <ExportButton />
      </div>

      {/* Top 2 Stats Cards */}
      <div className="stats-cards-row">
        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">
              Total Events created historically
            </p>
            <div className="stats-card-icon spaces-icon-bg">
              <AssetIcon name="space-icon" size={35} color="#4A4CD9" />
            </div>
          </div>
          <p className="stats-card-value">750</p>
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
          <p className="stats-card-value">75089</p>
        </div>
      </div>

      {/* Time Period Filter */}
      <div className="filter-section">
        <div className="time-period-filter">
          <p className="filter-label">Time period:</p>
          <div className="time-selector">
            <button
              data-testid="time-all-btn"
              className={`time-option first ${
                timePeriod === "all" ? "active" : ""
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
              className={`time-option last ${
                timePeriod === "month" ? "active" : ""
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
                    <span className="category-emoji">{category.emoji}</span>
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
                    <div className="space-logo-placeholder">
                      <AssetIcon name="space-icon" size={20} color="#526AC9" />
                    </div>
                  </div>
                  <p className="space-name">{space.name}</p>
                </div>
                <p className="space-members">{space.members} Members</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
