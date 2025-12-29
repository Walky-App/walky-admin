import React, { useEffect, useRef, useState } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const { timePeriod, setTimePeriod } = useDashboard();
  const { canExport } = usePermissions();
  const [popularity, setPopularity] = useState<PopularityOption>("most");
  const [interestsModalVisible, setInterestsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    items: any[];
    subtitle?: string;
  }>({
    title: "Interests",
    items: [],
    subtitle: "Interests ranked by popularity",
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
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const periods: Array<"week" | "month" | "all-time"> = [
      "week",
      "month",
      "all-time",
    ];
    const sorts: Array<"most_popular" | "least_popular"> = [
      "most_popular",
      "least_popular",
    ];

    periods.forEach((period) => {
      sorts.forEach((sortBy) => {
        queryClient.prefetchQuery({
          queryKey: [
            "popularFeatures",
            period,
            selectedSchool?._id,
            selectedCampus?._id,
            sortBy === "most_popular" ? "most" : "least",
          ],
          queryFn: () =>
            apiClient.api.adminV2DashboardPopularFeaturesList({
              period,
              schoolId: selectedSchool?._id,
              campusId: selectedCampus?._id,
              sortBy,
            }),
        });
      });
    });
  }, [queryClient, selectedCampus?._id, selectedSchool?._id]);

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
        <div className="pf-title-container">
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
          <h1
            className="pf-page-title"
            style={{ color: theme.colors.bodyColor }}
          >
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
                  subtitle: "Students' interests ranked by popularity",
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
                  subtitle: "Ways to connect ranked by popularity",
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
                  subtitle: "Hot spots ranked by visits",
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
                  subtitle: "Invitation categories ranked by engagement",
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
                  subtitle: "Most engaged students",
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
              datasets={(() => {
                const entries: Array<[string, any[]]> = [];

                if (visitedPlaces?.length) {
                  entries.push(["Hot spots on campus", visitedPlaces]);
                }

                if (commonInterests?.length) {
                  entries.push(["Interests in common", commonInterests]);
                }

                if (popularWaysToConnect?.length) {
                  entries.push(["Ways to connect", popularWaysToConnect]);
                }

                if (topInterests?.length) {
                  entries.push(["Students' interests", topInterests]);
                }

                if (topInvitationCategories?.length) {
                  entries.push([
                    "Invitation categories",
                    topInvitationCategories,
                  ]);
                }

                return Object.fromEntries(entries);
              })()}
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
        subtitle={modalData.subtitle}
        interests={modalData.items.map((item, idx) => ({
          rank: item.rank ?? idx + 1,
          name: item.label || item.name,
          icon: item.icon || "",
        }))}
      />
    </main>
  );
};

export default PopularFeatures;
