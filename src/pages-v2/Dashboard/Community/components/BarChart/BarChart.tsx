import React, { useState } from "react";
import { useTheme } from "../../../../../hooks/useTheme";
import "./BarChart.css";

interface WeekData {
  label: string;
  dateRange: string;
}

interface CreationData {
  events: number;
  ideas: number;
  spaces: number;
}

interface BarChartProps {
  title: string;
  weeks: WeekData[];
  data: CreationData[];
}

export const BarChart: React.FC<BarChartProps> = ({ title, weeks, data }) => {
  const { theme } = useTheme();
  const [hoveredBar, setHoveredBar] = useState<{
    weekIndex: number;
    type: "events" | "ideas" | "spaces";
    value: number;
  } | null>(null);

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.events, d.ideas, d.spaces))
  );
  const roundedMax = Math.ceil(maxValue / 20) * 20; // Round to nearest 20

  // Calculate bar heights as percentages
  const getBarHeight = (value: number) => {
    return (value / roundedMax) * 100;
  };

  // Y-axis labels
  const yAxisLabels = [
    roundedMax,
    roundedMax * 0.8,
    roundedMax * 0.6,
    roundedMax * 0.4,
    roundedMax * 0.2,
  ];

  return (
    <div
      className="community-bar-chart-container"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor,
      }}
    >
      <h3
        className="community-bar-chart-title"
        style={{ color: theme.colors.bodyColor }}
      >
        {title}
      </h3>

      <div className="community-bar-chart-wrapper">
        {/* Y-axis */}
        <div className="community-y-axis">
          {yAxisLabels.map((label, index) => (
            <span
              key={index}
              className="community-y-axis-label"
              style={{ color: "#5b6168" }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="community-chart-area">
          {/* Horizontal grid lines */}
          <div className="community-grid-lines">
            {yAxisLabels.map((_, index) => (
              <div
                key={index}
                className="community-grid-line"
                style={{ borderColor: theme.colors.gridColor }}
              />
            ))}
          </div>

          {/* Bars */}
          <div className="community-bars-container">
            {data.map((weekData, index) => (
              <div key={index} className="community-week-bars">
                <div className="community-bars-group">
                  <div
                    className="community-bar community-bar-events"
                    style={{
                      height: `${getBarHeight(weekData.events)}%`,
                      backgroundColor: "#ff9871",
                    }}
                    onMouseEnter={() =>
                      setHoveredBar({
                        weekIndex: index,
                        type: "events",
                        value: weekData.events,
                      })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                    aria-label={`Events: ${weekData.events}`}
                  >
                    {hoveredBar?.weekIndex === index &&
                      hoveredBar?.type === "events" && (
                        <div
                          className="community-bar-tooltip"
                          style={{
                            backgroundColor: theme.colors.tooltipBg,
                            color: theme.colors.tooltipText,
                            borderColor: theme.colors.tooltipBorder,
                          }}
                        >
                          {hoveredBar.value.toLocaleString()}
                        </div>
                      )}
                  </div>
                  <div
                    className="community-bar community-bar-ideas"
                    style={{
                      height: `${getBarHeight(weekData.ideas)}%`,
                      backgroundColor: "#ebb129",
                    }}
                    onMouseEnter={() =>
                      setHoveredBar({
                        weekIndex: index,
                        type: "ideas",
                        value: weekData.ideas,
                      })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                    aria-label={`Ideas: ${weekData.ideas}`}
                  >
                    {hoveredBar?.weekIndex === index &&
                      hoveredBar?.type === "ideas" && (
                        <div
                          className="community-bar-tooltip"
                          style={{
                            backgroundColor: theme.colors.tooltipBg,
                            color: theme.colors.tooltipText,
                            borderColor: theme.colors.tooltipBorder,
                          }}
                        >
                          {hoveredBar.value.toLocaleString()}
                        </div>
                      )}
                  </div>
                  <div
                    className="community-bar community-bar-spaces"
                    style={{
                      height: `${getBarHeight(weekData.spaces)}%`,
                      backgroundColor: "#4a4cd9",
                    }}
                    onMouseEnter={() =>
                      setHoveredBar({
                        weekIndex: index,
                        type: "spaces",
                        value: weekData.spaces,
                      })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                    aria-label={`Spaces: ${weekData.spaces}`}
                  >
                    {hoveredBar?.weekIndex === index &&
                      hoveredBar?.type === "spaces" && (
                        <div
                          className="community-bar-tooltip"
                          style={{
                            backgroundColor: theme.colors.tooltipBg,
                            color: theme.colors.tooltipText,
                            borderColor: theme.colors.tooltipBorder,
                          }}
                        >
                          {hoveredBar.value.toLocaleString()}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="community-x-axis-labels">
        {weeks.map((week, index) => (
          <div key={index} className="community-week-label">
            <p className="community-week-name" style={{ color: "#5b6168" }}>
              {week.label}
            </p>
            <p className="community-week-dates" style={{ color: "#5b6168" }}>
              {week.dateRange}
            </p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="community-bar-chart-legend">
        <div className="community-legend-item">
          <div
            className="community-legend-color"
            style={{ backgroundColor: "#ff9871" }}
          />
          <span className="community-legend-text" style={{ color: "#5b6168" }}>
            Total Events created
          </span>
        </div>
        <div className="community-legend-item">
          <div
            className="community-legend-color"
            style={{ backgroundColor: "#ebb129" }}
          />
          <span className="community-legend-text" style={{ color: "#5b6168" }}>
            Total Ideas created
          </span>
        </div>
        <div className="community-legend-item">
          <div
            className="community-legend-color"
            style={{ backgroundColor: "#4a4cd9" }}
          />
          <span className="community-legend-text" style={{ color: "#5b6168" }}>
            Total Spaces created
          </span>
        </div>
      </div>
    </div>
  );
};
