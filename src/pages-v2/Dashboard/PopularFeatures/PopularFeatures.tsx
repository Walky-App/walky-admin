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
import { IconName } from "../../../components-v2/AssetIcon/AssetIcon.types";
import { useTheme } from "../../../hooks/useTheme";
import { usePermissions } from "../../../hooks/usePermissions";
import {
  FeatureCard,
  PopularitySelector,
  CommonInterests,
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
    count?: number;
    percentage?: number;
    attendees?: number;
    members?: number;
    visits?: number;
    students?: number;
    score?: number;
  }
  interface Interest {
    rank: number;
    name: string;
    students: number;
    percentage: number;
    barWidth: number;
    rankColor: string;
    rankBgColor: string;
  }
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
    commonInterests?: Interest[];
    topFieldsOfStudy?: FieldOfStudy[];
    spacesByMembers?: FeatureItem[];
    popularSpaceCategories?: FeatureItem[];
    eventsByAttendees?: FeatureItem[];
  };
  const data = (apiData?.data || {}) as PopularFeaturesData;

  const topInterests = data.topInterests || [];
  const popularWaysToConnect = data.popularWaysToConnect || [];
  const visitedPlaces = data.visitedPlaces || [];
  const topInvitationCategories = data.topInvitationCategories || [];
  const commonInterests = data.commonInterests || [];
  const topFieldsOfStudy = data.topFieldsOfStudy || [];
  const spacesByMembers = data.spacesByMembers || [];
  const popularSpaceCategories = data.popularSpaceCategories || [];
  const eventsByAttendees = data.eventsByAttendees || [];

  const formatWaysToConnectLabel = (raw: string): {
    label: string;
    iconName: IconName;
  } => {
    const normalize = (value: string) =>
      (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    const map: Record<string, { label: string; iconName: IconName }> = {
      walk: { label: "Walk", iconName: "walk" },
      walking: { label: "Walk", iconName: "walk" },
      interests: { label: "Interests", iconName: "interests" },
      spokenlanguage: { label: "Spoken Language", iconName: "languages" },
      spokenlanguages: { label: "Spoken Language", iconName: "languages" },
      language: { label: "Spoken Language", iconName: "languages" },
      languages: { label: "Spoken Language", iconName: "languages" },
      relationship: { label: "Relationship", iconName: "heart" },
      inarelationship: { label: "Relationship", iconName: "heart" },
      relationshipstatus: { label: "Relationship", iconName: "heart" },
      classof25: { label: "Class of '25", iconName: "study" },
      classof2025: { label: "Class of '25", iconName: "study" },
      class2025: { label: "Class of '25", iconName: "study" },
      areaofstudy: { label: "Area of Study", iconName: "areaOfStudy" },
      major: { label: "Area of Study", iconName: "areaOfStudy" },
      dogowner: { label: "Dog Owner", iconName: "dog" },
      petowner: { label: "Dog Owner", iconName: "dog" },
      parent: { label: "Parent", iconName: "parent" },
      parents: { label: "Parent", iconName: "parent" },
      peer: { label: "Peers", iconName: "peers" },
      peers: { label: "Peers", iconName: "peers" },
      map: { label: "Peers", iconName: "peers" },
      surprise: { label: "Surprise Me", iconName: "present" },
      surpriseme: { label: "Surprise Me", iconName: "present" },
    };

    const normalized = normalize(raw);
    if (map[normalized]) return map[normalized];

    // Handle free-text "class of XXXX" cases
    const classMatch = /class\s*of\s*(\d{2,4})/i.exec(raw || "");
    if (classMatch) {
      const year = classMatch[1];
      const shortYear = year.length === 2 ? year : year.slice(-2);
      return { label: `Class of '${shortYear}`, iconName: "study" };
    }

    const words = (raw || "")
      .replace(/[_-]+/g, " ")
      .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
      .trim();
    const capitalizeWord = (word: string) =>
      word ? word.charAt(0).toUpperCase() + word.slice(1) : "";
    const humanized = words
      .split(/\s+/)
      .filter(Boolean)
      .map(capitalizeWord)
      .join(" ");

    const wordCount = humanized ? humanized.split(/\s+/).length : 0;
    if (wordCount >= 3) {
      return { label: "Area of Study", iconName: "areaOfStudy" };
    }

    return { label: humanized || "Area of Study", iconName: "explore" };
  };

  const formattedWaysToConnect = popularWaysToConnect.map((item) => {
    const { label, iconName } = formatWaysToConnectLabel(item.label);
    return {
      ...item,
      label,
      iconName,
      iconBgColor: item.iconBgColor,
    };
  });

  const formatValueLabel = (item: any) => {
    const toNumber = (value: any, fallback = 0) => {
      const n = parseFloat(value);
      return Number.isFinite(n) ? n : fallback;
    };
    const value = toNumber(
      item.value ??
        item.count ??
        item.students ??
        item.attendees ??
        item.members ??
        item.visits ??
        item.score,
      0
    );
    return {
      value,
      valueLabel: Number.isFinite(value) ? `${value}` : undefined,
    };
  };

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
          <h1 className="pf-page-title">Popular Features</h1>
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
              maxItems={5}
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
              items={formattedWaysToConnect}
              maxItems={5}
              formatLabel={(raw) => formatWaysToConnectLabel(raw).label}
              onSeeAll={() => {
                console.log("See all ways clicked!");
                setModalData({
                  title: "Ways to connect",
                  items: formattedWaysToConnect,
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
                  color={theme.colors.iconPurple}
                  size={30}
                />
              }
              items={visitedPlaces}
              maxItems={5}
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
      </section>

      <section aria-label="Feature trends" className="list-view-section">
        <CRow className="list-view-row">
          <CCol xs={12} lg={6}>
            <CommonInterests
              interests={commonInterests}
              datasets={{
                "Common interests": commonInterests,
                "Students' interests": topInterests,
                "Ways to connect": formattedWaysToConnect,
                "Visited places": visitedPlaces,
                "Invitation categories": topInvitationCategories,
                "Spaces by number of members": spacesByMembers,
                "Events by number of attendees": eventsByAttendees,
                "Space categories": popularSpaceCategories,
                "Area of study": topFieldsOfStudy,
              }}
            />
          </CCol>
          {/* <CCol xs={12} lg={6}>
            <TopFieldsOfStudy fields={topFieldsOfStudy} />
          </CCol> */}
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
        interests={modalData.items.map((item) => {
          const valueInfo = formatValueLabel(item);
          return {
            rank: item.rank,
            name: item.label || item.name,
            icon: item.icon || "",
            iconName: item.iconName,
            valueLabel: valueInfo.valueLabel,
          };
        })}
      />
    </main>
  );
};

export default PopularFeatures;
