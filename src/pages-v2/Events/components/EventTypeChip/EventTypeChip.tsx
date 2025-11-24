import React from "react";
import "./EventTypeChip.css";

export type EventType = "public" | "private";

interface EventTypeChipProps {
  type: EventType;
}

export const EventTypeChip: React.FC<EventTypeChipProps> = ({ type }) => {
  return (
    <div className={`event-type-chip event-type-${type}`}>
      {type === "public" ? "Public" : "Private"}
    </div>
  );
};
