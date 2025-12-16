import React, { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { StackedBarChartProps } from "./StackedBarChart.types";
import "./StackedBarChart.css";

export const StackedBarChart: React.FC<StackedBarChartProps> = ({
  title,
  weeks,
  data,
  legend,
  onBarClick,
}) => {
  const { theme } = useTheme();
  const [hoveredBar, setHoveredBar] = useState<{
    weekIndex: number;
    barKey: string;
    value: number;
  } | null>(null);

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...data.map((weekData) =>
      Object.values(weekData).reduce((sum, val) => sum + val, 0)
    )
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
      className="stacked-bar-chart-container"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor,
      }}
    >
      <h3
        className="stacked-bar-chart-title"
        style={{ color: theme.colors.bodyColor }}
      >
        {title}
      </h3>

      <div className="stacked-bar-chart-wrapper">
        {/* Y-axis */}
        <div className="stacked-bar-y-axis">
          {yAxisLabels.map((label, index) => (
            <span
              key={index}
              className="stacked-bar-y-axis-label"
              style={{ color: theme.colors.textMuted }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="stacked-bar-chart-area">
          {/* Horizontal grid lines */}
          <div className="stacked-bar-grid-lines">
            {yAxisLabels.map((_, index) => (
              <div
                key={index}
                className="stacked-bar-grid-line"
                style={{ borderColor: theme.colors.gridColor }}
              />
            ))}
          </div>

          {/* Bars */}
          <div className="stacked-bar-bars-container">
            {data.map((weekData, weekIndex) => {
              // Filter legend items that have a non-zero value for this week to determine the top bar
              const visibleLegendItems = legend.filter(
                (item) => (weekData[item.key] || 0) > 0
              );

              return (
                <div key={weekIndex} className="stacked-bar-week-bars">
                  <div className="stacked-bar-bars-group">
                    {legend.map((legendItem) => {
                      const value = weekData[legendItem.key] || 0;
                      if (value === 0) return null;

                      const isTopBar =
                        visibleLegendItems.length > 0 &&
                        legendItem.key ===
                        visibleLegendItems[visibleLegendItems.length - 1].key;

                      return (
                        <div
                          key={legendItem.key}
                          className="stacked-bar-bar"
                          style={{
                            height: `${getBarHeight(value)}%`,
                            backgroundColor: legendItem.color,
                            borderTopLeftRadius: isTopBar ? "8px" : "0",
                            borderTopRightRadius: isTopBar ? "8px" : "0",
                            cursor: onBarClick ? "pointer" : "default",
                          }}
                          onClick={() =>
                            onBarClick?.(legendItem.key, legendItem.label)
                          }
                          onMouseEnter={() =>
                            setHoveredBar({
                              weekIndex,
                              barKey: legendItem.key,
                              value,
                            })
                          }
                          onMouseLeave={() => setHoveredBar(null)}
                          data-testid={`bar-${weekIndex}-${legendItem.key}`}
                        >
                          <span
                            className="stacked-bar-value"
                            style={{
                              color:
                                legendItem.color === "#576cc2"
                                  ? "#ffffff"
                                  : "#1d1b20",
                            }}
                          >
                            {value}
                          </span>
                          {hoveredBar?.weekIndex === weekIndex &&
                            hoveredBar?.barKey === legendItem.key && (
                              <div
                                className={`stacked-bar-tooltip${
                                  weekIndex >= data.length - 2
                                    ? " stacked-bar-tooltip--left"
                                    : ""
                                }`}
                                style={{
                                  backgroundColor: theme.colors.tooltipBg,
                                  color: theme.colors.tooltipText,
                                  borderColor: theme.colors.tooltipBorder,
                                  border: "1px solid",
                                }}
                              >
                                {legendItem.label}: {value.toLocaleString()}
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="stacked-bar-x-axis-labels">
        {weeks.map((week, index) => (
          <div key={index} className="stacked-bar-week-label">
            <p
              className="stacked-bar-week-name"
              style={{ color: theme.colors.textMuted }}
            >
              {week.label}
            </p>
            <p
              className="stacked-bar-week-dates"
              style={{ color: theme.colors.textMuted }}
            >
              {week.dateRange}
            </p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="stacked-bar-chart-legend">
        {legend.map((item) => (
          <div key={item.key} className="stacked-bar-legend-item">
            <div
              className="stacked-bar-legend-color"
              style={{ backgroundColor: item.color }}
            />
            <span
              className="stacked-bar-legend-text"
              style={{ color: theme.colors.textMuted }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
