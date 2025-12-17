import React from "react";
import "./EventCalendarDay.css";

export interface DayEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: "public" | "private";
}

interface EventCalendarDayProps {
  date: Date;
  events: DayEvent[];
  onEventClick?: (eventId: string) => void;
}

export const EventCalendarDay: React.FC<EventCalendarDayProps> = ({
  date,
  events,
  onEventClick,
}) => {
  // Normalize time strings like "11:05 PM" or "23:05" into minutes since midnight
  const parseTimeToMinutes = (time: string): number => {
    if (!time) return 0;

    const ampmMatch = time
      .trim()
      .match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
    if (ampmMatch) {
      let hours = Number(ampmMatch[1]);
      const minutes = Number(ampmMatch[2]);
      const suffix = ampmMatch[3].toUpperCase();
      if (hours === 12) hours = 0;
      if (suffix === "PM") hours += 12;
      return hours * 60 + minutes;
    }

    const parts = time.trim().split(":");
    if (parts.length >= 2) {
      const hours = Number(parts[0]);
      const minutes = Number(parts[1]);
      if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
        return hours * 60 + minutes;
      }
    }

    return 0;
  };

  const computeBounds = () => {
    let minStart = Number.POSITIVE_INFINITY;
    let maxEnd = Number.NEGATIVE_INFINITY;

    events.forEach((event) => {
      const start = parseTimeToMinutes(event.startTime);
      let end = parseTimeToMinutes(event.endTime);
      if (end <= start) end += 24 * 60; // handle overnight

      minStart = Math.min(minStart, start);
      maxEnd = Math.max(maxEnd, end);
    });

    if (!Number.isFinite(minStart) || !Number.isFinite(maxEnd)) {
      return { startHour: 8, endHour: 20 };
    }

    const startHour = Math.max(0, Math.min(8, Math.floor(minStart / 60)));
    const endHour = Math.min(23, Math.max(20, Math.ceil(maxEnd / 60)));

    return { startHour, endHour };
  };

  const { startHour, endHour } = computeBounds();
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  const formatHour = (hour: number) => {
    if (hour === 12) return "12:00 PM";
    if (hour > 12) return `${hour - 12}:00 PM`;
    return `${hour}:00 AM`;
  };

  const getEventPosition = (startTime: string) => {
    const startMinutes = parseTimeToMinutes(startTime);
    const offset = startHour * 60; // grid starts at computed start hour
    return (startMinutes - offset) / 60;
  };

  const getEventHeight = (startTime: string, endTime: string) => {
    const startMinutes = parseTimeToMinutes(startTime);
    let endMinutes = parseTimeToMinutes(endTime);
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60; // handle events that roll past midnight
    }
    const duration = endMinutes - startMinutes;
    return duration / 60;
  };

  // Check if two events overlap
  const eventsOverlap = (event1: DayEvent, event2: DayEvent) => {
    const e1Start = parseTimeToMinutes(event1.startTime);
    let e1End = parseTimeToMinutes(event1.endTime);
    const e2Start = parseTimeToMinutes(event2.startTime);
    let e2End = parseTimeToMinutes(event2.endTime);

    if (e1End <= e1Start) e1End += 24 * 60;
    if (e2End <= e2Start) e2End += 24 * 60;

    return e1Start < e2End && e2Start < e1End;
  };

  // Calculate event layout to handle overlaps
  const getEventLayout = () => {
    const sortedEvents = [...events].sort((a, b) => {
      const [aH, aM] = a.startTime.split(":").map(Number);
      const [bH, bM] = b.startTime.split(":").map(Number);
      return aH * 60 + aM - (bH * 60 + bM);
    });

    const columns: DayEvent[][] = [];

    sortedEvents.forEach((event) => {
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const hasOverlap = column.some((e) => eventsOverlap(e, event));
        if (!hasOverlap) {
          column.push(event);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([event]);
      }
    });

    const layout: Array<{
      event: DayEvent;
      column: number;
      totalColumns: number;
    }> = [];

    sortedEvents.forEach((event) => {
      const column = columns.findIndex((col) => col.includes(event));
      let totalColumns = 1;

      // Find max overlapping columns for this event
      columns.forEach((col, idx) => {
        if (col.some((e) => eventsOverlap(e, event))) {
          totalColumns = Math.max(totalColumns, idx + 1);
        }
      });

      layout.push({ event, column, totalColumns: columns.length });
    });

    return layout;
  };

  const eventLayout = getEventLayout();

  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const dayDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="event-calendar-day">
      <div className="day-view-header">
        <div className="day-info">
          <h3 className="day-name">{dayName}</h3>
          <p className="day-date">{dayDate}</p>
        </div>
      </div>

      <div className="day-view-grid">
        <div className="day-time-column">
          {hours.map((hour) => (
            <div key={hour} className="day-time-slot">
              <span className="time-label">{formatHour(hour)}</span>
            </div>
          ))}
        </div>

        <div className="day-events-column">
          {hours.map((hour) => (
            <div key={hour} className="day-hour-row">
              <div className="hour-line"></div>
            </div>
          ))}

          {eventLayout.map(({ event, column, totalColumns }) => (
            <div
              key={event.id}
              className={`day-event-block ${event.type}`}
              style={{
                top: `${getEventPosition(event.startTime) * 80}px`,
                height: `${
                  getEventHeight(event.startTime, event.endTime) * 80
                }px`,
                left: `${(column / totalColumns) * 100}%`,
                width: `${100 / totalColumns}%`,
                cursor: onEventClick ? "pointer" : "default",
              }}
              onClick={() => onEventClick?.(event.id)}
            >
              <div className="event-time">
                {event.startTime} - {event.endTime}
              </div>
              <div className="event-title">{event.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
