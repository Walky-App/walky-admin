import React, { useState, useRef } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import "./EventsInsights.css";
import {
  AssetIcon,
  EventDetailsModal,
  EventDetailsData,
  NoData,
} from "../../../components-v2";
import { LastUpdated } from "../../../components-v2";
import { FilterBar } from "../../../components-v2/FilterBar";
import { TimePeriod } from "../../../components-v2/FilterBar/FilterBar.types";
import { apiClient } from "../../../API";
import { usePermissions } from "../../../hooks/usePermissions";

interface Interest {
  name: string;
  icon?: string;
  students: number;
  percentage: number;
}

interface EventItem {
  rank: number;
  id: string;
  name: string;
  attendees: number;
  image?: string;
}

import { DonutChart, DashboardSkeleton } from "../../Dashboard/components";
import "./EventsInsights.css";

import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";

type ChangeData = {
  changePercentage?: string;
  changeDirection?: "up" | "down" | "neutral";
};

type InsightsData = {
  stats?: {
    totalEvents?: number;
    totalEventsChange?: ChangeData;
    publicEvents?: number;
    publicEventsChange?: ChangeData;
    privateEvents?: number;
    privateEventsChange?: ChangeData;
    avgPublicAttendees?: number;
    avgPublicAttendeesChange?: ChangeData;
    avgPrivateAttendees?: number;
    avgPrivateAttendeesChange?: ChangeData;
  };
  lastUpdated?: string;
  updatedAt?: string;
  metadata?: { lastUpdated?: string };
  expandReachData?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  usersVsSpacesData?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  interests?: Interest[];
  publicEventsList?: EventItem[];
  privateEventsList?: EventItem[];
};

export const EventsInsights: React.FC = () => {
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const { canExport } = usePermissions();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const exportRef = useRef<HTMLElement | null>(null);

  // Check permissions for this page
  const showExport = canExport("events_insights");

  const apiPeriod = timePeriod === "all-time" ? "all-time" : timePeriod;

  // Fetch current period data
  const { data: insightsResponse, isLoading: loading } = useQuery({
    queryKey: [
      "eventsInsights",
      timePeriod,
      selectedSchool?._id,
      selectedCampus?._id,
    ],
    queryFn: () =>
      apiClient.api.adminV2DashboardEventsInsightsList({
        period: apiPeriod as "week" | "month" | "all-time",
        schoolId: selectedSchool?._id,
        campusId: selectedCampus?._id,
      }),
    placeholderData: keepPreviousData,
  });

  const insightsData = insightsResponse?.data as InsightsData | undefined;

  // Extract stats
  const stats = {
    totalEvents: insightsData?.stats?.totalEvents || 0,
    totalEventsChange: insightsData?.stats?.totalEventsChange,
    publicEvents: insightsData?.stats?.publicEvents || 0,
    publicEventsChange: insightsData?.stats?.publicEventsChange,
    privateEvents: insightsData?.stats?.privateEvents || 0,
    privateEventsChange: insightsData?.stats?.privateEventsChange,
    avgPublicAttendees: insightsData?.stats?.avgPublicAttendees || 0,
    avgPublicAttendeesChange: insightsData?.stats?.avgPublicAttendeesChange,
    avgPrivateAttendees: insightsData?.stats?.avgPrivateAttendees || 0,
    avgPrivateAttendeesChange: insightsData?.stats?.avgPrivateAttendeesChange,
  };

  // Extract other data and transform for DonutChart
  const rawExpandReachData = insightsData?.expandReachData || [];
  const rawUsersVsSpacesData = insightsData?.usersVsSpacesData || [];
  
  // Transform data to match DonutChartData type (needs label, value, percentage, color)
  const transformDonutData = (data: Array<{ name: string; value: number; color: string }>) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return data.map(item => ({
      label: item.name,
      value: item.value,
      percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
      color: item.color,
    }));
  };
  
  const expandReachData = transformDonutData(rawExpandReachData);
  const usersVsSpacesData = transformDonutData(rawUsersVsSpacesData);
  const interests = insightsData?.interests || [];
  const privateEvents = insightsData?.privateEventsList || [];
  const publicEvents = insightsData?.publicEventsList || [];
  const lastUpdated =
    insightsData?.lastUpdated ||
    insightsData?.updatedAt ||
    insightsData?.metadata?.lastUpdated;

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

  // Helper to format trend data from API (like Engagement page)
  const formatTrend = (changeData: ChangeData | undefined) => {
    if (!changeData) {
      return {
        value: "0%",
        direction: "neutral" as const,
        text: getTrendText(),
      };
    }
    const direction: "up" | "down" | "neutral" =
      changeData.changeDirection === "neutral" ||
      changeData.changePercentage === "0%" ||
      changeData.changePercentage === "N/A"
        ? "neutral"
        : changeData.changeDirection === "up"
        ? "up"
        : "down";
    const value =
      changeData.changePercentage === "N/A"
        ? "0%"
        : changeData.changePercentage || "0%";
    return {
      value,
      direction,
      text: getTrendText(),
    };
  };

  // Modal state
  const [selectedEvent, setSelectedEvent] = useState<EventDetailsData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("Selected School:", interests);

  const handleEventClick = async (eventId: string) => {
    try {
      const res = await apiClient.api.adminV2EventsDetail(eventId);
      type EventDetails = {
        id?: string;
        _id?: string;
        name?: string;
        image_url?: string;
        date_and_time?: string;
        location?: string;
        address?: string;
        visibility?: string;
        description?: string;
        slots?: number;
        spaceId?: string;
        organizer?: {
          name?: string;
          id?: string;
          _id?: string;
          avatar?: string;
          avatar_url?: string;
        };
        participants?: Array<{
          user_id?: string;
          _id?: string;
          name?: string;
          avatar_url?: string;
          status?: string;
        }>;
        isFlagged?: boolean;
        flagReason?: string;
        space?: {
          id?: string;
          name?: string;
          logo?: string;
          coverImage?: string;
          description?: string;
        } | null;
      };
      const event = res.data as EventDetails;

      // Transform API data to EventDetailsData
      const hasDateTime = Boolean(event.date_and_time);
      const dateObj = hasDateTime ? new Date(event.date_and_time!) : null;
      const eventDetails: EventDetailsData = {
        id: event.id || event._id || "",
        eventName: event.name || "",
        eventImage: event.image_url,
        organizer: {
          name: event.organizer?.name || "Unknown",
          studentId:
            event.organizer?.id ||
            event.organizer?._id ||
            event.spaceId ||
            "N/A",
          avatar: event.organizer?.avatar || event.organizer?.avatar_url,
        },
        date: dateObj ? dateObj.toLocaleDateString() : "",
        time: dateObj
          ? dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        place: event.location || event.address || "Campus",
        status: dateObj && dateObj < new Date() ? "finished" : "upcoming",
        type: (event.visibility as "public" | "private") || "public",
        description: event.description || "",
        attendees: (event.participants || []).map((p) => ({
          id: p.user_id || p._id || "",
          name: p.name || "Unknown",
          avatar: p.avatar_url,
          status: p.status as "pending" | "confirmed" | "declined" | undefined,
        })),
        maxAttendees: event.slots || 0,
        isFlagged: event.isFlagged || false,
        flagReason: event.flagReason || "",
        space: event.space
          ? {
              id: event.space.id || "",
              name: event.space.name || "",
              logo: event.space.logo,
              coverImage: event.space.coverImage,
              description: event.space.description,
            }
          : null,
      };

      setSelectedEvent(eventDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch event details:", error);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <main className="events-insights-page" ref={exportRef}>
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        exportTargetRef={exportRef}
        exportFileName={`events_insights_${timePeriod}`}
        showExport={showExport}
      />

      {/* Top 3 Stats Cards */}
      <div className="stats-cards-row">
        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Total Events created</p>
            <div className="stats-icon" style={{ backgroundColor: "#FFDED1" }}>
              <AssetIcon name="calendar-icon" size={27} color="#FF6B35" />
            </div>
          </div>
          <p className="stats-card-value">
            {loading ? "..." : stats.totalEvents.toLocaleString()}
          </p>
          <div
            className="stats-card-trend"
            style={
              timePeriod === "all-time" ? { visibility: "hidden" } : undefined
            }
          >
            {formatTrend(stats.totalEventsChange).direction === "neutral" ? (
              <span className="trend-dash">—</span>
            ) : (
              <AssetIcon
                name={
                  formatTrend(stats.totalEventsChange).direction === "up"
                    ? "trend-up-icon"
                    : "trend-down-icon"
                }
                size={20}
                color={
                  formatTrend(stats.totalEventsChange).direction === "up"
                    ? "#00C943"
                    : "#D53425"
                }
              />
            )}
            <span
              className="trend-value"
              style={{
                color:
                  formatTrend(stats.totalEventsChange).direction === "neutral"
                    ? "#8280FF"
                    : formatTrend(stats.totalEventsChange).direction === "up"
                    ? "#00C943"
                    : "#D53425",
              }}
            >
              {formatTrend(stats.totalEventsChange).value}
            </span>
            <span className="trend-label">{getTrendText()}</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Total public Events </p>
            <div className="stats-icon" style={{ backgroundColor: "#D6E9C7" }}>
              <AssetIcon name="public-event-icon" size={30} color="#3B7809" />
            </div>
          </div>
          <p className="stats-card-value">
            {loading ? "..." : stats.publicEvents.toLocaleString()}
          </p>
          <div
            className="stats-card-trend"
            style={
              timePeriod === "all-time" ? { visibility: "hidden" } : undefined
            }
          >
            {formatTrend(stats.publicEventsChange).direction === "neutral" ? (
              <span className="trend-dash">—</span>
            ) : (
              <AssetIcon
                name={
                  formatTrend(stats.publicEventsChange).direction === "up"
                    ? "trend-up-icon"
                    : "trend-down-icon"
                }
                size={20}
                color={
                  formatTrend(stats.publicEventsChange).direction === "up"
                    ? "#00C943"
                    : "#D53425"
                }
              />
            )}
            <span
              className="trend-value"
              style={{
                color:
                  formatTrend(stats.publicEventsChange).direction === "neutral"
                    ? "#8280FF"
                    : formatTrend(stats.publicEventsChange).direction === "up"
                    ? "#00C943"
                    : "#D53425",
              }}
            >
              {formatTrend(stats.publicEventsChange).value}
            </span>
            <span className="trend-label">{getTrendText()}</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Total private Events</p>
            <div className="stats-icon" style={{ backgroundColor: "#C1D0F5" }}>
              <AssetIcon name="privite-event-icon" size={30} color="#0E3EB8" />
            </div>
          </div>
          <p className="stats-card-value">
            {loading ? "..." : stats.privateEvents.toLocaleString()}
          </p>
          <div
            className="stats-card-trend"
            style={
              timePeriod === "all-time" ? { visibility: "hidden" } : undefined
            }
          >
            {formatTrend(stats.privateEventsChange).direction === "neutral" ? (
              <span className="trend-dash">—</span>
            ) : (
              <AssetIcon
                name={
                  formatTrend(stats.privateEventsChange).direction === "up"
                    ? "trend-up-icon"
                    : "trend-down-icon"
                }
                size={20}
                color={
                  formatTrend(stats.privateEventsChange).direction === "up"
                    ? "#00C943"
                    : "#D53425"
                }
              />
            )}
            <span
              className="trend-value"
              style={{
                color:
                  formatTrend(stats.privateEventsChange).direction === "neutral"
                    ? "#8280FF"
                    : formatTrend(stats.privateEventsChange).direction === "up"
                    ? "#00C943"
                    : "#D53425",
              }}
            >
              {formatTrend(stats.privateEventsChange).value}
            </span>
            <span className="trend-label">{getTrendText()}</span>
          </div>
        </div>
      </div>

      {/* Donut Charts Row */}
      <div className="donut-charts-row">
        <DonutChart
          title="Public Events: with vs without expand Event reach"
          data={expandReachData}
        />
        <DonutChart
          title="Events organized by Users vs Spaces"
          data={usersVsSpacesData}
        />
      </div>

      {/* Average Attendees Cards */}
      <div className="stats-cards-row">
        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">
              Average attendees for public Events
            </p>
            <div className="stats-icon" style={{ backgroundColor: "#D6E9C7" }}>
              <AssetIcon name="public-event-icon" size={30} color="#3B7809" />
            </div>
          </div>
          <p className="stats-card-value">
            {loading ? "..." : stats.avgPublicAttendees}
          </p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">
              Average attendees for private Events
            </p>
            <div className="stats-icon" style={{ backgroundColor: "#C1D0F5" }}>
              <AssetIcon name="privite-event-icon" size={30} color="#0E3EB8" />
            </div>
          </div>
          <p className="stats-card-value">
            {loading ? "..." : stats.avgPrivateAttendees}
          </p>
        </div>
      </div>

      {/* Most Selected Interests */}
      <div className="interests-section">
        <div className="interests-header">
          <AssetIcon name="top-interests-icon" size={30} color="#526AC9" />
          <h2 className="interests-title">
            Most selected Interests as Event categories
          </h2>
        </div>
        <div className="interests-list">
          {interests.length > 0 ? (
            (() => {
              const maxPercentage = Math.max(
                ...interests.map((i) => i.percentage || 0)
              );
              return interests.map((interest, index) => {
                const barWidth =
                  maxPercentage > 0
                    ? (interest.percentage / maxPercentage) * 100
                    : 0;
                return (
                  <div key={index} className="interest-item">
                    <div className="interest-icon">
                      <div className="icon-background">
                        {interest.icon ? (
                          <img
                            src={interest.icon}
                            alt={interest.name}
                            className="interest-icon-image"
                          />
                        ) : (
                          <div className="icon-placeholder">
                            {interest.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="interest-info">
                      <div className="interest-details">
                        <p className="interest-name">{interest.name}</p>
                        <p className="interest-students">
                          {interest.students} students ({interest.percentage}%)
                        </p>
                      </div>
                      <div className="interest-progress">
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()
          ) : (
            <NoData type="primary" message="No data yet" />
          )}
        </div>
      </div>

      {/* Events Lists */}
      <div className="events-lists-row">
        {/* Private Events */}
        <div className="events-list-section">
          <div className="events-list-header">
            <div className="header-icon" style={{ backgroundColor: "#C1D0F5" }}>
              <AssetIcon name="privite-event-icon" size={20} color="#0E3EB8" />
            </div>
            <h2 className="events-list-title">
              Private Events by number of attendees
            </h2>
          </div>
          <div className="events-list">
            {privateEvents.map((event) => (
              <div
                key={event.rank}
                className="event-list-item clickable"
                onClick={() => handleEventClick(event.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="event-item-left">
                  <span className="event-rank">{event.rank}.</span>
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.name}
                      className="event-image"
                    />
                  ) : (
                    <div className="event-image-placeholder" />
                  )}
                  <p className="event-name">{event.name}</p>
                </div>
                <p className="event-attendees">{event.attendees} Attendees</p>
              </div>
            ))}
          </div>
        </div>

        {/* Public Events */}
        <div className="events-list-section">
          <div className="events-list-header">
            <div className="header-icon" style={{ backgroundColor: "#D6E9C7" }}>
              <AssetIcon name="public-event-icon" size={20} color="#3B7809" />
            </div>
            <h2 className="events-list-title">
              Public Events by number of attendees
            </h2>
          </div>
          <div className="events-list">
            {publicEvents.map((event) => (
              <div
                key={event.rank}
                className="event-list-item clickable"
                onClick={() => handleEventClick(event.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="event-item-left">
                  <span className="event-rank">{event.rank}.</span>
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.name}
                      className="event-image"
                    />
                  ) : (
                    <div className="event-image-placeholder" />
                  )}
                  <p className="event-name">{event.name}</p>
                </div>
                <p className="event-attendees">{event.attendees} Attendees</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <EventDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventData={selectedEvent}
      />
      <LastUpdated className="insights-footer" lastUpdated={lastUpdated} />
    </main>
  );
};
