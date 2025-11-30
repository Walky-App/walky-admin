import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
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

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['popularFeatures', timePeriod],
    queryFn: () => apiClient.api.adminV2DashboardPopularFeaturesList({ period: timePeriod }),
  });

  const data = (apiData?.data || {}) as any;

  const topInterests = data.topInterests || [];
  const popularWaysToConnect = data.popularWaysToConnect || [];
  const visitedPlaces = data.visitedPlaces || [];
  const topInvitationCategories = data.topInvitationCategories || [];
  const mostEngaged = data.mostEngaged || [];
  const commonInterests = data.commonInterests || [];
  const topFieldsOfStudy = data.topFieldsOfStudy || [];

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const handleExport = () => {
    console.log("Exporting data...");
  };

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
        interests={commonInterests.map((interest: any) => ({
          rank: interest.rank,
          name: interest.name,
          icon: "https://via.placeholder.com/32",
        }))}
      />
    </main>
  );
};

export default PopularFeatures;
