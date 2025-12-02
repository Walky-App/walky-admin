import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import API from "../../../API";
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
  const [modalData, setModalData] = useState<{ title: string; items: any[] }>({
    title: "Top interests",
    items: []
  });

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

  console.log('Visited Places data:', visitedPlaces);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const handleExport = async () => {
    try {
      const response = await API.get('/admin/v2/dashboard/popular-features', {
        params: { period: timePeriod, export: 'true' },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `popular_features_stats_${timePeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed:", error);
    }
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
                  setModalData({
                    title: "Top interests",
                    items: topInterests
                  });
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
                  setModalData({
                    title: "Popular ways to connect",
                    items: popularWaysToConnect
                  });
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
                maxItems={visitedPlaces.length}
                onSeeAll={() => {
                  console.log("See all places clicked!");
                  setModalData({
                    title: "Visited places",
                    items: visitedPlaces
                  });
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
                  setModalData({
                    title: "Top invitation categories",
                    items: topInvitationCategories
                  });
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
                  setModalData({
                    title: "Most Engaged",
                    items: mostEngaged
                  });
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
        title={modalData.title}
        interests={modalData.items.map((item: any) => ({
          rank: item.rank,
          name: item.label || item.name,
          icon: item.icon || "",
        }))}
      />
    </main>
  );
};

export default PopularFeatures;
