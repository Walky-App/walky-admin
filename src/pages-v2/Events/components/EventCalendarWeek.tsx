import React from "react";
import "./EventCalendarWeek.css";

interface WeekEvent {
  id: string;
  title: string;
  day: number; // 0-6 (Mon-Sun)
  startTime: string;
  endTime: string;
  type: "public" | "private";
}

interface EventCalendarWeekProps {
  date: Date;
}

export const EventCalendarWeek: React.FC<EventCalendarWeekProps> = ({
  date,
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

  // Mock events for the week
  const events: WeekEvent[] = [
    {
      id: "1",
      title: "Basketball",
      day: 0, // Monday
      startTime: "10:00",
      endTime: "12:00",
      type: "public",
    },
    {
      id: "2",
      title: "Study Group",
      day: 1, // Tuesday
      startTime: "14:00",
      endTime: "16:00",
      type: "private",
    },
    {
      id: "3",
      title: "Campus Tour",
      day: 3, // Thursday
      startTime: "16:00",
      endTime: "18:00",
      type: "public",
    },
    {
      id: "4",
      title: "Yoga Class",
      day: 4, // Friday
      startTime: "9:00",
      endTime: "10:30",
      type: "public",
    },
  ];

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
          {weekDays.map((_, dayIndex) => (
            <div key={dayIndex} className="week-day-column">
              {hours.map((hour) => (
                <div key={hour} className="week-hour-cell">
                  <div className="cell-line"></div>
                </div>
              ))}

              {events
                .filter((event) => event.day === dayIndex)
                .map((event) => (
                  <div
                    key={event.id}
                    className={`week-event-block ${event.type}`}
                    style={{
                      top: `${getEventPosition(event.startTime) * 60}px`,
                      height: `${
                        getEventHeight(event.startTime, event.endTime) * 60
                      }px`,
                    }}
                  >
                    <div className="event-time-short">{event.startTime}</div>
                    <div className="event-title-short">{event.title}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
