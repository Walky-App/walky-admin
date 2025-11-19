import React, { useState } from "react";
import { CRow, CCol } from "@coreui/react";
import {
  AssetIcon,
  FilterBar,
  TimePeriod,
  LastUpdated,
  SeeAllInterestsModal,
} from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import {
  FeatureCard,
  PopularitySelector,
  ViewToggle,
  CommonInterests,
  TopFieldsOfStudy,
} from "../components";
import "./PopularFeatures.css";
type PopularityOption = "least" | "most";
type ViewType = "grid" | "list";

const PopularFeatures: React.FC = () => {
  const { theme } = useTheme();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [popularity, setPopularity] = useState<PopularityOption>("most");
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [interestsModalVisible, setInterestsModalVisible] = useState(false);

  console.log(
    "PopularFeatures - interestsModalVisible:",
    interestsModalVisible
  );

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

  // Mock data for list view
  const commonInterests = [
    {
      rank: 1,
      name: "Ballet",
      students: 19,
      percentage: 7.1,
      barWidth: 88,
      rankColor: "#8f5400",
      rankBgColor: "#fff3d6",
    },
    {
      rank: 2,
      name: "Basketball",
      students: 18,
      percentage: 6.7,
      barWidth: 88,
      rankColor: "#4a4cd9",
      rankBgColor: "#d9e3f7",
    },
    {
      rank: 3,
      name: "Acting",
      students: 16,
      percentage: 6.0,
      barWidth: 88,
      rankColor: "#ba5630",
      rankBgColor: "#ffebe9",
    },
    {
      rank: 4,
      name: "3D modeling",
      students: 14,
      percentage: 5.2,
      barWidth: 81,
      rankColor: "#676d70",
      rankBgColor: "#f4f5f7",
    },
    {
      rank: 4,
      name: "Baking",
      students: 14,
      percentage: 5.2,
      barWidth: 81,
      rankColor: "#676d70",
      rankBgColor: "#f4f5f7",
    },
    {
      rank: 5,
      name: "Billiards",
      students: 13,
      percentage: 4.9,
      barWidth: 69,
      rankColor: "#676d70",
      rankBgColor: "#f4f5f7",
    },
    {
      rank: 6,
      name: "Books",
      students: 10,
      percentage: 3.7,
      barWidth: 55,
      rankColor: "#676d70",
      rankBgColor: "#f4f5f7",
    },
    {
      rank: 7,
      name: "Brewing",
      students: 9,
      percentage: 3.4,
      barWidth: 41,
      rankColor: "#676d70",
      rankBgColor: "#f4f5f7",
    },
  ];

  const topFieldsOfStudy = [
    {
      rank: 1,
      name: "Applied Math & Physics",
      students: 20,
      avgInteractions: 1.7,
      rankColor: "#8f5400",
      rankBgColor: "#fff3d6",
    },
  ];

  return (
    <main
      className="popular-features-page"
      aria-label="Popular Features Dashboard"
    >
      {/* Filter Bar - single row with export button */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        dateRange="October 1 – October 31"
        onExport={handleExport}
      />

      {/* Header Section - title, popularity selector, and view toggle in one row */}
      <div className="popular-features-header">
        <div className="title-container">
          <div className="icon-container" aria-hidden="true">
            <div
              className="icon-circle"
              style={{ backgroundColor: theme.colors.iconPurpleBg }}
            >
              <AssetIcon
                name="popular-emoji-icon"
                color={theme.colors.iconPurple}
                size={30}
              />
            </div>
          </div>
          <h1 className="page-title" style={{ color: theme.colors.bodyColor }}>
            Popular Features
          </h1>
        </div>
        <div className="header-controls">
          <PopularitySelector selected={popularity} onChange={setPopularity} />
          <ViewToggle selected={viewType} onChange={setViewType} />
        </div>
      </div>

      {/* Grid View */}
      {viewType === "grid" && (
        <section aria-label="Feature statistics">
          <CRow className="feature-cards-row">
            <CCol xs={12} md={6} lg={4}>
              <FeatureCard
                title="Top interests"
                icon={
                  <AssetIcon
                    name="top-interests-icon"
                    color={theme.colors.iconPurple}
                    size={30}
                  />
                }
                items={topInterests}
                onSeeAll={() => {
                  console.log("See all Top interests clicked!");
                  setInterestsModalVisible(true);
                }}
              />
            </CCol>
            <CCol xs={12} md={6} lg={4}>
              <FeatureCard
                title="Popular ways to connect"
                icon={
                  <AssetIcon
                    name="double-users-icon"
                    color={theme.colors.iconPurple}
                    size={30}
                  />
                }
                items={popularWaysToConnect}
                onSeeAll={() => {
                  console.log("See all ways clicked!");
                  setInterestsModalVisible(true);
                }}
              />
            </CCol>
            <CCol xs={12} md={6} lg={4}>
              <FeatureCard
                title="Visited places"
                icon={
                  <AssetIcon
                    name="visited-places-icon"
                    color={theme.colors.iconGreen}
                    size={30}
                  />
                }
                items={visitedPlaces}
                onSeeAll={() => {
                  console.log("See all places clicked!");
                  setInterestsModalVisible(true);
                }}
              />
            </CCol>
          </CRow>

          {/* Bottom Row Cards */}
          <CRow className="feature-cards-row bottom-cards-row">
            <CCol xs={12} md={6}>
              <FeatureCard
                title="Top invitation categories"
                icon={
                  <AssetIcon
                    name="map-icon"
                    color={theme.colors.iconPurple}
                    size={30}
                  />
                }
                items={topInvitationCategories}
                onSeeAll={() => {
                  console.log("See all categories clicked!");
                  setInterestsModalVisible(true);
                }}
              />
            </CCol>
            <CCol xs={12} md={6}>
              <FeatureCard
                title="Most Engaged"
                icon={
                  <AssetIcon
                    name="double-users-icon"
                    color={theme.colors.iconPurple}
                    size={30}
                  />
                }
                items={mostEngaged}
                onSeeAll={() => {
                  console.log("See all engaged clicked!");
                  setInterestsModalVisible(true);
                }}
              />
            </CCol>
          </CRow>
        </section>
      )}

      {/* List View */}
      {viewType === "list" && (
        <section aria-label="Feature trends" className="list-view-section">
          <CRow className="list-view-row">
            <CCol xs={12} lg={6}>
              <CommonInterests interests={commonInterests} />
            </CCol>
            <CCol xs={12} lg={6}>
              <TopFieldsOfStudy fields={topFieldsOfStudy} />
            </CCol>
          </CRow>
        </section>
      )}

      {/* Last Updated Footer */}
      <LastUpdated />

      {/* Interests Modal */}
      <SeeAllInterestsModal
        visible={interestsModalVisible}
        onClose={() => {
          console.log("Modal close clicked!");
          setInterestsModalVisible(false);
        }}
        interests={commonInterests.map((interest) => ({
          rank: interest.rank,
          name: interest.name,
          icon: "https://via.placeholder.com/32",
        }))}
      />
    </main>
  );
};

export default PopularFeatures;
