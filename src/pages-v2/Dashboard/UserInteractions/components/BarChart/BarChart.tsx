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

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.sent, d.accepted, d.ignored))
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
          {yAxisLabels.map((label, index) => (
            <span
              key={index}
              className="y-axis-label"
              style={{ color: "#5b6168" }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="chart-area">
          {/* Horizontal grid lines */}
          <div className="grid-lines">
            {yAxisLabels.map((_, index) => (
              <div
                key={index}
                className="grid-line"
                style={{ borderColor: theme.colors.gridColor }}
              />
            ))}
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
            Invitations accepted
          </span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#a0a0a0" }}
          />
          <span className="legend-text" style={{ color: "#5b6168" }}>
            Invitations ignored
          </span>
        </div>
      </div>
    </div>
  );
};
