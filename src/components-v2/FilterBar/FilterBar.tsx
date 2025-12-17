import React, { useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { useTheme } from "../../hooks/useTheme";
import { TimeSelector } from "../../pages-v2/Dashboard/components/TimeSelector/TimeSelector";
import { ExportButton } from "../ExportButton/ExportButton";
import { TimePeriod } from "./FilterBar.types";
import "./FilterBar.css";

interface FilterBarProps {
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
  dateRange?: string;
  onExport?: () => void;
  showExport?: boolean;
  exportTargetRef?: React.RefObject<HTMLElement | null>;
  exportFileName?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  timePeriod,
  onTimePeriodChange,
  dateRange,
  onExport,
  showExport = true,
  exportTargetRef,
  exportFileName,
}) => {
  const { theme } = useTheme();

  // Calculate date range based on time period
  const calculatedDateRange = useMemo(() => {
    if (dateRange) return dateRange; // Use custom date range if provided

    const today = new Date();
    const startDate = new Date(2025, 0, 1); // January 1, 2025

    switch (timePeriod) {
      case "all-time":
        return `${format(startDate, "MMMM d, yyyy")} – ${format(
          today,
          "MMMM d, yyyy"
        )}`;

      case "week": {
        const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
        return `${format(weekStart, "MMMM d")} – ${format(
          weekEnd,
          "MMMM d, yyyy"
        )}`;
      }

      case "month": {
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        return `${format(monthStart, "MMMM d")} – ${format(
          monthEnd,
          "MMMM d, yyyy"
        )}`;
      }

      default:
        return "";
    }
  }, [timePeriod, dateRange]);

  return (
    <section className="filter-bar" aria-label="Data filters">
      <div className="filter-bar-options">
        <div className="filter-bar-controls">
          <div className="filter-bar-group">
            <span
              className="filter-bar-label"
              style={{ color: theme.colors.bodyColor }}
            >
              Filter by
            </span>
            <TimeSelector selected={timePeriod} onChange={onTimePeriodChange} />
          </div>
          {calculatedDateRange && (
            <span className="filter-bar-date-range">{calculatedDateRange}</span>
          )}
        </div>
      </div>
      {showExport && (
        <ExportButton
          onClick={onExport}
          captureRef={exportTargetRef}
          filename={exportFileName}
        />
      )}
    </section>
  );
};
