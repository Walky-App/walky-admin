import React, { useState, useEffect, useRef } from "react";
import "./IdeasInsights.css";
import { AssetIcon, LastUpdated, FilterBar } from "../../../components-v2";
import { TimePeriod } from "../../../components-v2/FilterBar/FilterBar.types";
import { NoIdeasFound } from "../components/NoIdeasFound/NoIdeasFound";
import { apiClient } from "../../../API";
import { usePermissions } from "../../../hooks/usePermissions";
import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";

interface PopularIdea {
  rank: number;
  title: string;
  owner: {
    name: string;
    avatar: string;
  };
  collaborations: number;
}

interface TimeMetrics {
  timeToFirstCollaborator: {
    value: number;
    unit: string;
    trend: number;
    trendDirection: "up" | "down";
  };
  avgResponseTime: {
    value: number;
    unit: string;
    trend: number;
    trendDirection: "up" | "down";
  };
}

export const IdeasInsights: React.FC = () => {
  const { canExport } = usePermissions();
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();
  const exportRef = useRef<HTMLElement | null>(null);

  // Check permissions for this page
  const showExport = canExport("ideas_insights");

  const [stats, setStats] = useState({
    totalIdeas: 0,
    totalCollaborations: 0,
    conversionRate: 0,
  });

  const [timeMetrics, setTimeMetrics] = useState<TimeMetrics>({
    timeToFirstCollaborator: {
      value: 0,
      unit: "days",
      trend: 0,
      trendDirection: "up",
    },
    avgResponseTime: { value: 0, unit: "days", trend: 0, trendDirection: "up" },
  });

  const [popularIdeas, setPopularIdeas] = useState<PopularIdea[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the proper insights endpoint with campus/school filtering
        const periodParam = timePeriod === "all-time" ? undefined : timePeriod;

        const insightsRes = await apiClient.api.adminV2IdeasInsightsList({
          period: periodParam,
          schoolId: selectedSchool?._id,
          campusId: selectedCampus?._id,
        });

        const insightsData = insightsRes.data;
        const total = insightsData.totalIdeas || 0;
        const collaborated = insightsData.collaboratedIdeas || 0;

        // Calculate conversion rate (collaborated / total) * 100
        const conversion =
          total > 0 ? Math.round((collaborated / total) * 100) : 0;

        setStats({
          totalIdeas: total,
          totalCollaborations: collaborated,
          conversionRate: conversion,
        });

        // Process time metrics - fetch separately if needed
        const timeMetricsRes = await apiClient.api
          .adminAnalyticsIdeasTimeMetricsList({
            period: periodParam,
            schoolId: selectedSchool?._id,
            campusId: selectedCampus?._id,
          })
          .catch(() => ({ data: null }));

        const timeMetricsData = (
          timeMetricsRes as {
            data: (TimeMetrics & { lastUpdated?: string }) | null;
          }
        ).data;
        if (timeMetricsData) {
          const metricsData = timeMetricsData;
          setTimeMetrics({
            timeToFirstCollaborator: metricsData.timeToFirstCollaborator || {
              value: 0,
              unit: "days",
              trend: 0,
              trendDirection: "up",
            },
            avgResponseTime: metricsData.avgResponseTime || {
              value: 0,
              unit: "days",
              trend: 0,
              trendDirection: "up",
            },
          });
          if (metricsData.lastUpdated) {
            setLastUpdated(metricsData.lastUpdated);
          }
        }

        // Set popular ideas from insights response
        const topIdeas = insightsData.topIdeas || [];
        const sortedIdeas = topIdeas.map((idea, index: number) => ({
          rank: index + 1,
          title: idea.title || "",
          owner: {
            name: idea.creator?.name || "Unknown",
            avatar: idea.creator?.avatar || "",
          },
          collaborations: idea.collaborators || 0,
        }));

        setPopularIdeas(sortedIdeas);
        setLastUpdated(new Date().toISOString());
      } catch (err: unknown) {
        console.error("Failed to fetch ideas insights:", err);
        const error = err as { response?: { data?: { error?: string }; status?: number }; message?: string };
        const errorMessage = error?.response?.data?.error || error?.message || "";
        if (errorMessage.includes("school") || error?.response?.status === 400) {
          setError(
            "Your account is not associated with a school. Please contact an administrator to configure your school access."
          );
        } else {
          setError("Failed to load ideas insights data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod, selectedSchool?._id, selectedCampus?._id]);

  return (
    <main className="ideas-insights-page" ref={exportRef}>
      {/* Filter Bar */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        exportTargetRef={exportRef}
        exportFileName={`ideas_insights_${timePeriod}`}
        showExport={showExport}
      />

      {/* Error Warning Banner */}
      {error && (
        <div className="insights-error-banner">
          <AssetIcon name="red-flag-icon" size={20} color="#F59E0B" />
          <span>{error}</span>
        </div>
      )}

      {/* Top 3 Stats Cards */}
      <div className="stats-cards-row">
        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Total Ideas created </p>
            <div className="stats-card-icon ideas-icon-bg">
              <AssetIcon name="ideia-icon" size={30} color="#FFB800" />
            </div>
          </div>
          <p className="stats-card-value">
            {loading ? "..." : stats.totalIdeas.toLocaleString()}
          </p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Total collaborations</p>
            <div className="stats-card-icon user-icon-bg">
              <AssetIcon name="double-users-icon" size={24} color="#8280FF" />
            </div>
          </div>
          <p className="stats-card-value">
            {loading ? "..." : stats.totalCollaborations.toLocaleString()}
          </p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Conversion rate</p>
            <div className="stats-card-icon conversion-icon-bg">
              <AssetIcon name="stats-icon" size={30} color="#00C943" />
            </div>
          </div>
          <p className="stats-card-value">
            {loading ? "..." : `${stats.conversionRate}%`}
          </p>
        </div>
      </div>

      {/* Bottom Row: Time Cards + Popular Ideas */}
      <div className="bottom-row">
        {/* Left Column - Time Metric Cards */}
        <div className="time-cards-column">
          <div className="time-card">
            <div className="time-card-header">
              <p className="time-card-title">Time to first collaborator</p>
              <div className="stats-card-icon ideas-icon-bg">
                <AssetIcon name="ideia-icon" size={30} color="#FFB800" />
              </div>
            </div>
            <p className="time-card-value">
              {loading
                ? "..."
                : `${timeMetrics.timeToFirstCollaborator.value} Days`}
            </p>
            <div className="time-card-trend">
              <AssetIcon
                name={
                  timeMetrics.timeToFirstCollaborator.trendDirection === "up"
                    ? "trend-up-red"
                    : "trend-down-icon"
                }
                size={24}
                color={
                  timeMetrics.timeToFirstCollaborator.trendDirection === "up"
                    ? "#D53425"
                    : "#00C943"
                }
              />
              <p className="trend-text">
                <span className="trend-percentage">
                  {Math.abs(timeMetrics.timeToFirstCollaborator.trend)}%
                </span>{" "}
                <span className="trend-label">
                  from last {timePeriod === "week" ? "week" : "month"}
                </span>
              </p>
            </div>
          </div>

          <div className="time-card">
            <div className="time-card-header">
              <p className="time-card-title">
                Average response time in creator's chat
              </p>
              <div className="stats-card-icon chat-icon-bg">
                <AssetIcon name="chat-icon" size={30} color="#4AD9D4" />
              </div>
            </div>
            <p className="time-card-value">
              {loading ? "..." : `${timeMetrics.avgResponseTime.value} Days`}
            </p>
            <div className="time-card-trend">
              <AssetIcon
                name={
                  timeMetrics.avgResponseTime.trendDirection === "up"
                    ? "trend-up-red"
                    : "trend-down-icon"
                }
                size={24}
                color={
                  timeMetrics.avgResponseTime.trendDirection === "up"
                    ? "#D53425"
                    : "#00C943"
                }
              />
              <p className="trend-text">
                <span className="trend-percentage">
                  {Math.abs(timeMetrics.avgResponseTime.trend)}%
                </span>{" "}
                <span className="trend-label">
                  from last {timePeriod === "week" ? "week" : "month"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Popular Ideas */}
        <div className="popular-ideas-card">
          <h2 className="popular-ideas-title">Popular Ideas</h2>
          <div className="popular-ideas-list">
            {popularIdeas.length === 0 && !loading ? (
              <NoIdeasFound message="No popular ideas yet" />
            ) : (
              popularIdeas.map((idea) => (
                <div key={idea.rank} className="popular-idea-item">
                  <div className="idea-item-left">
                    <span className="idea-rank">{idea.rank}.</span>
                    {idea.owner.avatar ? (
                      <img
                        src={idea.owner.avatar}
                        alt={idea.owner.name}
                        className="IDP-idea-owner-avatar"
                      />
                    ) : (
                      <div className="IDP-idea-owner-avatar placeholder">
                        <AssetIcon name="double-users-icon" size={20} />
                      </div>
                    )}
                    <p className="idea-title">{idea.title}</p>
                  </div>
                  <p className="idea-collaborations">
                    {idea.collaborations} Collaborations
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <LastUpdated className="insights-footer" lastUpdated={lastUpdated} />
    </main>
  );
};
