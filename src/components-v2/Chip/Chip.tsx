import React from "react";
import {
  ChipStyle,
  getAdminRoleChipStyle,
  getEventReasonChipStyle,
  getIdeaReasonChipStyle,
  getReasonChipStyle,
  getSpaceCategoryChipStyle,
  getSpaceReasonChipStyle,
  getStatusChipStyle,
  getUserReasonChipStyle,
} from "../utils/chipStyles";
import "./Chip.css";

type ChipType =
  | "status"
  | "reason"
  | "userReason"
  | "eventReason"
  | "ideaReason"
  | "spaceReason"
  | "spaceCategory"
  | "adminRole";

export interface ChipProps {
  /** Value used to compute chip styling and label */
  value: string;
  /** Predefined type that selects the style palette */
  type: ChipType;
  /** Optional explicit label override */
  label?: string;
  /** Allows disabling the slash line-break formatting when needed */
  allowLineBreaks?: boolean;
  className?: string;
}

const getStyleByType = (type: ChipType, value: string): ChipStyle => {
  switch (type) {
    case "status":
      return getStatusChipStyle(value);
    case "userReason":
      return getUserReasonChipStyle(value);
    case "eventReason":
      return getEventReasonChipStyle(value);
    case "ideaReason":
      return getIdeaReasonChipStyle(value);
    case "spaceReason":
      return getSpaceReasonChipStyle(value);
    case "spaceCategory":
      return getSpaceCategoryChipStyle(value);
    case "adminRole":
      return getAdminRoleChipStyle(value);
    case "reason":
    default:
      return getReasonChipStyle(value);
  }
};

const formatLabel = (text: string, allowLineBreaks: boolean) => {
  if (!allowLineBreaks) return text.replace(/\n/g, " ").trim();

  if (text.includes("\n")) return text;

  const lowerText = text.toLowerCase().trim();

  // Specific handling: break "Made Me Uncomfortable" after "Me"
  if (lowerText.includes("made me uncomfortable")) {
    return "Made Me\nUncomfortable";
  }

  // If no slashes, try to break before the last "or" to keep to two lines
  const lastOrIdx = lowerText.lastIndexOf(" or ");
  if (lastOrIdx > -1 && text.length > 18 && !text.includes("/")) {
    // Special-case the spam label to put "or" on the second line
    if (lowerText.includes("spam, fake profile")) {
      return "Spam, Fake Profile,\nor Misuse";
    }

    const before = text.slice(0, lastOrIdx).trimEnd();
    const after = text.slice(lastOrIdx + 4).trimStart();
    // Keep "or" on the first line and lowercase it
    return `${before} or\n${after}`.trim();
  }

  const parts = text
    .split("/")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length <= 1) return text.trim();

  // If we have 3+ segments, keep the second slash on the next line (e.g., "Explicit / Nudity" then "/ Inappropriate")
  if (parts.length >= 3) {
    const firstLine = `${parts[0]} / ${parts[1]}`;
    const secondLine = `/ ${parts.slice(2).join(" / ")}`;
    return `${firstLine}\n${secondLine}`.trim();
  }

  // Default: single break after the first segment
  const firstLine = parts[0];
  const secondLine = `/ ${parts.slice(1).join(" / ")}`
    .replace("//", "/")
    .trim();

  const base = `${firstLine}\n${secondLine}`.trim();

  // Additional smart break for phrases without slashes (e.g., commas or "or" phrases)
  const lower = base.toLowerCase();
  const orIdx = lower.lastIndexOf(" or ");
  if (orIdx > -1 && base.length > 18) {
    const before = base.slice(0, orIdx).trimEnd();
    const after = base.slice(orIdx + 1).trimStart(); // keep leading letter case
    return `${before}\n${after}`.trim();
  }

  // Specific handling: break "Made Me Uncomfortable" after "Me" if no slash was applied
  if (lower.includes("made me uncomfortable")) {
    return "Made Me\nUncomfortable";
  }

  return base;
};

export const Chip: React.FC<ChipProps> = ({
  value,
  type,
  label,
  allowLineBreaks = true,
  className = "",
}) => {
  const style = getStyleByType(type, value);
  const padding = style.padding || "10px 16px"; // slightly wider horizontal padding for consistency
  const sizeClass =
    style.size === "compact" ? "chip-badge--compact" : "chip-badge--regular";
  const computedLabel = label || style.label || value;
  const displayLabel = formatLabel(computedLabel, allowLineBreaks);

  return (
    <span
      className={`chip-badge ${sizeClass} ${className}`.trim()}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        padding,
      }}
    >
      <span className="chip-badge__label">{displayLabel}</span>
    </span>
  );
};

export default Chip;
export type { ChipType };
