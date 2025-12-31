import { IconName } from "../AssetIcon/AssetIcon.types";

export const getReportTypeIcon = (type?: string): IconName => {
  const normalized = (type || "").toLowerCase();
  if (normalized.includes("user") || normalized.includes("student")) {
    return "double-users-icon";
  }
  if (normalized.includes("idea")) {
    return "ideas-icons";
  }
  if (normalized.includes("space")) {
    return "space-icon";
  }
  if (normalized.includes("message")) {
    return "chat-icon";
  }
  if (normalized.includes("event")) {
    return "public-event-icon";
  }
  return "nd-report-icon";
};
