/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useTheme } from "../../../../hooks/useTheme";
import "./LineChart.css";

interface LineChartProps {
  title: string;
  data: number[];
  labels: string[];
  color: string;
  backgroundColor: string;
  yAxisLabel?: string;
  maxValue?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  labels,
  color,
  yAxisLabel,
  maxValue,
}) => {
  const { theme } = useTheme();

  // Transform data to Recharts format
  const chartData = labels.map((label, index) => ({
    name: label,
    value: data[index],
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
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
          <p style={{ margin: 0 }}>{`${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis ticks
  const formatYAxis = (value: number): string => {
    if (yAxisLabel) {
      return `${value}${yAxisLabel}`;
    }
    if (value >= 1000) {
      return `${value / 1000}k`;
    }
    return value.toString();
  };

  return (
    <div
      className="line-chart-container"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor,
      }}
    >
      <h3
        className="line-chart-title"
        style={{ color: theme.colors.bodyColor }}
      >
        {title}
      </h3>
      <div className="line-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={`gradient-${title.replace(/\s+/g, "-")}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                <stop offset="50%" stopColor={color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="5 5"
              stroke={theme.colors.gridColor}
              vertical={false}
              horizontal={true}
            />
            <XAxis
              dataKey="name"
              tick={{
                fill: theme.colors.textMuted,
                fontFamily: "Lato",
                fontSize: 12,
                fontWeight: 600,
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, maxValue || "auto"]}
              tick={{
                fill: theme.colors.textMuted,
                fontFamily: "Lato",
                fontSize: 12,
                fontWeight: 600,
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${title.replace(/\s+/g, "-")})`}
              fillOpacity={1}
              dot={false}
              activeDot={{
                r: 6,
                fill: theme.colors.tooltipBg,
                stroke: theme.colors.tooltipBorder,
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
