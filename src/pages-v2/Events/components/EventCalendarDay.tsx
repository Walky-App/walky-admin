import React from "react";
import "./EventCalendarDay.css";

interface DayEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: "public" | "private";
}

interface EventCalendarDayProps {
  date: Date;
}

export const EventCalendarDay: React.FC<EventCalendarDayProps> = ({ date }) => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8am to 8pm

  // Mock events for the day
  const events: DayEvent[] = [
    {
      id: "1",
      title: "4v4 Basketball Game",
      startTime: "10:00",
      endTime: "12:00",
      type: "public",
    },
    {
      id: "2",
      title: "Study Group",
      startTime: "14:00",
      endTime: "16:00",
      type: "private",
    },
    {
      id: "3",
      title: "Campus Tour",
      startTime: "16:30",
      endTime: "18:00",
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

          {events.map((event) => (
            <div
              key={event.id}
              className={`day-event-block ${event.type}`}
              style={{
                top: `${getEventPosition(event.startTime) * 80}px`,
                height: `${
                  getEventHeight(event.startTime, event.endTime) * 80
                }px`,
              }}
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
