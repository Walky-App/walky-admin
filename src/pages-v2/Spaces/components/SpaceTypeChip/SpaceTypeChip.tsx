import React from "react";
import "./SpaceTypeChip.css";

export type SpaceType = string;

interface SpaceTypeChipProps {
  type: SpaceType;
}

export const SpaceTypeChip: React.FC<SpaceTypeChipProps> = ({ type }) => {
  const getLabel = () => {
    if (!type) return "Uncategorized";
    // Capitalize first letter of each word if needed, or just return type
    return type;
  };

  const getClassName = () => {
    if (!type) return "space-type-chip-default";
    // Sanitize type for CSS class: lowercase, collapse non-alphanumerics into single dashes
    const sanitized = type
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return `space-type-chip-${sanitized || "default"}`;
  };

  return (
    <div className={`space-type-chip ${getClassName()}`}>
      <span>{getLabel()}</span>
    </div>
  );
};
