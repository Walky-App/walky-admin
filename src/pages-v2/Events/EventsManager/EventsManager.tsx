import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { SearchInput, FilterDropdown } from "../../../components-v2";
import { EventTable } from "../components/EventTable/EventTable";
import { EventTableSkeleton } from "../components/EventTableSkeleton/EventTableSkeleton";
import { NoEventsFound } from "../components/NoEventsFound/NoEventsFound";
import { Pagination } from "../components/Pagination";
import "./EventsManager.css";
import { EventCalendar } from "../components/EventCalendar/EventCalendar";

type ViewMode = "list" | "calendar";

export const EventsManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ["events", currentPage, searchQuery, typeFilter, statusFilter],
    queryFn: () =>
      apiClient.api.adminV2EventsList({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        type: typeFilter,
        status: statusFilter,
      }),
  });

  const filteredEvents = (eventsData?.data.data || [])
    .map((event: any) => ({
      id: event.id,
      eventName: event.eventName,
      organizer: event.organizer,
      studentId: event.studentId,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      attendees: event.attendeesCount,
      status: new Date(event.eventDate) < new Date() ? "finished" : "upcoming",
      type: event.type,
      isFlagged: event.isFlagged,
      flagReason: event.flagReason,
    }))
    .filter((event: any) => {
      if (statusFilter === "all") return true;
      return event.status === statusFilter;
    });

  const totalPages = Math.ceil((eventsData?.data.total || 0) / 10);
  const totalEntries = eventsData?.data.total || 0;

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
          className={`view-toggle-btn ${
            viewMode === "calendar" ? "active" : ""
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
                  value={searchInput}
                  onChange={setSearchInput}
                  placeholder="Search"
                  variant="secondary"
                />

                <div className="events-filter-dropdown">
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

                <div className="events-filter-dropdown">
                  <FilterDropdown
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { value: "all", label: "All status" },
                      { value: "upcoming", label: "Upcoming" },
                      { value: "finished", label: "Finished" },
                    ]}
                    ariaLabel="Filter events by status"
                    testId="event-status-filter"
                  />
                </div>
              </div>
            </>
          )}

          {viewMode === "list" ? (
            <>
              {isLoading ? (
                <EventTableSkeleton />
              ) : filteredEvents.length === 0 ? (
                <NoEventsFound message="No events found" />
              ) : (
                <EventTable events={filteredEvents} />
              )}

              {!isLoading && filteredEvents.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalEntries={totalEntries}
                  entriesPerPage={10}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <EventCalendar />
          )}
        </div>
      </div>
    </main>
  );
};
