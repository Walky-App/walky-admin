import React, { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { NoData } from "../NoData/NoData";
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

  const tickCount = 6; // top to baseline

  // Scale uses the max weekly total (stacked bars).
  const rawMax = data.reduce((maxSoFar, weekData) => {
    const weekTotal = Object.values(weekData).reduce(
      (sum, val) => sum + val,
      0
    );
    return Math.max(maxSoFar, weekTotal);
  }, 0);

  const hasData = rawMax > 0;

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

      {hasData ? (
        <>
          <div className="stacked-bar-chart-wrapper">
            {/* Y-axis */}
            <div className="stacked-bar-y-axis">
              {yAxisLabels.map((label, index) => {
                const top =
                  roundedMax === 0
                    ? 0
                    : ((roundedMax - label) / roundedMax) * 100;
                return (
                  <span
                    key={index}
                    className="stacked-bar-y-axis-label"
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
            <div className="stacked-bar-chart-area">
              {/* Horizontal grid lines */}
              <div className="stacked-bar-grid-lines">
                {yAxisLabels.map((label, index) => {
                  const top =
                    roundedMax === 0
                      ? 0
                      : ((roundedMax - label) / roundedMax) * 100;
                  return (
                    <div
                      key={index}
                      className="stacked-bar-grid-line"
                      style={{
                        borderColor: theme.colors.gridColor,
                        top: `${top}%`,
                      }}
                    />
                  );
                })}
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
                              visibleLegendItems[visibleLegendItems.length - 1]
                                .key;

                          const barHeightPercent = getBarHeight(value);
                          const showValue = barHeightPercent >= 5;

                          return (
                            <div
                              key={legendItem.key}
                              className="stacked-bar-bar"
                              style={{
                                height: `${barHeightPercent}%`,
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
                              {showValue && (
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
                              )}
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
                  style={{ color: "#5b6168" }}
                >
                  {week.label}
                </p>
                <p
                  className="stacked-bar-week-dates"
                  style={{ color: "#5b6168" }}
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
                  style={{ color: "#5b6168" }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="stacked-bar-chart-empty">
          <NoData
            type="primary"
            iconName="nd-stacked-bar"
            iconColor="#526AC9"
            iconSize={48}
            message="No data yet"
          />
        </div>
      )}
    </div>
  );
};
