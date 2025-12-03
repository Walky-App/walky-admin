import React, { useState, useEffect } from "react";
import "./EventsInsights.css";
import { AssetIcon, ExportButton } from "../../../components-v2";
import API, { apiClient } from "../../../API";

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

import {
  DonutChart,
  DashboardSkeleton
} from "../../Dashboard/components";
import "./EventsInsights.css";

import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";

export const EventsInsights: React.FC = () => {
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
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

  const handleExport = async () => {
    try {
      const response = await API.get('/admin/v2/dashboard/events-insights', {
        params: {
          period: timePeriod === 'all' ? 'all-time' : timePeriod,
          export: 'true',
          schoolId: selectedSchool?._id,
          campusId: selectedCampus?._id
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `events_insights_stats_${timePeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  // Data for donut charts
  const [expandReachData, setExpandReachData] = useState<any[]>([]);
  const [usersVsSpacesData, setUsersVsSpacesData] = useState<any[]>([]);

  const [interests, setInterests] = useState<Interest[]>([]);
  const [privateEvents, setPrivateEvents] = useState<EventItem[]>([]);
  const [publicEvents, setPublicEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiClient.api.adminV2DashboardEventsInsightsList({
          period: timePeriod === 'all' ? 'all-time' : timePeriod,
          schoolId: selectedSchool?._id,
          campusId: selectedCampus?._id
        });
        const data = res.data as any;

        if (data) {
          setStats({
            totalEvents: data.stats?.totalEvents || 0,
            publicEvents: data.stats?.publicEvents || 0,
            privateEvents: data.stats?.privateEvents || 0,
            avgPublicAttendees: data.stats?.avgPublicAttendees || 0,
            avgPrivateAttendees: data.stats?.avgPrivateAttendees || 0,
          });

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
    <main className="events-insights-page">
      {/* Header with Export Button */}
      <div className="insights-header">
        <ExportButton onClick={handleExport} />
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
