import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { SearchInput, FilterDropdown } from "../../../components-v2";
import { EventTable } from "../components/EventTable/EventTable";
import "./EventsManager.css";
import { EventCalendar } from "../components/EventCalendar/EventCalendar";

type ViewMode = "list" | "calendar";

export const EventsManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events', currentPage, searchQuery, typeFilter],
    queryFn: () => apiClient.api.adminV2EventsList({ page: currentPage, limit: 10, search: searchQuery, type: typeFilter }),
  });

  const filteredEvents = (eventsData?.data.data || []).map((event: any) => ({
    id: event.id,
    eventName: event.eventName,
    organizer: event.organizer,
    studentId: event.studentId,
    eventDate: event.eventDate,
    eventTime: event.eventTime,
    attendees: event.attendees,
    type: event.type,
    isFlagged: event.isFlagged,
    flagReason: event.flagReason,
  }));

  const totalPages = Math.ceil((eventsData?.data.total || 0) / 10);
  const totalEntries = eventsData?.data.total || 0;

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <main className="events-manager-container">
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
          className={`view-toggle-btn ${viewMode === "calendar" ? "active" : ""
            }`}
          onClick={() => setViewMode("calendar")}
        >
          Calendar view
        </button>
      </div>

      <div className="events-manager-content">
        <div className="events-card">
          {viewMode === "list" && (
            <>
              <h2 className="events-list-title-1">List of Events</h2>

              <div className="events-filters">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search"
                  variant="secondary"
                />

                <FilterDropdown
                  value={typeFilter}
                  onChange={setTypeFilter}
                  options={[
                    { value: "all", label: "All types" },
                    { value: "public", label: "Public" },
                    { value: "private", label: "Private" },
                  ]}
                  ariaLabel="Filter events by type"
                  testId="event-type-filter"
                />
              </div>
            </>
          )}

          {viewMode === "list" ? (
            <>
              <EventTable events={filteredEvents} />

              <div className="events-pagination">
                <p className="pagination-info">
                  Showing {filteredEvents.length} of {totalEntries} entries
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
    </main>
  );
};
