import React, { useState, useEffect } from "react";
import "./EventCalendar.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../API";
import { useCampus } from "../../../../contexts/CampusContext";

import {
  AssetIcon,
  ScheduledEventsModal,
  ScheduledEventItem,
  EventDetailsModal,
  EventDetailsData,
  DeleteModal,
  FlagModal,
  UnflagModal,
  CustomToast,
} from "../../../../components-v2";
import { EventCalendarDay } from "../EventCalendarDay/EventCalendarDay";
import { EventCalendarWeek } from "../EventCalendarWeek/EventCalendarWeek";

type CalendarView = "day" | "week" | "month";

export const EventCalendar: React.FC = () => {
  const { selectedCampus } = useCampus();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarView>("month");
  const today = new Date().getDate();
  const [scheduledEventsModalOpen, setScheduledEventsModalOpen] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] =
    useState<EventDetailsData | null>(null);
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventDetailsData | null>(null);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [eventToFlag, setEventToFlag] = useState<EventDetailsData | null>(null);
  const [unflagModalOpen, setUnflagModalOpen] = useState(false);
  const [eventToUnflag, setEventToUnflag] = useState<EventDetailsData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2EventsDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      setToastMessage(`Event deleted successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDeleteModalOpen(false);
      setEventDetailsModalOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
      setToastMessage("Error deleting event");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  });

  const flagMutation = useMutation({
    mutationFn: (data: { id: string; reason: string }) => apiClient.api.adminV2EventsFlagCreate(data.id, { reason: data.reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      setToastMessage(`Event flagged successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setFlagModalOpen(false);
      setEventDetailsModalOpen(false);
    },
    onError: (error) => {
      console.error("Error flagging event:", error);
      setToastMessage("Error flagging event");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  });

  const unflagMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2EventsUnflagCreate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      setToastMessage(`Event unflagged successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setUnflagModalOpen(false);
      setEventDetailsModalOpen(false);
    },
    onError: (error) => {
      console.error("Error unflagging event:", error);
      setToastMessage("Error unflagging event");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  });

  const handleDeleteClick = (event: EventDetailsData) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (_reason: string) => {
    if (eventToDelete) {
      deleteMutation.mutate(eventToDelete.id);
    }
  };

  const handleFlagClick = (event: EventDetailsData) => {
    setEventToFlag(event);
    setFlagModalOpen(true);
  };

  const handleFlagConfirm = (reason: string) => {
    if (eventToFlag) {
      flagMutation.mutate({ id: eventToFlag.id, reason });
    }
  };

  const handleUnflagClick = (event: EventDetailsData) => {
    setEventToUnflag(event);
    setUnflagModalOpen(true);
  };

  const handleUnflagConfirm = () => {
    if (eventToUnflag) {
      unflagMutation.mutate(eventToUnflag.id);
    }
  };

  // Close modals when view mode changes
  useEffect(() => {
    setEventDetailsModalOpen(false);
    setScheduledEventsModalOpen(false);
  }, [viewMode]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const dayHeaders = ["MON", "TUE", "WED", "THE", "FRI", "SAT", "SUN"];

  // Calculate date range for fetching
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOffset = getFirstDayOfMonth(currentDate);

  // Calculate start and end dates for the API call
  // We need to cover the previous month days and next month days shown in the grid
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  startDate.setDate(startDate.getDate() - firstDayOffset);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 35); // 5 weeks * 7 days

  const { data: eventsData } = useQuery({
    queryKey: ['calendarEvents', currentDate.getMonth(), currentDate.getFullYear(), selectedCampus?._id],
    queryFn: () => apiClient.api.adminV2EventsList({
      limit: 1000, // Fetch enough events
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      campusId: selectedCampus?._id
    }),
    enabled: !!selectedCampus?._id
  });

  // Process events into a map by day
  const eventsByDay = new Map<number, ScheduledEventItem[]>();

  (eventsData?.data.data || []).forEach((event: any) => {
    const eventDate = new Date(event.eventDate);
    // Only care if it's in the current month for the main view counters
    // But for the grid we might need to handle prev/next month days correctly if we want to show dots there too
    // For simplicity, let's focus on the current month for now, or map by full date string

    if (eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear()) {
      const day = eventDate.getDate();
      const existing = eventsByDay.get(day) || [];
      existing.push({
        id: event.id,
        eventName: event.eventName,
        date: new Date(event.eventDate).toLocaleDateString(),
        time: event.eventTime,
        location: "Campus", // API doesn't seem to return location in the list, might need details
        eventImage: undefined,
      });
      eventsByDay.set(day, existing);
    }
  });

  const getEventsForDate = (day: number): ScheduledEventItem[] => {
    return eventsByDay.get(day) || [];
  };

  const handleDayClick = (day: number) => {
    const events = getEventsForDate(day);
    if (events.length > 0) {
      setSelectedDate(day);
      setScheduledEventsModalOpen(true);
    }
  };

  const handleEventClick = async (eventId: string) => {
    try {
      const res = await apiClient.api.adminV2EventsDetail(eventId);
      const event = res.data as any;
      if (event) {
        const eventDetails: EventDetailsData = {
          id: event.id || event._id || "",
          eventName: event.eventName || "",
          organizer: {
            name: event.organizer?.name || "Unknown",
            studentId: "",
            avatar: event.organizer?.avatar,
          },
          date: event.eventDate || "",
          time: event.eventTime || "",
          place: "Campus", // Missing in detail?
          type: (event.type as any) || "public",
          description: event.description || "No description",
          attendees: (event.participants || []).map((p: any) => ({
            id: p.user_id,
            name: p.name || 'Unknown',
            avatar: p.avatar_url
          })),
          maxAttendees: event.slots || 0,
          eventImage: event.image_url,
        };
        setSelectedEventDetails(eventDetails);
        setEventDetailsModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch event details", error);
    }
  };

  const handleMonthEventClick = (eventId: string) => {
    handleEventClick(eventId);
    setScheduledEventsModalOpen(false);
  };

  const getPreviousMonthDays = (date: Date, count: number) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const prevMonthDays = new Date(year, month, 0).getDate();
    return Array.from(
      { length: count },
      (_, i) => prevMonthDays - count + i + 1
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const previousMonthDays = getPreviousMonthDays(currentDate, firstDayOffset);
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const totalCells = 35; // 5 weeks
  const nextMonthDaysCount =
    totalCells - (previousMonthDays.length + currentMonthDays.length);
  const nextMonthDays = Array.from(
    { length: nextMonthDaysCount },
    (_, i) => i + 1
  );

  // Helper to calculate end time (default 1 hour duration)
  const getEndTime = (startTime: string) => {
    if (!startTime) return "12:00";
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHour = (hours + 1) % 24;
    return `${endHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const dayEvents = (eventsData?.data.data || [])
    .filter((event: any) => {
      const eventDate = new Date(event.eventDate);
      return (
        eventDate.getDate() === currentDate.getDate() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    })
    .map((event: any) => ({
      id: event.id,
      title: event.eventName,
      startTime: event.eventTime || "10:00",
      endTime: getEndTime(event.eventTime || "10:00"),
      type: (event.type as "public" | "private") || "public",
    }));

  const weekEvents = (eventsData?.data.data || [])
    .filter((event: any) => {
      // Filter logic for week view is handled by the component itself based on 'day' index,
      // but we should pass events that fall within the current week range if possible.
      // For simplicity, passing all events and letting the component filter by day index (0-6)
      // might be risky if we have events from other weeks with same day index.
      // Ideally, we should check if the event date is within the current week.

      const eventDate = new Date(event.eventDate);
      const weekStart = new Date(currentDate);
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
      const monday = new Date(weekStart.setDate(diff));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      return eventDate >= monday && eventDate <= sunday;
    })
    .map((event: any) => {
      const date = new Date(event.eventDate);
      const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Mon=0, Sun=6
      return {
        id: event.id,
        title: event.eventName,
        day: dayIndex,
        startTime: event.eventTime || "10:00",
        endTime: getEndTime(event.eventTime || "10:00"),
        type: (event.type as "public" | "private") || "public",
      };
    });

  // Render the appropriate view based on viewMode
  if (viewMode === "day") {
    return (
      <div className="event-calendar-container">
        <div className="calendar-header">
          <div className="today-button-container">
            <span className="today-label">Today</span>
            <div className="today-badge">{today}</div>
          </div>

          <div className="month-navigation">
            <button
              data-testid="calendar-prev-month-btn"
              className="nav-arrow"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              <AssetIcon
                name="arrow-down"
                size={14}
                color="#1d1b20"
                style={{ transform: "rotate(90deg)" }}
              />
            </button>
            <h2 className="month-year">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              data-testid="calendar-next-month-btn"
              className="nav-arrow"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              <AssetIcon
                name="arrow-down"
                size={14}
                color="#1d1b20"
                style={{ transform: "rotate(-90deg)" }}
              />
            </button>
          </div>

          <div className="view-toggle">
            <button
              data-testid="view-day-btn"
              className="view-option view-option-active"
              onClick={() => setViewMode("day")}
            >
              Day
            </button>
            <div className="view-divider"></div>
            <button
              data-testid="view-week-btn"
              className="view-option"
              onClick={() => setViewMode("week")}
            >
              Week
            </button>
            <button
              data-testid="view-month-btn"
              className="view-option"
              onClick={() => setViewMode("month")}
            >
              Month
            </button>
          </div>
        </div>
        <EventCalendarDay date={currentDate} events={dayEvents} onEventClick={handleEventClick} />

        {/* Event Details Modal */}
        {selectedEventDetails && (
          <EventDetailsModal
            isOpen={eventDetailsModalOpen}
            onClose={() => setEventDetailsModalOpen(false)}
            eventData={selectedEventDetails}
            onDelete={handleDeleteClick}
            onFlag={handleFlagClick}
            onUnflag={handleUnflagClick}
          />
        )}

        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={eventToDelete?.eventName || ""}
          type="event"
        />

        <FlagModal
          isOpen={flagModalOpen}
          onClose={() => setFlagModalOpen(false)}
          onConfirm={handleFlagConfirm}
          itemName={eventToFlag?.eventName || ""}
          type="event"
        />

        <UnflagModal
          isOpen={unflagModalOpen}
          onClose={() => setUnflagModalOpen(false)}
          onConfirm={handleUnflagConfirm}
          itemName={eventToUnflag?.eventName || ""}
          type="event"
        />

        {showToast && (
          <CustomToast
            message={toastMessage}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    );
  }

  if (viewMode === "week") {
    return (
      <div className="event-calendar-container">
        <div className="calendar-header">
          <div className="today-button-container">
            <span className="today-label">Today</span>
            <div className="today-badge">{today}</div>
          </div>

          <div className="month-navigation">
            <button
              data-testid="calendar-prev-btn"
              className="nav-arrow"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              <AssetIcon
                name="arrow-down"
                size={14}
                color="#1d1b20"
                style={{ transform: "rotate(90deg)" }}
              />
            </button>
            <h2 className="month-year">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              data-testid="calendar-next-btn"
              className="nav-arrow"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              <AssetIcon
                name="arrow-down"
                size={14}
                color="#1d1b20"
                style={{ transform: "rotate(-90deg)" }}
              />
            </button>
          </div>

          <div className="view-toggle">
            <button
              data-testid="view-day-btn"
              className="view-option"
              onClick={() => setViewMode("day")}
            >
              Day
            </button>
            <div className="view-divider"></div>
            <button
              data-testid="view-week-btn"
              className="view-option view-option-active"
              onClick={() => setViewMode("week")}
            >
              Week
            </button>
            <button
              data-testid="view-month-btn"
              className="view-option"
              onClick={() => setViewMode("month")}
            >
              Month
            </button>
          </div>
        </div>
        <EventCalendarWeek date={currentDate} events={weekEvents} onEventClick={handleEventClick} />

        {/* Event Details Modal */}
        {selectedEventDetails && (
          <EventDetailsModal
            isOpen={eventDetailsModalOpen}
            onClose={() => setEventDetailsModalOpen(false)}
            eventData={selectedEventDetails}
            onDelete={handleDeleteClick}
            onFlag={handleFlagClick}
            onUnflag={handleUnflagClick}
          />
        )}

        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={eventToDelete?.eventName || ""}
          type="event"
        />

        <FlagModal
          isOpen={flagModalOpen}
          onClose={() => setFlagModalOpen(false)}
          onConfirm={handleFlagConfirm}
          itemName={eventToFlag?.eventName || ""}
          type="event"
        />

        <UnflagModal
          isOpen={unflagModalOpen}
          onClose={() => setUnflagModalOpen(false)}
          onConfirm={handleUnflagConfirm}
          itemName={eventToUnflag?.eventName || ""}
          type="event"
        />

        {showToast && (
          <CustomToast
            message={toastMessage}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="event-calendar">
      <div className="calendar-header">
        <div className="today-button-container">
          <span className="today-label">Today</span>
          <div className="today-badge">{today}</div>
        </div>

        <div className="month-navigation">
          <button
            data-testid="calendar-prev-btn"
            className="nav-arrow"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <AssetIcon
              name="arrow-down"
              size={14}
              color="#1d1b20"
              style={{ transform: "rotate(90deg)" }}
            />
          </button>
          <h2 className="month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            data-testid="calendar-next-btn"
            className="nav-arrow"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <AssetIcon
              name="arrow-down"
              size={14}
              color="#1d1b20"
              style={{ transform: "rotate(-90deg)" }}
            />
          </button>
        </div>

        <div className="view-toggle">
          <button
            data-testid="view-day-btn"
            className="view-option"
            onClick={() => setViewMode("day")}
          >
            Day
          </button>
          <div className="view-divider"></div>
          <button
            data-testid="view-week-btn"
            className="view-option"
            onClick={() => setViewMode("week")}
          >
            Week
          </button>
          <button
            data-testid="view-month-btn"
            className="view-option view-option-active"
            onClick={() => setViewMode("month")}
          >
            Month
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-day-headers">
          {dayHeaders.map((day, index) => (
            <div key={index} className="day-header">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-days">
          {/* Previous month days */}
          {previousMonthDays.map((day, index) => (
            <div key={`prev-${index}`} className="calendar-day other-month">
              <span className="day-number">{day}</span>
            </div>
          ))}

          {/* Current month days */}
          {currentMonthDays.map((day) => {
            const events = getEventsForDate(day);
            const isToday = day === today && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={day}
                className={`calendar-day ${isToday ? "today" : ""} ${events.length > 0 ? "has-events" : ""
                  }`}
                onClick={() => handleDayClick(day)}
              >
                {isToday ? (
                  <div className="day-number-badge">{day}</div>
                ) : (
                  <span className="day-number">{day}</span>
                )}
                {events.length > 0 && (
                  <div className="event-indicator">
                    <div className="event-bar"></div>
                    <span className="event-count">
                      {events.length} scheduled Events
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Next month days */}
          {nextMonthDays.map((day, index) => (
            <div key={`next-${index}`} className="calendar-day other-month">
              <span className="day-number">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Events Modal */}
      <ScheduledEventsModal
        isOpen={scheduledEventsModalOpen}
        onClose={() => setScheduledEventsModalOpen(false)}
        date={
          selectedDate
            ? `${monthNames[currentDate.getMonth()]} ${selectedDate}`
            : ""
        }
        events={selectedDate ? getEventsForDate(selectedDate) : []}
        onEventClick={handleMonthEventClick}
      />

      {/* Event Details Modal */}
      {selectedEventDetails && (
        <EventDetailsModal
          isOpen={eventDetailsModalOpen}
          onClose={() => {
            setEventDetailsModalOpen(false);
            setScheduledEventsModalOpen(true);
          }}
          eventData={selectedEventDetails}
          onDelete={handleDeleteClick}
          onFlag={handleFlagClick}
          onUnflag={handleUnflagClick}
        />
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={eventToDelete?.eventName || ""}
        type="event"
      />

      <FlagModal
        isOpen={flagModalOpen}
        onClose={() => setFlagModalOpen(false)}
        onConfirm={handleFlagConfirm}
        itemName={eventToFlag?.eventName || ""}
        type="event"
      />

      <UnflagModal
        isOpen={unflagModalOpen}
        onClose={() => setUnflagModalOpen(false)}
        onConfirm={handleUnflagConfirm}
        itemName={eventToUnflag?.eventName || ""}
        type="event"
      />

      {showToast && (
        <CustomToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
