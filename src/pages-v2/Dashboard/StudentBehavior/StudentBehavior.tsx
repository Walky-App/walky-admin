import React, { useState } from "react";
import {
  AssetIcon,
  FilterBar,
  TimePeriod,
  LastUpdated,
} from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import { CRow, CCol } from "@coreui/react";
import "./StudentBehavior.css";

interface MetricCard {
  title: string;
  value: string;
  unit: string;
  change: string;
  changeDirection: "up" | "down";
  changePercentage: string;
  hasTooltip?: boolean;
  tooltipText?: string;
}

interface CompletionMetric {
  label: string;
  percentage: number;
  description: string;
  color: string;
  textColor: string;
}

const StudentBehavior: React.FC = () => {
  const { theme } = useTheme();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [hoveredTooltip, setHoveredTooltip] = useState<number | null>(null);

  const handleExport = () => {
    console.log("Exporting student behavior data...");
  };

  const metricCards: MetricCard[] = [
    {
      title: "Average peers per student",
      value: "4.2",
      unit: "Peers",
      change: "Up from last month",
      changeDirection: "up",
      changePercentage: "8.5%",
      hasTooltip: false,
    },
    {
      title: "Average time to first interaction",
      value: "1.2",
      unit: "Days",
      change: "Down from last month",
      changeDirection: "down",
      changePercentage: "3.2%",
      hasTooltip: true,
      tooltipText: "Average time from registration to first interaction.",
    },
    {
      title: "Students who met in person",
      value: "20",
      unit: "%",
      change: "Up from last month",
      changeDirection: "up",
      changePercentage: "5.1%",
      hasTooltip: true,
      tooltipText:
        "Percentage of students with at least one accepted and completed invitation",
    },
    {
      title: "Students who joined a Space",
      value: "20",
      unit: "%",
      change: "Up from last month",
      changeDirection: "up",
      changePercentage: "12.3%",
      hasTooltip: true,
      tooltipText: "Percentage of students who joined at least one space.",
    },
  ];

  const completionMetrics: CompletionMetric[] = [
    {
      label: "New connections invited",
      percentage: 13.1,
      description:
        "Percentage of students who completed the invitation flow by inviting someone they did n't already know.",
      color: "#00c943",
      textColor: "#18682c",
    },
    {
      label: " Invited from Peers",
      percentage: 13.1,
      description:
        "Percentage of students who completed the invitation flow by inviting someone already in their peer list.",
      color: "#00c943",
      textColor: "#18682c",
    },
    {
      label: "Event participation rate",
      percentage: 13.1,
      description:
        "Percentage of users who opened an event and clicked 'Going' vs those who only viewed it.",
      color: "#ff9871",
      textColor: "#ba5630",
    },
    {
      label: "Space join rate",
      percentage: 13.1,
      description:
        "Percentage of users who entered a space and clicked 'Join' vs those who just viewed it",
      color: "#576cc2",
      textColor: "#4a4cd9",
    },
    {
      label: "Idea collaboration rate",
      percentage: 13.1,
      description:
        "Percentage of users who opened an idea and clicked 'Collaborate' vs those who only viewed it.",
      color: "#ebb129",
      textColor: "#8a6818",
    },
  ];

  return (
    <main
      className="student-behavior-page"
      aria-label="Student Behavior Dashboard"
    >
      {/* Filter Bar */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        dateRange="October 1 – October 31"
        onExport={handleExport}
      />

      {/* Header Section */}
      <div className="page-header">
        <div className="icon-container" aria-hidden="true">
          <div className="icon-circle" style={{ backgroundColor: "#e9fcf4" }}>
            <AssetIcon name="trend-up-icon" color="#00c943" size={30} />
          </div>
        </div>
        <h1 className="page-title" style={{ color: theme.colors.bodyColor }}>
          Student Behavior
        </h1>
      </div>

      {/* Metric Cards */}
      <CRow className="metric-cards-row">
        {metricCards.map((card, index) => (
          <CCol key={index} xs={12} sm={6} lg={3} className="metric-card-col">
            <div
              className="metric-card"
              style={{
                backgroundColor: theme.colors.cardBg,
                borderColor: theme.colors.borderColor,
              }}
            >
              <p
                className="metric-card-title"
                style={{ color: theme.colors.bodyColor }}
              >
                {card.title}
              </p>
              <div className="metric-card-value-container">
                <span
                  className="metric-card-value"
                  style={{ color: theme.colors.bodyColor }}
                >
                  {card.value}
                </span>
                <span
                  className="metric-card-unit"
                  style={{ color: theme.colors.bodyColor }}
                >
                  {card.unit}
                </span>
              </div>
              <div className="metric-card-change">
                <AssetIcon
                  name={
                    card.changeDirection === "up"
                      ? "trend-up-icon"
                      : "trend-down-icon"
                  }
                  color={card.changeDirection === "up" ? "#18682c" : "#ba0000"}
                  size={16}
                />
                <p className="metric-card-change-text">
                  <span
                    className="change-percentage"
                    style={{
                      color:
                        card.changeDirection === "up" ? "#18682c" : "#ba0000",
                    }}
                  >
                    {card.changePercentage}
                  </span>{" "}
                  <span style={{ color: theme.colors.bodyColor }}>
                    {card.change}
                  </span>
                </p>
              </div>
              {card.hasTooltip && (
                <div className="metric-card-tooltip-wrapper">
                  <button
                    data-testid="metric-card-tooltip-button"
                    className="metric-card-tooltip-btn"
                    aria-label="More information"
                    onMouseEnter={() => setHoveredTooltip(index)}
                    onMouseLeave={() => setHoveredTooltip(null)}
                  >
                    <AssetIcon name="tooltip-icon" color="#acb6ba" size={16} />
                  </button>
                  {hoveredTooltip === index && (
                    <div
                      className="metric-card-tooltip"
                      style={{
                        backgroundColor: theme.colors.tooltipBg,
                        color: theme.colors.tooltipText,
                        borderColor: theme.colors.tooltipBorder,
                      }}
                    >
                      {card.tooltipText}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CCol>
        ))}
      </CRow>

      {/* Student Completion Rates */}
      <div className="completion-section">
        <div className="completion-header">
          <AssetIcon name="double-users-icon" color="#1d1b20" size={24} />
          <h2
            className="completion-title"
            style={{ color: theme.colors.bodyColor }}
          >
            Student Completion Rates
          </h2>
        </div>

        <div
          className="completion-container"
          style={{
            backgroundColor: theme.colors.cardBg,
            borderColor: theme.colors.borderColor,
          }}
        >
          <CRow className="completion-metrics-row">
            {completionMetrics.map((metric, index) => (
              <CCol
                key={index}
                xs={12}
                md={3}
                className={`completion-metric-col ${
                  index === 4 ? "single-metric" : ""
                }`}
              >
                <div className="completion-metric">
                  <div className="completion-metric-header">
                    <p
                      className="completion-metric-label"
                      style={{ color: theme.colors.bodyColor }}
                    >
                      {metric.label}
                    </p>
                    <p
                      className="completion-metric-percentage"
                      style={{ color: metric.textColor }}
                    >
                      {metric.percentage}%
                    </p>
                  </div>
                  <div className="completion-progress-bar-container">
                    <div
                      className="completion-progress-bar-bg"
                      style={{ backgroundColor: "#ebf1ff" }}
                    >
                      <div
                        className="completion-progress-bar"
                        style={{
                          width: `${(metric.percentage / 100) * 100}%`,
                          backgroundColor: metric.color,
                        }}
                      />
                    </div>
                  </div>
                  <p
                    className="completion-metric-description"
                    style={{ color: theme.colors.textMuted }}
                  >
                    {metric.description}
                  </p>
                </div>
              </CCol>
            ))}
          </CRow>
        </div>
      </div>

      {/* Last Updated Footer */}
      <LastUpdated />
    </main>
  );
};

export default StudentBehavior;
