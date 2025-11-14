import React from "react";
import { CChartLine } from "@coreui/react-chartjs";
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
  backgroundColor,
  yAxisLabel,
  maxValue,
}) => {
  const { theme } = useTheme();

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: color,
        backgroundColor: backgroundColor,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#4d4d4d",
        pointHoverBorderColor: "#eef0f1",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#4d4d4d",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#eef0f1",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function (context: { parsed: { y: string | number } }) {
            return `${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.colors.textMuted,
          font: {
            family: "Lato",
            size: 12,
            weight: 600,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: maxValue,
        grid: {
          color: "#d2d2d3",
          borderDash: [5, 5],
        },
        ticks: {
          color: theme.colors.textMuted,
          font: {
            family: "Lato",
            size: 12,
            weight: 600,
          },
          callback: function (value: string | number) {
            if (yAxisLabel) {
              return `${value}${yAxisLabel}`;
            }
            if (typeof value === "number" && value >= 1000) {
              return `${value / 1000}k`;
            }
            return value;
          },
        },
      },
    },
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
        <CChartLine data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
