import React from "react";
import "./EventStatusChip.css";

export type EventStatus = "upcoming" | "finished";

interface EventStatusChipProps {
  status: EventStatus;
}

export const EventStatusChip: React.FC<EventStatusChipProps> = ({ status }) => {
  return (
    <div className={`event-status-chip event-status-${status}`}>
      {status === "upcoming" ? "Upcoming" : "Finished"}
    </div>
  );
};
