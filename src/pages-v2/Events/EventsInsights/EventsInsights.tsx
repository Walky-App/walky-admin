import React, { useState } from "react";
import "./EventsInsights.css";
import { AssetIcon, ExportButton } from "../../../components-v2";
import { DonutChart } from "../../Dashboard/components";
import { useMixpanel } from "../../../hooks/useMixpanel";

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
  const { trackEvent } = useMixpanel();
  const [timePeriod, setTimePeriod] = useState<"all" | "week" | "month">(
    "month"
  );

  // Data for donut charts
  const expandReachData = [
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
  ];

  const usersVsSpacesData = [
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
  ];

  // Mock interests data from Figma
  const interests: Interest[] = [
    { name: "Ballet", students: 19, percentage: 7.1 },
    { name: "Basketball", students: 18, percentage: 6.7 },
    { name: "Acting", students: 16, percentage: 6.0 },
    { name: "Anime", students: 16, percentage: 6.0 },
    { name: "Arcade", students: 16, percentage: 6.0 },
    { name: "Soccer", students: 15, percentage: 5.6 },
    { name: "Music", students: 14, percentage: 5.2 },
    { name: "Photography", students: 13, percentage: 4.9 },
    { name: "Coding", students: 12, percentage: 4.5 },
    { name: "Art", students: 11, percentage: 4.1 },
  ];

  // Mock events data
  const privateEvents: EventItem[] = [
    { rank: 1, name: "4v4 Basketball game", attendees: 4 },
    { rank: 2, name: "Top Golf Tuesdays", attendees: 3 },
    {
      rank: 3,
      name: "FAU Tech Runway startup finals & Pitch Competition",
      attendees: 3,
    },
    { rank: 4, name: "Top Golf Monday", attendees: 2 },
    { rank: 5, name: "Top Golf Sunday", attendees: 1 },
    { rank: 6, name: "Study Group Session", attendees: 5 },
    { rank: 7, name: "Movie Night", attendees: 4 },
    { rank: 8, name: "Board Game Evening", attendees: 3 },
    { rank: 9, name: "Coffee Meetup", attendees: 2 },
    { rank: 10, name: "Yoga Class", attendees: 1 },
  ];

  const publicEvents: EventItem[] = [
    { rank: 1, name: "4v4 Basketball game", attendees: 70 },
    { rank: 2, name: "Top Golf Tuesdays", attendees: 65 },
    {
      rank: 3,
      name: "FAU Tech Runway startup finals & Pitch Competition",
      attendees: 63,
    },
    { rank: 4, name: "Top Golf Monday", attendees: 60 },
    { rank: 5, name: "Top Golf Sunday", attendees: 59 },
    { rank: 6, name: "Campus Concert", attendees: 58 },
    { rank: 7, name: "Tech Workshop", attendees: 55 },
    { rank: 8, name: "Career Fair", attendees: 52 },
    { rank: 9, name: "Food Festival", attendees: 50 },
    { rank: 10, name: "Sports Tournament", attendees: 48 },
  ];

  return (
    <main className="events-insights-page">
      {/* Header with Export Button */}
      <div className="insights-header">
        <ExportButton
          onClick={() => trackEvent("Events Insights - Data Exported")}
        />
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
          <p className="stats-card-value">75089</p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Total public Events historically</p>
            <div className="stats-icon" style={{ backgroundColor: "#D6E9C7" }}>
              <AssetIcon name="public-event-icon" size={30} color="#3B7809" />
            </div>
          </div>
          <p className="stats-card-value">45780</p>
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
          <p className="stats-card-value">29309</p>
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
          <p className="stats-card-value">20</p>
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
          <p className="stats-card-value">3</p>
        </div>
      </div>

      {/* Time Period Filter */}
      <div className="time-period-filter">
        <span className="filter-label">Time period:</span>
        <div className="time-selector">
          <button
            data-testid="time-all-btn"
            className={`time-option ${timePeriod === "all" ? "active" : ""}`}
            onClick={() => {
              setTimePeriod("all");
              trackEvent("Events Insights - Time Period Changed", {
                timePeriod: "all",
              });
            }}
          >
            All time
          </button>
          <button
            data-testid="time-week-btn"
            className={`time-option ${timePeriod === "week" ? "active" : ""}`}
            onClick={() => {
              setTimePeriod("week");
              trackEvent("Events Insights - Time Period Changed", {
                timePeriod: "week",
              });
            }}
          >
            Week
          </button>
          <button
            data-testid="time-month-btn"
            className={`time-option ${timePeriod === "month" ? "active" : ""}`}
            onClick={() => {
              setTimePeriod("month");
              trackEvent("Events Insights - Time Period Changed", {
                timePeriod: "month",
              });
            }}
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
          {interests.map((interest, index) => (
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
          ))}
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
