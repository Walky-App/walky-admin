import React from "react";
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
}

export const FilterBar: React.FC<FilterBarProps> = ({
  timePeriod,
  onTimePeriodChange,
  dateRange = "October 1 – October 31",
  onExport,
  showExport = true,
}) => {
  const { theme } = useTheme();

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
          {dateRange && (
            <span
              className="filter-bar-date-range"
              style={{ color: theme.colors.textMuted }}
            >
              {dateRange}
            </span>
          )}
        </div>
      </div>
      {showExport && onExport && <ExportButton onClick={onExport} />}
    </section>
  );
};
