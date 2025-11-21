import React, { useState } from "react";
import { AssetIcon } from "../../components-v2";
import { EventTable, EventData } from "./components/EventTable";
import { EventCalendar } from "./components/EventCalendar";
import "./EventsManager.css";

// Mock data - replace with API call
const mockEvents: EventData[] = [
  {
    id: "1",
    eventName: "4v4 Basketball Game",
    organizer: {
      name: "Becky",
      avatar:
        "https://www.figma.com/api/mcp/asset/eca2a7a9-bd0c-4f7c-9e7a-4c5d74bbe390",
    },
    studentId: "166g...fjhsgt",
    eventDate: "Oct 7, 2025",
    eventTime: "12:45",
    attendees: 6,
    type: "public",
  },
  {
    id: "2",
    eventName: "Top Golf Tuesdays",
    organizer: {
      name: "Jackie",
      avatar:
        "https://www.figma.com/api/mcp/asset/3f9c570a-5175-4895-9e32-29deddbc337a",
    },
    studentId: "166g...fjhsgt",
    eventDate: "Oct 18, 2025",
    eventTime: "12:45",
    attendees: 0,
    type: "private",
  },
  {
    id: "3",
    eventName: "FAU Tech Runway startup finals & Pitch Competition",
    organizer: {
      name: "Mariana",
      avatar:
        "https://www.figma.com/api/mcp/asset/8ee5925a-f2ee-49d4-aace-97f26c25cf4d",
    },
    studentId: "166g...fjhsgt",
    eventDate: "Oct 18, 2025",
    eventTime: "15:45",
    attendees: 0,
    type: "public",
  },
];

type ViewMode = "list" | "calendar";

export const EventsManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.eventName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredEvents.length / 10);

  return (
    <div className="events-manager-container">
      <div className="events-manager-header">
        <div className="events-manager-title-section">
          <h1 className="events-manager-title">Event management</h1>
          <p className="events-manager-subtitle">
            Manage and create different events for students to attend on campus.
          </p>
        </div>
      </div>

      <div className="events-manager-view-toggle">
        <button
          data-testid="view-list-btn"
          className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          List view
        </button>
        <button
          data-testid="view-calendar-btn"
          className={`view-toggle-btn ${
            viewMode === "calendar" ? "active" : ""
          }`}
          onClick={() => setViewMode("calendar")}
        >
          Calendar view
        </button>
      </div>

      <div className="events-manager-content">
        <div className="events-list-header">
          <h2 className="events-list-title">List of Events</h2>

          <div className="events-filters">
            <div className="search-input-container">
              <AssetIcon name="search-icon" size={24} color="#676D70" />
              <input
                data-testid="search-input"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="type-filter-dropdown">
              <select
                aria-label="Filter events by type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="type-filter-select"
              >
                <option value="all">All types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <AssetIcon name="arrow-down" size={10} color="#5B6168" />
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <>
            <EventTable events={filteredEvents} />

            <div className="events-pagination">
              <p className="pagination-info">
                Showing {filteredEvents.length} of {mockEvents.length} entries
              </p>

              <div className="pagination-controls">
                <button
                  data-testid="pagination-prev-btn"
                  className="pagination-btn"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <div className="pagination-page-number active">
                  <span>{currentPage}</span>
                </div>

                <button
                  data-testid="pagination-next-btn"
                  className="pagination-btn"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <EventCalendar />
        )}
      </div>
    </div>
  );
};
