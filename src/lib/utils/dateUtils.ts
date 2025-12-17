import { format } from "date-fns";

/**
 * Formats a date-like value into "MMM d, yyyy" (e.g., "Sep 28, 2025").
 * Falls back gracefully when the input cannot be parsed.
 */
export const formatMemberSince = (value?: string | Date | null): string => {
  if (!value) return "N/A";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "N/A";
  }

  return format(date, "MMM d, yyyy");
};
