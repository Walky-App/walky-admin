import React from "react";
import { AssetIcon } from "../../../../components-v2";
import "./NoEventsFound.css";

interface NoEventsFoundProps {
  message?: string;
}

export const NoEventsFound: React.FC<NoEventsFoundProps> = ({
  message = "No active users yet",
}) => {
  return (
    <div className="no-events-found">
      <div className="no-events-icon-circle">
        <AssetIcon name="calendar-icon" size={48} color="#526AC9" />
      </div>
      <p className="no-events-text">{message}</p>
    </div>
  );
};
