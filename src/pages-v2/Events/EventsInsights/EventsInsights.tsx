import React, { useState, useEffect, useRef } from "react";
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

export const EventsInsights: React.FC = () => {
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const { canExport } = usePermissions();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();
  const exportRef = useRef<HTMLElement | null>(null);

  // Check permissions for this page
  const showExport = canExport("events_insights");

  // Stats state
  const [stats, setStats] = useState({
    totalEvents: 0,
    publicEvents: 0,
    privateEvents: 0,
    avgPublicAttendees: 0,
    avgPrivateAttendees: 0,
  });

  // Data for donut charts
  const [expandReachData, setExpandReachData] = useState<any[]>([]);
  const [usersVsSpacesData, setUsersVsSpacesData] = useState<any[]>([]);

  const [interests, setInterests] = useState<Interest[]>([]);
  const [privateEvents, setPrivateEvents] = useState<EventItem[]>([]);
  const [publicEvents, setPublicEvents] = useState<EventItem[]>([]);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiClient.api.adminV2DashboardEventsInsightsList({
          period: timePeriod,
          schoolId: selectedSchool?._id,
          campusId: selectedCampus?._id,
        });
        type InsightsData = {
          stats?: {
            totalEvents?: number;
            publicEvents?: number;
            privateEvents?: number;
            avgPublicAttendees?: number;
            avgPrivateAttendees?: number;
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
        const data = res.data as InsightsData;

        console.log("Fetched events insights data:", data);

        if (data) {
          setStats({
            totalEvents: data.stats?.totalEvents || 0,
            publicEvents: data.stats?.publicEvents || 0,
            privateEvents: data.stats?.privateEvents || 0,
            avgPublicAttendees: data.stats?.avgPublicAttendees || 0,
            avgPrivateAttendees: data.stats?.avgPrivateAttendees || 0,
          });
          setLastUpdated(
            data?.lastUpdated || data?.updatedAt || data?.metadata?.lastUpdated
          );

          setExpandReachData(data.expandReachData || []);
          setUsersVsSpacesData(data.usersVsSpacesData || []);
          setInterests(data.interests || []);
          setPublicEvents(data.publicEventsList || []);
          setPrivateEvents(data.privateEventsList || []);
        }
      } catch (error) {
        console.error("Failed to fetch events insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod, selectedSchool, selectedCampus]);

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
            <p className="stats-card-title">
              Total Events created historically
            </p>
            <div className="stats-icon" style={{ backgroundColor: "#FFDED1" }}>
              <AssetIcon name="calendar-icon" size={27} color="#FF6B35" />
            </div>
          </div>
          <p className="stats-card-value">
            {loading ? "..." : stats.totalEvents.toLocaleString()}
          </p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Total public Events historically</p>
            <div className="stats-icon" style={{ backgroundColor: "#D6E9C7" }}>
              <AssetIcon name="public-event-icon" size={30} color="#3B7809" />
            </div>
          </div>
          <p className="stats-card-value">
            {loading ? "..." : stats.publicEvents.toLocaleString()}
          </p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">
              Total private Events historically
            </p>
            <div className="stats-icon" style={{ backgroundColor: "#C1D0F5" }}>
              <AssetIcon name="privite-event-icon" size={30} color="#0E3EB8" />
            </div>
          </div>
          <p className="stats-card-value">
            {loading ? "..." : stats.privateEvents.toLocaleString()}
          </p>
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
              Average attendees for public Events historically
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
              Average attendees for private Events historically
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
