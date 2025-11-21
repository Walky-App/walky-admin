import React from "react";
import "./StatusBadge.css";

interface StatusBadgeProps {
  status: "active" | "banned" | "deactivated" | "disengaged";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const labels = {
    active: "Active",
    banned: "Banned",
    deactivated: "Deactivated",
    disengaged: "Disengaged",
  };

  return (
    <div className={`status-badge status-badge-${status}`}>
      {labels[status]}
    </div>
  );
};
