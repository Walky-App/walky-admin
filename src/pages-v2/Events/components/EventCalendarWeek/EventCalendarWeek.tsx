import React from "react";
import "./EventCalendarWeek.css";

export interface WeekEvent {
  id: string;
  title: string;
  day: number; // 0-6 (Mon-Sun)
  startTime: string;
  endTime: string;
  type: "public" | "private";
}

interface EventCalendarWeekProps {
  date: Date;
  events: WeekEvent[];
  onEventClick?: (eventId: string) => void;
}

export const EventCalendarWeek: React.FC<EventCalendarWeekProps> = ({
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

  // Get the start of the week (Monday)
  const getWeekStart = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.getFullYear(), d.getMonth(), diff);
  };

  const weekStart = getWeekStart(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const dayNames = ["MON", "TUE", "WED", "THE", "FRI", "SAT", "SUN"];

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
  const eventsOverlap = (event1: WeekEvent, event2: WeekEvent) => {
    if (event1.day !== event2.day) return false;

    const e1Start = parseTimeToMinutes(event1.startTime);
    let e1End = parseTimeToMinutes(event1.endTime);
    const e2Start = parseTimeToMinutes(event2.startTime);
    let e2End = parseTimeToMinutes(event2.endTime);

    if (e1End <= e1Start) e1End += 24 * 60;
    if (e2End <= e2Start) e2End += 24 * 60;

    return e1Start < e2End && e2Start < e1End;
  };

  // Calculate event layout for a specific day
  const getEventLayoutForDay = (dayIndex: number) => {
    const dayEvents = events.filter((e) => e.day === dayIndex);
    const sortedEvents = [...dayEvents].sort((a, b) => {
      const [aH, aM] = a.startTime.split(":").map(Number);
      const [bH, bM] = b.startTime.split(":").map(Number);
      return aH * 60 + aM - (bH * 60 + bM);
    });

    const columns: WeekEvent[][] = [];

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
      event: WeekEvent;
      column: number;
      totalColumns: number;
    }> = [];

    sortedEvents.forEach((event) => {
      const column = columns.findIndex((col) => col.includes(event));
      layout.push({ event, column, totalColumns: columns.length });
    });

    return layout;
  };

  const isToday = (d: Date) => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="event-calendar-week">
      <div className="week-view-header">
        <div className="week-time-header"></div>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`week-day-header ${isToday(day) ? "today" : ""}`}
          >
            <div className="day-name-short">{dayNames[index]}</div>
            <div className="day-number">{day.getDate()}</div>
          </div>
        ))}
      </div>

      <div className="week-view-grid">
        <div className="week-time-column">
          {hours.map((hour) => (
            <div key={hour} className="week-time-slot">
              <span className="time-label">{formatHour(hour)}</span>
            </div>
          ))}
        </div>

        <div className="week-days-grid">
          {weekDays.map((_, dayIndex) => {
            const dayLayout = getEventLayoutForDay(dayIndex);
            return (
              <div key={dayIndex} className="week-day-column">
                {hours.map((hour) => (
                  <div key={hour} className="week-hour-cell">
                    <div className="cell-line"></div>
                  </div>
                ))}

                {dayLayout.map(({ event, column, totalColumns }) => (
                  <div
                    key={event.id}
                    className={`week-event-block ${event.type}`}
                    style={{
                      top: `${getEventPosition(event.startTime) * 60}px`,
                      height: `${
                        getEventHeight(event.startTime, event.endTime) * 60
                      }px`,
                      left: `${(column / totalColumns) * 100}%`,
                      width: `${100 / totalColumns}%`,
                      cursor: onEventClick ? "pointer" : "default",
                    }}
                    onClick={() => onEventClick?.(event.id)}
                  >
                    <div className="event-time-short">{event.startTime}</div>
                    <div className="event-title-short">{event.title}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
