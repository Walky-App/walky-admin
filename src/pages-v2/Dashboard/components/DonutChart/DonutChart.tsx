/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "../../../../hooks/useTheme";
import "./DonutChart.css";

interface DonutChartData {
  label: string;
  value: number;
  percentage: string | number;
  color: string;
}

interface DonutChartProps {
  title: string;
  data: DonutChartData[];
}

export const DonutChart: React.FC<DonutChartProps> = ({ title, data }) => {
  const { theme } = useTheme();

  // Transform data for Recharts
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(2);
      return (
        <div
          style={{
            backgroundColor: theme.colors.tooltipBg,
            border: `1px solid ${theme.colors.tooltipBorder}`,
            padding: "10px",
            borderRadius: "4px",
            color: theme.colors.tooltipText,
            fontSize: "12px",
            fontFamily: "Lato",
          }}
        >
          <p style={{ margin: 0 }}>{`${payload[0].name}: ${percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="donut-chart-container"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor,
      }}
    >
      <h3
        className="donut-chart-title"
        style={{ color: theme.colors.bodyColor }}
      >
        {title}
      </h3>
      <div className="donut-chart-content">
        <div className="donut-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="donut-chart-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div className="legend-label">
                <span
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                />
                <span
                  className="legend-text"
                  style={{ color: theme.colors.bodyColor }}
                >
                  {item.label}
                </span>
              </div>
              <span
                className="legend-percentage"
                style={{ color: theme.colors.bodyColor }}
              >
                {typeof item.percentage === "string"
                  ? item.percentage
                  : `${item.percentage}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
