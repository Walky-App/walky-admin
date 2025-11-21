import React, { useState } from "react";
import "./EventCalendar.css";
import { EventCalendarDay } from "./EventCalendarDay";
import { EventCalendarWeek } from "./EventCalendarWeek";
import {
  AssetIcon,
  ScheduledEventsModal,
  ScheduledEventItem,
  EventDetailsModal,
  EventDetailsData,
} from "../../../components-v2";

interface CalendarEvent {
  date: number;
  count: number;
}

type CalendarView = "day" | "week" | "month";

export const EventCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 10)); // October 10, 2025
  const [viewMode, setViewMode] = useState<CalendarView>("month");
  const today = 10;
  const [scheduledEventsModalOpen, setScheduledEventsModalOpen] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] =
    useState<EventDetailsData | null>(null);

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

  // Events data from Figma
  const events: CalendarEvent[] = [
    { date: 9, count: 2 },
    { date: 16, count: 4 },
    { date: 25, count: 3 },
    { date: 28, count: 2 },
  ];

  // Mock detailed events data for the modal
  const getEventsForDate = (day: number): ScheduledEventItem[] => {
    if (day === 16) {
      return [
        {
          id: "1",
          eventName: "4v4 Basketball game",
          date: "OCT 16, 2025",
          time: "2:00 PM",
          location: "S. Campus Basketball Courts",
          eventImage: undefined,
        },
        {
          id: "2",
          eventName: "Top Golf Tuesdays",
          date: "OCT 16, 2025",
          time: "5:00 PM",
          location: "Top Golf Miami",
          eventImage: undefined,
        },
        {
          id: "3",
          eventName: "FAU Tech Runway startup finals & Pitch Competition",
          date: "OCT 16, 2025",
          time: "8:00 PM",
          location: "Burns Auditorium",
          eventImage: undefined,
        },
        {
          id: "4",
          eventName: "Yoga in the park",
          date: "OCT 16, 2025",
          time: "8:00 AM",
          location: "Gibbons Park",
          eventImage: undefined,
        },
      ];
    }
    // Return empty array for other dates (can be extended later)
    return [];
  };

  const handleDayClick = (day: number) => {
    const event = getEventForDay(day);
    if (event && event.count > 0) {
      setSelectedDate(day);
      setScheduledEventsModalOpen(true);
    }
  };

  const handleEventClick = (eventId: string) => {
    // Get the event details and open the details modal
    const events = selectedDate ? getEventsForDate(selectedDate) : [];
    const event = events.find((e) => e.id === eventId);

    if (event) {
      const eventDetails: EventDetailsData = {
        id: event.id,
        eventName: event.eventName,
        organizer: {
          name: "Becky",
          studentId: "166g...fjhsgt",
          avatar: undefined,
        },
        date: event.date,
        time: event.time,
        place: event.location,
        type: "public",
        description:
          "A fun event for students. Bring your A-game and let's have some competitive fun!",
        attendees: [
          { id: "1", name: "Becky", avatar: undefined },
          { id: "2", name: "Ben Thompson", avatar: undefined },
          { id: "3", name: "Leo Martinez", avatar: undefined },
          { id: "4", name: "Mariana Silva", avatar: undefined },
          { id: "5", name: "Anni Schmidt", avatar: undefined },
          { id: "6", name: "Justin Park", avatar: undefined },
        ],
        maxAttendees: 8,
        eventImage: undefined,
      };
      setSelectedEventDetails(eventDetails);
      setScheduledEventsModalOpen(false);
      setEventDetailsModalOpen(true);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to 7 for our Monday-start week
    return firstDay === 0 ? 6 : firstDay - 1;
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

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOffset = getFirstDayOfMonth(currentDate);
  const previousMonthDays = getPreviousMonthDays(currentDate, firstDayOffset);

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const totalCells = 35; // 5 weeks
  const nextMonthDaysCount =
    totalCells - (previousMonthDays.length + currentMonthDays.length);
  const nextMonthDays = Array.from(
    { length: nextMonthDaysCount },
    (_, i) => i + 1
  );

  const getEventForDay = (day: number) => {
    return events.find((event) => event.date === day);
  };

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
        <EventCalendarDay date={currentDate} />
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
        <EventCalendarWeek date={currentDate} />
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
            const event = getEventForDay(day);
            const isToday = day === today;

            return (
              <div
                key={day}
                className={`calendar-day ${isToday ? "today" : ""} ${
                  event ? "has-events" : ""
                }`}
                onClick={() => handleDayClick(day)}
              >
                {isToday ? (
                  <div className="day-number-badge">{day}</div>
                ) : (
                  <span className="day-number">{day}</span>
                )}
                {event && (
                  <div className="event-indicator">
                    <div className="event-bar"></div>
                    <span className="event-count">
                      {event.count} scheduled Events
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
        onEventClick={handleEventClick}
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
        />
      )}
    </div>
  );
};
