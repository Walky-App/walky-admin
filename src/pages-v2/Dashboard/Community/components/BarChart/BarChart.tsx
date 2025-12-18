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

  const tickCount = 6; // top to baseline

  // Scale uses the tallest single bar (grouped bars).
  const rawMax = data.reduce((maxSoFar, week) => {
    const weekMax = Math.max(week.events, week.ideas, week.spaces);
    return Math.max(maxSoFar, weekMax);
  }, 0);

  const buildScale = (maxValue: number) => {
    if (maxValue <= 0) {
      const fallbackMax = 1;
      return { roundedMax: fallbackMax, step: fallbackMax / (tickCount - 1) };
    }

    const magnitude = 10 ** Math.floor(Math.log10(maxValue));
    const fraction = maxValue / magnitude;

    let niceFraction = 1;
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 2.5) niceFraction = 2.5;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;

    const roundedMax = niceFraction * magnitude;
    const step = roundedMax / (tickCount - 1);
    return { roundedMax, step };
  };

  const { roundedMax, step } = buildScale(rawMax);

  // Calculate bar heights as percentages
  const getBarHeight = (value: number) => {
    return roundedMax === 0 ? 0 : (value / roundedMax) * 100;
  };

  // Y-axis labels (top to bottom)
  const yAxisLabels = Array.from({ length: tickCount }, (_, idx) =>
    Number((roundedMax - step * idx).toFixed(2))
  );

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
          {yAxisLabels.map((label, index) => {
            const top =
              roundedMax === 0 ? 0 : ((roundedMax - label) / roundedMax) * 100;
            return (
              <span
                key={index}
                className="community-y-axis-label"
                style={{
                  color: "#5b6168",
                  top: `${top}%`,
                }}
              >
                {label}
              </span>
            );
          })}
        </div>

        {/* Chart area */}
        <div className="community-chart-area">
          {/* Horizontal grid lines */}
          <div className="community-grid-lines">
            {yAxisLabels.map((label, index) => {
              const top =
                roundedMax === 0
                  ? 0
                  : ((roundedMax - label) / roundedMax) * 100;
              return (
                <div
                  key={index}
                  className="community-grid-line"
                  style={{
                    borderColor: theme.colors.gridColor,
                    top: `${top}%`,
                  }}
                />
              );
            })}
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
