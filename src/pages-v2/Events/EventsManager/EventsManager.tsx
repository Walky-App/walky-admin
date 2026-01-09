import React, { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import {
  Pagination,
  SearchInput,
  FilterDropdown,
  NoData,
} from "../../../components-v2";
import { useDebounce } from "../../../hooks/useDebounce";
import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";
import { EventTable } from "../components/EventTable/EventTable";
import { EventTableSkeleton } from "../components/EventTableSkeleton/EventTableSkeleton";
import { EventCalendar } from "../components/EventCalendar/EventCalendar";
import "./EventsManager.css";

type ViewMode = "list" | "calendar";
type EventSortField = "eventName" | "eventDate" | "attendeesCount";

export const EventsManager: React.FC = () => {
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<EventSortField>("eventDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: eventsData, isLoading } = useQuery({
    queryKey: [
      "events",
      currentPage,
      debouncedSearchQuery,
      typeFilter,
      statusFilter,
      sortBy,
      sortOrder,
      selectedSchool?._id,
      selectedCampus?._id,
    ],
    queryFn: () =>
      apiClient.api.adminV2EventsList({
        page: currentPage,
        limit: 10,
        search: debouncedSearchQuery,
        type: typeFilter,
        status: statusFilter as
          | "all"
          | "upcoming"
          | "ongoing"
          | "finished"
          | undefined,
        sortBy,
        sortOrder,
        schoolId: selectedSchool?._id,
        campusId: selectedCampus?._id,
      }),
    placeholderData: keepPreviousData,
  });

  const handleSortChange = (field: EventSortField, order: "asc" | "desc") => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const filteredEvents = (eventsData?.data.data || [])
    .map((event) => {
      const rawDateTime = event.start_date || "";

      const formatEventDateTime = (
        primary?: string,
        fallbackDate?: string,
        fallbackTime?: string
      ) => {
        const candidates = [primary, fallbackDate].filter(Boolean) as string[];

        for (const candidate of candidates) {
          const parsed = Date.parse(candidate);
          if (!Number.isNaN(parsed)) {
            const dt = new Date(parsed);
            return {
              date: new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(dt),
              time: new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }).format(dt),
              raw: dt.toISOString(),
            };
          }
        }

        return {
          date: fallbackDate || "-",
          time: fallbackTime || "",
          raw: fallbackDate || primary || "",
        };
      };

      const {
        date: eventDate,
        time: eventTime,
        raw: eventDateRaw,
      } = formatEventDateTime(rawDateTime, event.eventDate, event.eventTime);

      const statusDate = eventDateRaw ? new Date(eventDateRaw) : null;
      const status =
        statusDate && !Number.isNaN(statusDate.getTime())
          ? statusDate < new Date()
            ? "finished"
            : "upcoming"
          : "upcoming";

      return {
        id: event.id || "",
        eventName: event.eventName || "",
        organizer: {
          name: event.organizer?.name || "",
          avatar: event.organizer?.avatar || "",
        },
        studentId: event.studentId || "",
        eventDate,
        eventTime,
        eventDateRaw,
        attendees: event.attendeesCount || 0,
        status: status as "upcoming" | "finished",
        type: (event.type || "public") as "public" | "private",
        isFlagged: event.isFlagged || false,
        flagReason: event.flagReason,
      };
    })
    .filter((event) => {
      if (statusFilter === "all") return true;
      return event.status === statusFilter;
    });

  const totalPages = Math.ceil((eventsData?.data.total || 0) / 10);
  const totalEntries = eventsData?.data.total || 0;
  const isEmpty = !isLoading && filteredEvents.length === 0;

  return (
    <main className="events-manager-container">
      <div className="events-manager-header">
        <div className="events-manager-title-section">
          <h1 className="events-manager-title">Event management</h1>
          <p className="events-manager-subtitle">
            Manage different events for students to attend on campus.
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
              ) : (
                <>
                  <div style={{ opacity: isEmpty ? 0.4 : 1 }}>
                    <EventTable
                      events={filteredEvents}
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSortChange={handleSortChange}
                    />
                  </div>
                  {isEmpty && (
                    <NoData
                      iconName="public-event-icon"
                      iconColor="#526AC9"
                      iconSize={40}
                      message="No events found"
                    />
                  )}
                </>
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
