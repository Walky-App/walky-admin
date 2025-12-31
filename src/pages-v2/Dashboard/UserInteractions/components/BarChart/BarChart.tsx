import React, { useState } from "react";
import { useTheme } from "../../../../../hooks/useTheme";
import "./BarChart.css";

interface WeekData {
  label: string;
  dateRange: string;
}

interface InvitationData {
  sent: number;
  accepted: number;
  ignored: number;
}

interface BarChartProps {
  title: string;
  weeks: WeekData[];
  data: InvitationData[];
}

export const BarChart: React.FC<BarChartProps> = ({ title, weeks, data }) => {
  const { theme } = useTheme();
  const [hoveredBar, setHoveredBar] = useState<{
    weekIndex: number;
    type: "sent" | "accepted" | "ignored";
    value: number;
  } | null>(null);

  const tickCount = 6; // top to baseline

  // Scale uses the tallest single bar (grouped bars).
  const rawMax = data.reduce((maxSoFar, week) => {
    const weekMax = Math.max(week.sent, week.accepted, week.ignored);
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
      className="bar-chart-container"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor,
      }}
    >
      <h3 className="bar-chart-title" style={{ color: theme.colors.bodyColor }}>
        {title}
      </h3>

      <div className="bar-chart-wrapper">
        {/* Y-axis */}
        <div className="y-axis">
          {yAxisLabels.map((label, index) => {
            const top =
              roundedMax === 0 ? 0 : ((roundedMax - label) / roundedMax) * 100;
            return (
              <span
                key={index}
                className="y-axis-label"
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
        <div className="chart-area">
          {/* Horizontal grid lines */}
          <div className="grid-lines">
            {yAxisLabels.map((label, index) => {
              const top =
                roundedMax === 0
                  ? 0
                  : ((roundedMax - label) / roundedMax) * 100;
              return (
                <div
                  key={index}
                  className="grid-line"
                  style={{
                    borderColor: theme.colors.gridColor,
                    top: `${top}%`,
                  }}
                />
              );
            })}
          </div>

          {/* Bars */}
          <div className="bars-container">
            {data.map((weekData, index) => (
              <div key={index} className="week-bars">
                <div className="bars-group">
                  <div
                    className="bar bar-sent"
                    style={{
                      height: `${getBarHeight(weekData.sent)}%`,
                      backgroundColor: "#98f4a0",
                    }}
                    onMouseEnter={() =>
                      setHoveredBar({
                        weekIndex: index,
                        type: "sent",
                        value: weekData.sent,
                      })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                    aria-label={`Sent: ${weekData.sent}`}
                  >
                    {hoveredBar?.weekIndex === index &&
                      hoveredBar?.type === "sent" && (
                        <div
                          className="bar-tooltip"
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
                    className="bar bar-accepted"
                    style={{
                      height: `${getBarHeight(weekData.accepted)}%`,
                      backgroundColor: "#389001",
                    }}
                    onMouseEnter={() =>
                      setHoveredBar({
                        weekIndex: index,
                        type: "accepted",
                        value: weekData.accepted,
                      })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                    aria-label={`Accepted: ${weekData.accepted}`}
                  >
                    {hoveredBar?.weekIndex === index &&
                      hoveredBar?.type === "accepted" && (
                        <div
                          className="bar-tooltip"
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
                    className="bar bar-ignored"
                    style={{
                      height: `${getBarHeight(weekData.ignored)}%`,
                      backgroundColor: "#a0a0a0",
                    }}
                    onMouseEnter={() =>
                      setHoveredBar({
                        weekIndex: index,
                        type: "ignored",
                        value: weekData.ignored,
                      })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                    aria-label={`Ignored: ${weekData.ignored}`}
                  >
                    {hoveredBar?.weekIndex === index &&
                      hoveredBar?.type === "ignored" && (
                        <div
                          className="bar-tooltip"
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
      <div className="x-axis-labels">
        {weeks.map((week, index) => (
          <div key={index} className="week-label">
            <p className="week-name" style={{ color: "#5b6168" }}>
              {week.label}
            </p>
            <p className="week-dates" style={{ color: "#5b6168" }}>
              {week.dateRange}
            </p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bar-chart-legend">
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#98f4a0" }}
          />
          <span className="legend-text" style={{ color: "#5b6168" }}>
            Invitations sent
          </span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#389001" }}
          />
          <span className="legend-text" style={{ color: "#5b6168" }}>
            Clicked "accept"
          </span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#a0a0a0" }}
          />
          <span className="legend-text" style={{ color: "#5b6168" }}>
            Clicked "ignore"
          </span>
        </div>
      </div>
    </div>
  );
};
