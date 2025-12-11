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
  const [eventToDelete, setEventToDelete] = useState<EventDetailsData | null>(
    null
  );
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [eventToFlag, setEventToFlag] = useState<EventDetailsData | null>(null);
  const [unflagModalOpen, setUnflagModalOpen] = useState(false);
  const [eventToUnflag, setEventToUnflag] = useState<EventDetailsData | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2EventsDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
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
    },
  });

  const flagMutation = useMutation({
    mutationFn: (data: { id: string; reason: string }) =>
      apiClient.api.adminV2EventsFlagCreate(data.id, { reason: data.reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
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
    },
  });

  const unflagMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2EventsUnflagCreate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
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
    },
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

  const handleCloseAllModals = () => {
    setEventDetailsModalOpen(false);
    setScheduledEventsModalOpen(false);
    setDeleteModalOpen(false);
    setFlagModalOpen(false);
    setUnflagModalOpen(false);
  };

  // Close modals when view mode changes
  useEffect(() => {
    setEventDetailsModalOpen(false);
    setScheduledEventsModalOpen(false);
  }, [viewMode]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  startDate.setDate(startDate.getDate() - firstDayOffset);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 35); // 5 weeks * 7 days

  const { data: eventsData } = useQuery({
    queryKey: [
      "calendarEvents",
      currentDate.getMonth(),
      currentDate.getFullYear(),
      selectedCampus?._id,
    ],
    queryFn: () =>
      apiClient.api.adminV2EventsList({
        limit: 1000, // Fetch enough events
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        campusId: selectedCampus?._id,
      }),
    enabled: !!selectedCampus?._id,
  });

  const formatTime = (timeStr: string) => timeStr?.trim() || "";

  const parseTimeToMinutes = (timeStr: string) => {
    if (!timeStr) return null;
    const trimmed = timeStr.trim();

    // Match formats like "04:19 AM" or "4:19 pm"
    const ampmMatch = trimmed.match(
      /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i
    );
    if (ampmMatch) {
      let hours = Number(ampmMatch[1]);
      const minutes = Number(ampmMatch[2]);
      const suffix = ampmMatch[3].toUpperCase();
      if (hours === 12) hours = 0;
      if (suffix === "PM") hours += 12;
      return hours * 60 + minutes;
    }

    // Fallback for 24h strings like "16:30" or "16:30:00"
    const parts = trimmed.split(":");
    if (parts.length >= 2 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) {
      const hours = Number(parts[0]);
      const minutes = Number(parts[1]);
      if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
      return hours * 60 + minutes;
    }

    return null;
  };

  const formatMinutesToLabel = (totalMinutes: number) => {
    const minutesNormalized =
      ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
    const hours24 = Math.floor(minutesNormalized / 60);
    const minutes = minutesNormalized % 60;
    const suffix = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return `${hours12.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${suffix}`;
  };

  const formatEventTime = (event: any, eventDate: Date) => {
    if (event.eventTime) {
      return formatTime(event.eventTime);
    }

    return eventDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  };

  // Process events into a map by day
  const eventsByDay = new Map<number, ScheduledEventItem[]>();

  (eventsData?.data.data || []).forEach((event: any) => {
    const eventDateStr = event.date_and_time || event.eventDate;
    const eventDate = new Date(eventDateStr);

    if (
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getFullYear() === currentDate.getFullYear()
    ) {
      const day = eventDate.getDate();
      const existing = eventsByDay.get(day) || [];

      const formattedTime = formatEventTime(event, eventDate);

      existing.push({
        id: event.id || event._id,
        eventName: event.name || event.eventName,
        date: eventDate.toLocaleDateString(),
        time: formattedTime,
        location: event.location || event.address || "Campus",
        eventImage: event.image_url,
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
        const displayDate =
          event.eventDate ||
          new Date(event.date_and_time || event.eventDate).toLocaleDateString();
        const displayTime =
          event.eventTime ||
          new Date(event.date_and_time || event.eventDate).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: "UTC",
            }
          );

        const eventDetails: EventDetailsData = {
          id: event.id || event._id || "",
          eventName: event.name || event.eventName || "",
          organizer: {
            name: event.organizer?.name || "Unknown",
            studentId:
              event.organizer?.id ||
              event.organizer?._id ||
              event.spaceId ||
              "N/A",
            avatar: event.organizer?.avatar || event.organizer?.avatar_url,
          },
          date: displayDate,
          time: displayTime,
          place: event.location || event.address || "Campus",
          status:
            new Date(event.date_and_time || event.eventDate) < new Date()
              ? "finished"
              : "upcoming",
          type: (event.visibility || event.type) as "public" | "private",
          description: event.description || "No description",
          attendees: (event.participants || []).map((p: any) => ({
            id: p.user_id,
            name: p.name || "Unknown",
            avatar: p.avatar_url,
            status: p.status,
          })),
          maxAttendees: event.slots || 0,
          eventImage: event.image_url,
          isFlagged: event.isFlagged || false,
          flagReason: event.flagReason || "",
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

  const handleTodayClick = () => {
    setCurrentDate(new Date());
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

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const getWeekRange = (date: Date) => {
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDate = (d: Date) => {
      const month = monthNames[d.getMonth()].substring(0, 3);
      return `${month} ${d.getDate()}`;
    };

    return `${formatDate(monday)} - ${formatDate(
      sunday
    )}, ${date.getFullYear()}`;
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
    const minutes = parseTimeToMinutes(startTime);
    if (minutes === null) return startTime || "";
    return formatMinutesToLabel(minutes + 60);
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
    .map((event: any) => {
      const startMinutes = parseTimeToMinutes(event.eventTime || "");
      const startLabel =
        startMinutes === null
          ? event.eventTime || "10:00 AM"
          : formatMinutesToLabel(startMinutes);

      return {
        id: event.id,
        title: event.eventName,
        startTime: startLabel,
        endTime: getEndTime(event.eventTime || startLabel),
        type: (event.type as "public" | "private") || "public",
      };
    });

  const weekEvents = (eventsData?.data.data || [])
    .filter((event: any) => {
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

      const startMinutes = parseTimeToMinutes(event.eventTime || "");
      const startLabel =
        startMinutes === null
          ? event.eventTime || "10:00 AM"
          : formatMinutesToLabel(startMinutes);

      return {
        id: event.id,
        title: event.eventName,
        day: dayIndex,
        startTime: startLabel,
        endTime: getEndTime(event.eventTime || startLabel),
        type: (event.type as "public" | "private") || "public",
      };
    });

  // Render the appropriate view based on viewMode
  if (viewMode === "day") {
    return (
      <div className="event-calendar-container">
        <div className="calendar-header">
          <div className="today-section">
            <div className="today-button-container" onClick={handleTodayClick}>
              <span className="today-label">Today</span>
            </div>
            <div className="today-badge">{today}</div>
          </div>

          <div className="month-navigation">
            <button
              data-testid="calendar-prev-day-btn"
              className="nav-arrow"
              onClick={handlePrevDay}
              aria-label="Previous day"
            >
              <AssetIcon
                name="arrow-down"
                size={14}
                color="#1d1b20"
                style={{ transform: "rotate(90deg)" }}
              />
            </button>
            <h2 className="month-year">
              {monthNames[currentDate.getMonth()]} {currentDate.getDate()},{" "}
              {currentDate.getFullYear()}
            </h2>
            <button
              data-testid="calendar-next-day-btn"
              className="nav-arrow"
              onClick={handleNextDay}
              aria-label="Next day"
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
        <EventCalendarDay
          date={currentDate}
          events={dayEvents}
          onEventClick={handleEventClick}
        />

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
          <div className="today-section">
            <div className="today-button-container" onClick={handleTodayClick}>
              <span className="today-label">Today</span>
            </div>
            <div className="today-badge">{today}</div>
          </div>

          <div className="month-navigation">
            <button
              data-testid="calendar-prev-week-btn"
              className="nav-arrow"
              onClick={handlePrevWeek}
              aria-label="Previous week"
            >
              <AssetIcon
                name="arrow-down"
                size={14}
                color="#1d1b20"
                style={{ transform: "rotate(90deg)" }}
              />
            </button>
            <h2 className="month-year">{getWeekRange(currentDate)}</h2>
            <button
              data-testid="calendar-next-week-btn"
              className="nav-arrow"
              onClick={handleNextWeek}
              aria-label="Next week"
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
        <EventCalendarWeek
          date={currentDate}
          events={weekEvents}
          onEventClick={handleEventClick}
        />

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
    <div className="event-calendar-container">
      <div className="calendar-header">
        <div className="today-section">
          <div className="today-button-container" onClick={handleTodayClick}>
            <span className="today-label">Today</span>
          </div>
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
            const now = new Date();
            const isToday =
              day === today &&
              currentDate.getMonth() === now.getMonth() &&
              currentDate.getFullYear() === now.getFullYear();

            const isPast =
              currentDate.getFullYear() < now.getFullYear() ||
              (currentDate.getFullYear() === now.getFullYear() &&
                currentDate.getMonth() < now.getMonth()) ||
              (currentDate.getFullYear() === now.getFullYear() &&
                currentDate.getMonth() === now.getMonth() &&
                day < today);

            return (
              <div
                key={day}
                className={`calendar-day ${isToday ? "today" : ""} ${
                  isPast ? "past-day" : ""
                } ${events.length > 0 ? "has-events" : ""}`}
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
          onCloseAll={handleCloseAllModals}
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
