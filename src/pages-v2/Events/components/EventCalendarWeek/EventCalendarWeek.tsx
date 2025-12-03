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
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8am to 8pm

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
  const eventsOverlap = (event1: WeekEvent, event2: WeekEvent) => {
    if (event1.day !== event2.day) return false;

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
                      height: `${getEventHeight(event.startTime, event.endTime) * 60
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
