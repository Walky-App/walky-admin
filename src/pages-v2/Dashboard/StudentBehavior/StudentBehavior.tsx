import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSkeleton } from "../components";
import { apiClient } from "../../../API";
import API from "../../../API";
import {
  AssetIcon,
  FilterBar,
  TimePeriod,
  LastUpdated,
} from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import { CRow, CCol } from "@coreui/react";
import "./StudentBehavior.css";

import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";

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
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [hoveredTooltip, setHoveredTooltip] = useState<number | null>(null);

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['studentBehavior', timePeriod, selectedSchool?._id, selectedCampus?._id],
    queryFn: () => apiClient.api.adminV2DashboardStudentBehaviorList({
      period: timePeriod,
      schoolId: selectedSchool?._id,
      campusId: selectedCampus?._id
    }),
  });

  const handleExport = async () => {
    try {
      const response = await API.get('/admin/v2/dashboard/student-behavior', {
        params: {
          period: timePeriod,
          export: 'true',
          schoolId: selectedSchool?._id,
          campusId: selectedCampus?._id
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `student_behavior_stats_${timePeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const data = (apiData?.data || {}) as any;
  const metricCards: MetricCard[] = data.metricCards || [];
  const completionMetrics: CompletionMetric[] = data.completionMetrics || [];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

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
          <div className="icon-circle-std">
            <AssetIcon name="student-behavior-icon" color="#00c943" size={30} />
          </div>
        </div>
        <h1 className="student-behavior-title">Student Behavior</h1>
      </div>

      {/* Metric Cards */}
      <CRow className="metric-cards-row">
        {metricCards.map((card, index) => (
          <CCol key={index} xs={12} sm={6} lg={3} className="metric-card-col">
            <div className="metric-card">
              <p className="metric-card-title">{card.title}</p>
              <div className="metric-card-value-container">
                <span className="metric-card-value">{card.value}</span>
                <span className="metric-card-unit">{card.unit}</span>
              </div>
              <div className="metric-card-change">
                <AssetIcon
                  name={
                    card.changeDirection === "up"
                      ? "trend-up-icon"
                      : "trend-down-icon"
                  }
                  color={
                    card.changeDirection === "up"
                      ? theme.colors.trendUpGreen
                      : theme.colors.trendDownRed
                  }
                  size={16}
                />
                <p className="metric-card-change-text">
                  <span
                    className="change-percentage"
                    data-trend={card.changeDirection}
                  >
                    {card.changePercentage}
                  </span>{" "}
                  <span className="change-text">{card.change}</span>
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
                    <AssetIcon
                      name="tooltip-icon"
                      color={theme.colors.iconTooltip}
                      size={16}
                    />
                  </button>
                  {hoveredTooltip === index && (
                    <div className="metric-card-tooltip">
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
          <AssetIcon
            name="double-users-icon"
            color={theme.colors.bodyColor}
            size={24}
          />
          <h2 className="completion-title">Student Completion Rates</h2>
        </div>

        <div className="completion-container">
          <CRow className="completion-metrics-row">
            {completionMetrics.map((metric, index) => (
              <CCol
                key={index}
                xs={12}
                md={3}
                className={`completion-metric-col ${index === 4 ? "single-metric" : ""
                  }`}
              >
                <div className="completion-metric">
                  <div className="completion-metric-header">
                    <p className="completion-metric-label">{metric.label}</p>
                    <p
                      className="completion-metric-percentage"
                      style={{ color: metric.textColor }}
                    >
                      {metric.percentage}%
                    </p>
                  </div>
                  <div className="completion-progress-bar-container">
                    <div className="completion-progress-bar-bg">
                      <div
                        className="completion-progress-bar"
                        style={{
                          width: `${(metric.percentage / 100) * 100}%`,
                          backgroundColor: metric.color,
                        }}
                      />
                    </div>
                  </div>
                  <p className="completion-metric-description">
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
