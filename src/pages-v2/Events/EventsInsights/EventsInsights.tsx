import React, { useState, useEffect } from "react";
import "./EventsInsights.css";
import { AssetIcon, ExportButton } from "../../../components-v2";
import { DonutChart } from "../../Dashboard/components";
import { apiClient } from "../../../API";

interface Interest {
  name: string;
  students: number;
  percentage: number;
}

interface EventItem {
  rank: number;
  name: string;
  attendees: number;
}

export const EventsInsights: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<"all" | "week" | "month">(
    "month"
  );
  const [loading, setLoading] = useState(true);

  // Stats state
  const [stats, setStats] = useState({
    totalEvents: 0,
    publicEvents: 0,
    privateEvents: 0,
    avgPublicAttendees: 0,
    avgPrivateAttendees: 0,
  });

  // Data for donut charts
  const [expandReachData] = useState([
    {
      label: "Without expand Event reach",
      value: 70.16,
      percentage: "70.16%",
      color: "#D6E9C7",
    },
    {
      label: "With expand Event reach",
      value: 29.84,
      percentage: "29.84%",
      color: "#3B7809",
    },
  ]);

  const [usersVsSpacesData] = useState([
    {
      label: "Events organized by Spaces",
      value: 70.16,
      percentage: "70.16%",
      color: "#546FD9",
    },
    {
      label: "Events organized by Users",
      value: 29.84,
      percentage: "29.84%",
      color: "#CACAEE",
    },
  ]);

  const [interests] = useState<Interest[]>([]);
  const [privateEvents, setPrivateEvents] = useState<EventItem[]>([]);
  const [publicEvents, setPublicEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch event counts
        const [totalRes, publicRes, privateRes] = await Promise.all([
          apiClient.api.adminAnalyticsEventsCountList({ filter: "total" } as any) as any,
          apiClient.api.adminAnalyticsEventsCountList({ filter: "public" } as any) as any,
          apiClient.api.adminAnalyticsEventsCountList({ filter: "private" } as any) as any,
        ]);

        const total = totalRes.data.count || 0;
        const publicCount = publicRes.data.count || 0;
        const privateCount = privateRes.data.count || 0;

        // Fetch top events (simulated by fetching list and sorting for now)
        // Ideally backend should provide a "top events" endpoint
        const eventsRes = await apiClient.api.adminV2EventsList({ limit: 100 } as any) as any;
        const allEvents = eventsRes.data.data || [];

        // Process Public Events
        const publicEvts = allEvents
          .filter((e: any) => e.is_public)
          .sort((a: any, b: any) => (b.attendees_count || 0) - (a.attendees_count || 0))
          .slice(0, 10)
          .map((e: any, index: number) => ({
            rank: index + 1,
            name: e.title,
            attendees: e.attendees_count || 0,
          }));

        // Process Private Events
        const privateEvts = allEvents
          .filter((e: any) => !e.is_public)
          .sort((a: any, b: any) => (b.attendees_count || 0) - (a.attendees_count || 0))
          .slice(0, 10)
          .map((e: any, index: number) => ({
            rank: index + 1,
            name: e.title,
            attendees: e.attendees_count || 0,
          }));

        // Calculate averages
        const totalPublicAttendees = allEvents
          .filter((e: any) => e.is_public)
          .reduce((sum: number, e: any) => sum + (e.attendees_count || 0), 0);

        const totalPrivateAttendees = allEvents
          .filter((e: any) => !e.is_public)
          .reduce((sum: number, e: any) => sum + (e.attendees_count || 0), 0);

        const avgPublic = publicCount > 0 ? Math.round(totalPublicAttendees / publicCount) : 0;
        const avgPrivate = privateCount > 0 ? Math.round(totalPrivateAttendees / privateCount) : 0;

        setStats({
          totalEvents: total,
          publicEvents: publicCount,
          privateEvents: privateCount,
          avgPublicAttendees: avgPublic,
          avgPrivateAttendees: avgPrivate,
        });

        setPublicEvents(publicEvts);
        setPrivateEvents(privateEvts);

        // Fetch Interests (simulated or from another endpoint)
        // For now, we'll keep the mock interests or fetch if available
        // const interestsRes = await apiClient.api.adminAnalyticsInterestsList() as any; 
        // setInterests(...)

      } catch (error) {
        console.error("Failed to fetch events insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod]);

  return (
    <main className="events-insights-page">
      {/* Header with Export Button */}
      <div className="insights-header">
        <ExportButton />
      </div>

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
          <p className="stats-card-value">{loading ? "..." : stats.totalEvents.toLocaleString()}</p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Total public Events historically</p>
            <div className="stats-icon" style={{ backgroundColor: "#D6E9C7" }}>
              <AssetIcon name="public-event-icon" size={30} color="#3B7809" />
            </div>
          </div>
          <p className="stats-card-value">{loading ? "..." : stats.publicEvents.toLocaleString()}</p>
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
          <p className="stats-card-value">{loading ? "..." : stats.privateEvents.toLocaleString()}</p>
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
          <p className="stats-card-value">{loading ? "..." : stats.avgPublicAttendees}</p>
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
          <p className="stats-card-value">{loading ? "..." : stats.avgPrivateAttendees}</p>
        </div>
      </div>

      {/* Time Period Filter */}
      <div className="time-period-filter">
        <span className="filter-label">Time period:</span>
        <div className="time-selector">
          <button
            data-testid="time-all-btn"
            className={`time-option ${timePeriod === "all" ? "active" : ""}`}
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
            className={`time-option ${timePeriod === "month" ? "active" : ""}`}
            onClick={() => setTimePeriod("month")}
          >
            Month
          </button>
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
          {interests.length > 0 ? interests.map((interest, index) => (
            <div key={index} className="interest-item">
              <div className="interest-icon">
                <div className="icon-background">
                  {/* Interest icon would go here */}
                  <div className="icon-placeholder" />
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
                      style={{ width: `${(interest.students / 19) * 19}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-4 text-center text-muted">
              No interest data available
            </div>
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
              <div key={event.rank} className="event-list-item">
                <div className="event-item-left">
                  <span className="event-rank">{event.rank}.</span>
                  <div className="event-image-placeholder" />
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
              <div key={event.rank} className="event-list-item">
                <div className="event-item-left">
                  <span className="event-rank">{event.rank}.</span>
                  <div className="event-image-placeholder" />
                  <p className="event-name">{event.name}</p>
                </div>
                <p className="event-attendees">{event.attendees} Attendees</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
