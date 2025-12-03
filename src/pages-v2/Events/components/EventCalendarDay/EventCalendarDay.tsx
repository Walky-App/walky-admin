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
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8am to 8pm

  const formatHour = (hour: number) => {
    if (hour === 12) return "12:00 PM";
    if (hour > 12) return `${hour - 12}:00 PM`;
    return `${hour}:00 AM`;
  };

  const getEventPosition = (startTime: string) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startHour = 8;
    return ((hours - startHour) * 60 + minutes) / 60;
  };

  const getEventHeight = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const duration =
      endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
    return duration / 60;
  };

  // Check if two events overlap
  const eventsOverlap = (event1: DayEvent, event2: DayEvent) => {
    const [e1StartH, e1StartM] = event1.startTime.split(":").map(Number);
    const [e1EndH, e1EndM] = event1.endTime.split(":").map(Number);
    const [e2StartH, e2StartM] = event2.startTime.split(":").map(Number);
    const [e2EndH, e2EndM] = event2.endTime.split(":").map(Number);

    const e1Start = e1StartH * 60 + e1StartM;
    const e1End = e1EndH * 60 + e1EndM;
    const e2Start = e2StartH * 60 + e2StartM;
    const e2End = e2EndH * 60 + e2EndM;

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
                height: `${getEventHeight(event.startTime, event.endTime) * 80
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
