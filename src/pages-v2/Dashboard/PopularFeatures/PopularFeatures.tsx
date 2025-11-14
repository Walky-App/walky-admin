import React, { useState } from "react";
import { CRow, CCol } from "@coreui/react";
import { AssetIcon } from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import {
  FeatureCard,
  TimeSelector,
  ExportButton,
  PopularitySelector,
  ViewToggle,
} from "../components";
import "./PopularFeatures.css";

type TimePeriod = "all-time" | "week" | "month";
type PopularityOption = "least" | "most";
type ViewType = "grid" | "list";

const PopularFeatures: React.FC = () => {
  const { theme } = useTheme();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [popularity, setPopularity] = useState<PopularityOption>("most");
  const [viewType, setViewType] = useState<ViewType>("grid");

  // Mock data - would come from API
  const topInterests = [
    {
      rank: 1,
      icon: "https://via.placeholder.com/32",
      label: "Food",
      iconBgColor: "#ebf1ff",
    },
    {
      rank: 2,
      icon: "https://via.placeholder.com/32",
      label: "Basketball",
      iconBgColor: "#ebf1ff",
    },
    {
      rank: 3,
      icon: "https://via.placeholder.com/32",
      label: "Gym",
      iconBgColor: "#ebf1ff",
    },
  ];

  const popularWaysToConnect = [
    {
      rank: 1,
      icon: "https://via.placeholder.com/32",
      label: "Walk",
      iconBgColor: "#e4eefe",
    },
    {
      rank: 2,
      icon: "https://via.placeholder.com/32",
      label: "Food",
      iconBgColor: "#e4eefe",
    },
    {
      rank: 3,
      icon: "https://via.placeholder.com/32",
      label: "Surprise",
      iconBgColor: "#e4eefe",
    },
  ];

  const visitedPlaces = [
    {
      rank: 1,
      icon: "https://via.placeholder.com/40x30",
      label: "Burger King",
    },
    {
      rank: 2,
      icon: "https://via.placeholder.com/40x30",
      label: "Dunkin Donuts",
    },
    {
      rank: 3,
      icon: "https://via.placeholder.com/40x30",
      label: "Graham Center",
    },
  ];

  const topInvitationCategories = [
    {
      rank: 1,
      icon: "https://via.placeholder.com/32",
      label: "Food",
      iconBgColor: "#ebf1ff",
    },
    {
      rank: 2,
      icon: "https://via.placeholder.com/32",
      label: "Studying",
      iconBgColor: "#e4eefe",
    },
    {
      rank: 3,
      icon: "https://via.placeholder.com/32",
      label: "Coffee",
      iconBgColor: "#e4eefe",
    },
  ];

  const mostEngaged = [
    {
      rank: 1,
      icon: "https://via.placeholder.com/32",
      label: "Brett Semon",
      iconBgColor: undefined,
    },
    {
      rank: 2,
      icon: "https://via.placeholder.com/32",
      label: "Nataly Reynolds",
      iconBgColor: undefined,
    },
    {
      rank: 3,
      icon: "https://via.placeholder.com/32",
      label: "Ben Mackee",
      iconBgColor: undefined,
    },
  ];

  const handleExport = () => {
    console.log("Exporting data...");
  };

  return (
    <main
      className="popular-features-page"
      style={{ backgroundColor: theme.colors.bodyBg }}
      aria-label="Popular Features Dashboard"
    >
      {/* Header Section */}
      <div className="popular-features-header">
        <div className="title-container">
          <div className="icon-container" aria-hidden="true">
            <div className="icon-circle" style={{ backgroundColor: "#e5e4ff" }}>
              <AssetIcon name="popular-emoji-icon" color="#8280ff" size={30} />
            </div>
          </div>
          <h1 className="page-title" style={{ color: theme.colors.bodyColor }}>
            Popular Features
          </h1>
        </div>
        <ViewToggle selected={viewType} onChange={setViewType} />
      </div>

      {/* Filter Section */}
      <section className="filter-section" aria-label="Data filters">
        <div className="filter-options">
          <p className="filter-label" style={{ color: theme.colors.bodyColor }}>
            Filter by:
          </p>
          <div className="filter-controls">
            <div className="filter-group">
              <span
                className="filter-title"
                style={{ color: theme.colors.bodyColor }}
                id="time-period-label"
              >
                Time period:
              </span>
              <TimeSelector selected={timePeriod} onChange={setTimePeriod} />
            </div>
            <div className="filter-group">
              <span
                className="filter-title"
                style={{ color: theme.colors.bodyColor }}
                id="popularity-label"
              >
                Popularity:
              </span>
              <PopularitySelector
                selected={popularity}
                onChange={setPopularity}
              />
            </div>
          </div>
        </div>
        <ExportButton onClick={handleExport} />
      </section>

      {/* Top Row Cards */}
      <section aria-label="Feature statistics">
        <CRow className="feature-cards-row">
          <CCol xs={12} md={6} lg={4}>
            <FeatureCard
              title="Top interests"
              icon={
                <AssetIcon
                  name="top-interests-icon"
                  color="#8280ff"
                  size={30}
                />
              }
              items={topInterests}
              onSeeAll={() => console.log("See all interests")}
            />
          </CCol>
          <CCol xs={12} md={6} lg={4}>
            <FeatureCard
              title="Popular ways to connect"
              icon={
                <AssetIcon name="double-users-icon" color="#8280ff" size={30} />
              }
              items={popularWaysToConnect}
              onSeeAll={() => console.log("See all ways")}
            />
          </CCol>
          <CCol xs={12} md={6} lg={4}>
            <FeatureCard
              title="Visited places"
              icon={
                <AssetIcon
                  name="visited-places-icon"
                  color="#00c617"
                  size={30}
                />
              }
              items={visitedPlaces}
              onSeeAll={() => console.log("See all places")}
            />
          </CCol>
        </CRow>

        {/* Bottom Row Cards */}
        <CRow className="feature-cards-row">
          <CCol xs={12} md={6} lg={4}>
            <FeatureCard
              title="Top invitation categories"
              icon={<AssetIcon name="tooltip-icon" color="#ff9500" size={30} />}
              items={topInvitationCategories}
              onSeeAll={() => console.log("See all categories")}
            />
          </CCol>
          <CCol xs={12} md={6} lg={4}>
            <FeatureCard
              title="Most Engaged"
              icon={
                <AssetIcon name="double-users-icon" color="#8280ff" size={30} />
              }
              items={mostEngaged}
              onSeeAll={() => console.log("See all engaged")}
            />
          </CCol>
        </CRow>
      </section>

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

export default PopularFeatures;
