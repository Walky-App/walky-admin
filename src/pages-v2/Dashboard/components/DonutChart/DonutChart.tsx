import React from "react";
import { CChartDoughnut } from "@coreui/react-chartjs";
import { useTheme } from "../../../../hooks/useTheme";
import "./DonutChart.css";

interface DonutChartData {
  label: string;
  value: number;
  percentage: string;
  color: string;
}

interface DonutChartProps {
  title: string;
  data: DonutChartData[];
}

export const DonutChart: React.FC<DonutChartProps> = ({ title, data }) => {
  const { theme } = useTheme();

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color),
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "70%",
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
        displayColors: true,
        callbacks: {
          label: function (context: { label: string; parsed: number }) {
            const total = data.reduce((sum, item) => sum + item.value, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(2);
            return `${context.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div
      className="donut-chart-container"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor,
        color: theme.colors.bodyColor,
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
          <CChartDoughnut data={chartData} options={chartOptions} />
        </div>

        <div className="donut-chart-legend">
          {data.map((item) => (
            <div key={item.label} className="legend-item">
              <div className="legend-item-label">
                <div
                  className="legend-color-indicator"
                  style={{ backgroundColor: item.color }}
                />
                <span
                  className="legend-text"
                  style={{ color: theme.colors.textMuted }}
                >
                  {item.label}
                </span>
              </div>
              <span
                className="legend-percentage"
                style={{ color: theme.colors.textMuted }}
              >
                {item.percentage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
