import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { useTheme } from "../../../../hooks/useTheme";
import { AssetIcon, NoData } from "../../../../components-v2";
import "./LineChart.css";

interface LineChartProps {
  title: string;
  data: number[];
  labels: string[];
  subLabels?: string[]; // Optional sub-labels for date ranges
  color: string;
  backgroundColor: string;
  yAxisLabel?: string;
  maxValue?: number;
  titleTooltip?: string;
  animate?: boolean;
  animationDuration?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  labels,
  subLabels,
  color,
  yAxisLabel,
  maxValue,
  titleTooltip,
  animate = false,
  animationDuration = 400,
}) => {
  const { theme } = useTheme();

  // Transform data to Recharts format
  const chartData = labels.map((label, index) => ({
    name: label,
    subLabel: subLabels?.[index] || "",
    value: data[index],
  }));

  // Consider chart "empty" when no positive numeric values exist
  const hasData =
    Array.isArray(data) &&
    data.some((v) => typeof v === "number" && Number.isFinite(v) && v > 0);

  // Custom tooltip - using explicit type for payload access
  const CustomTooltip = (
    props: TooltipProps<ValueType, NameType> & {
      payload?: Array<{ value?: number | string }>;
    }
  ) => {
    const { active, payload } = props;
    if (active && payload && payload.length && payload[0].value !== undefined) {
      return (
        <div
          style={{
            backgroundColor: theme.colors.tooltipBg,
            border: `1px solid ${theme.colors.tooltipBorder}`,
            padding: "10px",
            borderRadius: "4px",
            color: theme.colors.white,
            fontSize: "12px",
            fontFamily: "var(--v2-font-family)",
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

  // Custom X-axis tick with sub-labels
  const CustomXAxisTick = ({
    x,
    y,
    payload,
  }: {
    x?: number;
    y?: number;
    payload?: { value: string };
  }) => {
    if (!payload) return null;
    const dataPoint = chartData.find((d) => d.name === payload.value);

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#5b6168"
          fontFamily="var(--v2-font-family)"
          fontSize={14}
          fontWeight={600}
        >
          {payload.value}
        </text>
        {dataPoint?.subLabel && (
          <text
            x={0}
            y={0}
            dy={34}
            textAnchor="middle"
            fill="#5b6168"
            fontFamily="var(--v2-font-family)"
            fontSize={12}
            fontWeight={400}
          >
            {dataPoint.subLabel}
          </text>
        )}
      </g>
    );
  };

  return (
    <div
      className="line-chart-container"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor,
      }}
    >
      <div className="line-chart-title-row">
        <h3
          className="line-chart-title"
          style={{ color: theme.colors.bodyColor }}
        >
          {title}
        </h3>
        {titleTooltip && (
          <div className="line-chart-title-tooltip-wrapper">
            <button
              type="button"
              className="line-chart-title-tooltip-btn"
              data-testid="line-chart-title-tooltip-btn"
              aria-label={`${title} info`}
            >
              <AssetIcon
                name="tooltip-icon"
                size={16}
                color={theme.colors.textMuted}
                className="line-chart-title-tooltip-icon"
              />
            </button>
            <div className="line-chart-title-tooltip">{titleTooltip}</div>
          </div>
        )}
      </div>
      {hasData ? (
        <div className="line-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
                tick={<CustomXAxisTick />}
                axisLine={false}
                tickLine={false}
                height={subLabels ? 60 : 40}
              />
              <YAxis
                domain={[0, maxValue || "auto"]}
                tick={{
                  fill: "#5b6168",
                  fontFamily: "var(--v2-font-family)",
                  fontSize: 14,
                  fontWeight: 600,
                  textAnchor: "end",
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
                isAnimationActive={animate}
                animationDuration={animationDuration}
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
      ) : (
        <div className="line-chart-no-data">
          <NoData
            type="primary"
            message="No data yet"
            iconName="nd-grafs-empty"
          />
        </div>
      )}
    </div>
  );
};
