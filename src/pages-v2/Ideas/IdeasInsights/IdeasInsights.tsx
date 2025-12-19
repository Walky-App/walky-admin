import React, { useState, useEffect, useRef } from "react";
import "./IdeasInsights.css";
import { AssetIcon, ExportButton, LastUpdated } from "../../../components-v2";
import { NoIdeasFound } from "../components/NoIdeasFound/NoIdeasFound";
import { apiClient } from "../../../API";
import { usePermissions } from "../../../hooks/usePermissions";

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
  const [timePeriod, setTimePeriod] = useState<"all" | "week" | "month">(
    "month"
  );
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch counts with time period filter
        // API types are incomplete - period param is supported by backend
        const periodParam = timePeriod === "all" ? undefined : timePeriod;
        const [totalRes, collaboratedRes, ideasRes, timeMetricsRes] =
          await Promise.all([
            apiClient.api.adminAnalyticsIdeasCountList({
              type: "total",
              period: periodParam,
            } as Parameters<typeof apiClient.api.adminAnalyticsIdeasCountList>[0]),
            apiClient.api.adminAnalyticsIdeasCountList({
              type: "collaborated",
              period: periodParam,
            } as Parameters<typeof apiClient.api.adminAnalyticsIdeasCountList>[0]),
            apiClient.api.adminV2IdeasList({
              limit: 100,
              period: periodParam,
            } as Parameters<typeof apiClient.api.adminV2IdeasList>[0]),
            apiClient.api
              .adminAnalyticsIdeasTimeMetricsList({
                period: periodParam,
              } as Parameters<typeof apiClient.api.adminAnalyticsIdeasTimeMetricsList>[0])
              .catch(() => ({ data: null })),
          ]);

        // Extract count from response - API returns different fields based on type
        const totalData = totalRes.data as {
          totalIdeasCreated?: number;
          count?: number;
        };
        const collaboratedData = collaboratedRes.data as {
          collaboratedIdeasCount?: number;
          count?: number;
        };
        const total = totalData.totalIdeasCreated || totalData.count || 0;
        const collaborated =
          collaboratedData.collaboratedIdeasCount ||
          collaboratedData.count ||
          0;

        // Calculate conversion rate (collaborated / total) * 100
        const conversion =
          total > 0 ? Math.round((collaborated / total) * 100) : 0;

        setStats({
          totalIdeas: total,
          totalCollaborations: collaborated, // Assuming this endpoint returns total collaborations or ideas with collaborations
          conversionRate: conversion,
        });

        // Process time metrics if available
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

        // Type assertion for accessing optional metadata fields
        const ideasData = ideasRes.data as {
          lastUpdated?: string;
          updatedAt?: string;
          metadata?: { lastUpdated?: string };
        };
        setLastUpdated(
          (totalData as { lastUpdated?: string }).lastUpdated ||
            (totalData as { updatedAt?: string }).updatedAt ||
            (collaboratedData as { lastUpdated?: string }).lastUpdated ||
            (collaboratedData as { updatedAt?: string }).updatedAt ||
            ideasData.lastUpdated ||
            ideasData.updatedAt ||
            ideasData.metadata?.lastUpdated
        );

        // Fetch popular ideas
        const allIdeas = ideasRes.data.data || [];

        // Type for extended idea data from API
        type ExtendedIdea = {
          id?: string;
          ideaTitle?: string;
          owner?: { name?: string; avatar?: string };
          studentId?: string;
          collaborated?: number;
          creationDate?: string;
          creationTime?: string;
          isFlagged?: boolean;
          flagReason?: string;
        };

        // Sort by collaborations
        const normalizedIdeas = (allIdeas as ExtendedIdea[])
          .map((idea) => {
            const collaborations = idea.collaborated || 0;

            return {
              ...idea,
              collaborations,
              ownerName: idea.owner?.name || "Unknown",
              ownerAvatar: idea.owner?.avatar || "",
            };
          })
          .filter((idea) => idea.collaborations > 0);

        const sortedIdeas = normalizedIdeas
          .sort((a, b) => b.collaborations - a.collaborations)
          .slice(0, 4)
          .map((idea, index: number) => ({
            rank: index + 1,
            title: idea.ideaTitle || "",
            owner: {
              name: idea.ownerName,
              avatar: idea.ownerAvatar,
            },
            collaborations: idea.collaborations,
          }));

        setPopularIdeas(sortedIdeas);
      } catch (error) {
        console.error("Failed to fetch ideas insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod]);

  return (
    <main className="ideas-insights-page" ref={exportRef}>
      {/* Header with Export Button */}
      <div className="insights-header">
        {showExport && (
          <ExportButton captureRef={exportRef} filename="ideas_insights" />
        )}
      </div>

      {/* Top 3 Stats Cards */}
      <div className="stats-cards-row">
        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Total Ideas created historically</p>
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
            <p className="stats-card-title">
              Total collaborations historically
            </p>
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
            <p className="stats-card-title">Historical conversion rate</p>
            <div className="stats-card-icon conversion-icon-bg">
              <AssetIcon name="stats-icon" size={30} color="#00C943" />
            </div>
          </div>
          <p className="stats-card-value">
            {loading ? "..." : `${stats.conversionRate}%`}
          </p>
        </div>
      </div>

      {/* Time Period Filter */}
      <div className="filter-section">
        <div className="time-period-filter">
          <p className="filter-label">Time period:</p>
          <div className="time-selector">
            <button
              data-testid="time-all-btn"
              className={`time-option first ${
                timePeriod === "all" ? "active" : ""
              }`}
              onClick={() => setTimePeriod("all")}
            >
              All time
            </button>
            <button
              data-testid="time-week-btn"
              className={`time-option ${timePeriod === "week" ? "active" : ""}`}
              onClick={() => setTimePeriod("week")}
            >
              Week
            </button>
            <button
              data-testid="time-month-btn"
              className={`time-option last ${
                timePeriod === "month" ? "active" : ""
              }`}
              onClick={() => setTimePeriod("month")}
            >
              Month
            </button>
          </div>
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
                    : "trend-down-green"
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
                    : "trend-down-green"
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
                        className="idea-owner-avatar"
                      />
                    ) : (
                      <div className="idea-owner-avatar placeholder">
                        <AssetIcon name="double-users-icon" size={24} />
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
