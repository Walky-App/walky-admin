import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { CRow, CCol } from "@coreui/react";
import {
  AssetIcon,
  FilterBar,
  LastUpdated,
  SeeAllInterestsModal,
} from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import { usePermissions } from "../../../hooks/usePermissions";
import {
  FeatureCard,
  PopularitySelector,
  CommonInterests,
  TopFieldsOfStudy,
  DashboardSkeleton,
} from "../components";
import "./PopularFeatures.css";
type PopularityOption = "least" | "most";

import { useDashboard } from "../../../contexts/DashboardContext";
import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";

const PopularFeatures: React.FC = () => {
  const { theme } = useTheme();
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const { timePeriod, setTimePeriod } = useDashboard();
  const { canExport } = usePermissions();
  const [popularity, setPopularity] = useState<PopularityOption>("most");
  const [interestsModalVisible, setInterestsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<{ title: string; items: any[] }>({
    title: "Interests",
    items: [],
  });
  const exportRef = useRef<HTMLElement | null>(null);

  // Check if user can export popular features data
  const showExport = canExport("popular_features");

  console.log(
    "PopularFeatures - interestsModalVisible:",
    interestsModalVisible
  );

  const { data: apiData, isLoading } = useQuery({
    queryKey: [
      "popularFeatures",
      timePeriod,
      selectedSchool?._id,
      selectedCampus?._id,
      popularity,
    ],
    queryFn: () =>
      apiClient.api.adminV2DashboardPopularFeaturesList({
        period: timePeriod,
        schoolId: selectedSchool?._id,
        campusId: selectedCampus?._id,
        sortBy: popularity === "most" ? "most_popular" : "least_popular",
      }),
  });

  interface FeatureItem {
    rank: number;
    icon: string;
    label: string;
    iconBgColor?: string;
  }
  // Interest type matching CommonInterests component
  interface Interest {
    rank: number;
    name: string;
    students: number;
    percentage: number;
    barWidth: number;
    rankColor: string;
    rankBgColor: string;
  }
  // FieldOfStudy type matching TopFieldsOfStudy component
  interface FieldOfStudy {
    rank: number;
    name: string;
    students: number;
    avgInteractions: number;
    rankColor: string;
    rankBgColor: string;
  }
  type PopularFeaturesData = {
    topInterests?: FeatureItem[];
    popularWaysToConnect?: FeatureItem[];
    visitedPlaces?: FeatureItem[];
    topInvitationCategories?: FeatureItem[];
    mostEngaged?: FeatureItem[];
    commonInterests?: Interest[];
    topFieldsOfStudy?: FieldOfStudy[];
  };
  const data = (apiData?.data || {}) as PopularFeaturesData;

  const topInterests = data.topInterests || [];
  const popularWaysToConnect = data.popularWaysToConnect || [];
  const visitedPlaces = data.visitedPlaces || [];
  const topInvitationCategories = data.topInvitationCategories || [];
  const mostEngaged = data.mostEngaged || [];
  const commonInterests = data.commonInterests || [];
  const topFieldsOfStudy = data.topFieldsOfStudy || [];

  console.log("Visited Places data:", visitedPlaces);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <main
      className="popular-features-page"
      aria-label="Popular Features Dashboard"
      ref={exportRef}
    >
      {/* Filter Bar - single row with export button */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        exportTargetRef={exportRef}
        exportFileName={`popular_features_${timePeriod}`}
        showExport={showExport}
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
        </div>
      </div>

      {/* Unified view: grid on top, list below */}
      <section aria-label="Feature statistics">
        <CRow className="feature-cards-row">
          <CCol xs={12} md={6} lg={4}>
            <FeatureCard
              title="Students' interests"
              icon={
                <AssetIcon
                  name="top-interests-icon"
                  color={theme.colors.iconPurple}
                  size={30}
                />
              }
              items={topInterests}
              onSeeAll={() => {
                console.log("See all Interests clicked!");
                setModalData({
                  title: "Students' interests",
                  items: topInterests,
                });
                setInterestsModalVisible(true);
              }}
            />
          </CCol>
          <CCol xs={12} md={6} lg={4}>
            <FeatureCard
              title="Ways to connect"
              icon={
                <AssetIcon
                  name="ways-to-connect"
                  color={theme.colors.iconPurple}
                  size={30}
                />
              }
              items={popularWaysToConnect}
              onSeeAll={() => {
                console.log("See all ways clicked!");
                setModalData({
                  title: "Ways to connect",
                  items: popularWaysToConnect,
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
                  items: visitedPlaces,
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
              title="Invitation categories"
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
                  title: "Invitation categories",
                  items: topInvitationCategories,
                });
                setInterestsModalVisible(true);
              }}
            />
          </CCol>
          <CCol xs={12} md={6}>
            <FeatureCard
              title="Engaged students"
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
                  title: "Engaged students",
                  items: mostEngaged,
                });
                setInterestsModalVisible(true);
              }}
            />
          </CCol>
        </CRow>
      </section>

      <section aria-label="Feature trends" className="list-view-section">
        <CRow className="list-view-row">
          <CCol xs={12} lg={6}>
            <CommonInterests
              interests={commonInterests}
              datasets={{
                "Common Interests": commonInterests,
                "Popular Space categories": visitedPlaces,
                "Popular Events categories": topInvitationCategories,
                "Ways to connect": popularWaysToConnect,
                "Visited Places": visitedPlaces,
                "Invitation categories": topInvitationCategories,
                Engaged: mostEngaged,
                "Events by number of attendees": topInvitationCategories,
                "Spaces by number of members": mostEngaged,
                "Collaborative Ideas": commonInterests,
              }}
            />
          </CCol>
          <CCol xs={12} lg={6}>
            <TopFieldsOfStudy fields={topFieldsOfStudy} />
          </CCol>
        </CRow>
      </section>

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
        interests={modalData.items.map((item) => ({
          rank: item.rank,
          name: item.label || item.name,
          icon: item.icon || "",
        }))}
      />
    </main>
  );
};

export default PopularFeatures;
