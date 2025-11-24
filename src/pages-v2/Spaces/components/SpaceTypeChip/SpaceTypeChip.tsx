import React from "react";
import "./SpaceTypeChip.css";

export type SpaceType = "clubs" | "fraternities" | "sororities";

interface SpaceTypeChipProps {
  type: SpaceType;
}

export const SpaceTypeChip: React.FC<SpaceTypeChipProps> = ({ type }) => {
  const getLabel = () => {
    switch (type) {
      case "clubs":
        return "Clubs";
      case "fraternities":
        return "Fraternities";
      case "sororities":
        return "Sororities";
      default:
        return "";
    }
  };

  return (
    <div className={`space-type-chip space-type-chip-${type}`}>
      <span>{getLabel()}</span>
    </div>
  );
};
