import React, { useState, useEffect } from "react";
import "./IdeasInsights.css";
import { AssetIcon, ExportButton, LastUpdated } from "../../../components-v2";
import { NoIdeasFound } from "../components/NoIdeasFound/NoIdeasFound";
import { apiClient } from "../../../API";

interface PopularIdea {
  rank: number;
  title: string;
  owner: {
    name: string;
    avatar: string;
  };
  collaborations: number;
}

export const IdeasInsights: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<"all" | "week" | "month">(
    "month"
  );
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();

  const [stats, setStats] = useState({
    totalIdeas: 0,
    totalCollaborations: 0,
    conversionRate: 0,
  });

  const [popularIdeas, setPopularIdeas] = useState<PopularIdea[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch counts
        const [totalRes, collaboratedRes, ideasRes] = await Promise.all([
          apiClient.api.adminAnalyticsIdeasCountList({
            type: "total",
          } as any) as any,
          apiClient.api.adminAnalyticsIdeasCountList({
            type: "collaborated",
          } as any) as any,
          apiClient.api.adminV2IdeasList({ limit: 100 } as any) as any,
        ]);

        const total = totalRes.data.count || 0;
        const collaborated = collaboratedRes.data.count || 0;

        // Calculate conversion rate (collaborated / total) * 100
        const conversion =
          total > 0 ? Math.round((collaborated / total) * 100) : 0;

        setStats({
          totalIdeas: total,
          totalCollaborations: collaborated, // Assuming this endpoint returns total collaborations or ideas with collaborations
          conversionRate: conversion,
        });

        setLastUpdated(
          (totalRes as any)?.data?.lastUpdated ||
            (totalRes as any)?.data?.updatedAt ||
            (collaboratedRes as any)?.data?.lastUpdated ||
            (collaboratedRes as any)?.data?.updatedAt ||
            (ideasRes as any)?.data?.lastUpdated ||
            (ideasRes as any)?.data?.updatedAt ||
            (ideasRes as any)?.data?.metadata?.lastUpdated
        );

        // Fetch popular ideas
        const allIdeas = ideasRes.data.data || [];

        // Sort by collaborations (assuming there is a field for it, or we use participants count)
        const normalizedIdeas = allIdeas
          .map((idea: any) => {
            const collaborations =
              (Array.isArray(idea.participants)
                ? idea.participants.length
                : 0) ||
              idea.participants_count ||
              0;

            return {
              ...idea,
              collaborations,
              ownerName:
                idea.user?.name ||
                idea.created_by?.name ||
                idea.owner?.name ||
                "Unknown",
              ownerAvatar:
                idea.user?.avatar ||
                idea.user?.avatar_url ||
                idea.created_by?.avatar_url ||
                idea.owner?.avatar ||
                "",
            };
          })
          .filter((idea: any) => idea.collaborations > 0);

        const sortedIdeas = normalizedIdeas
          .sort((a: any, b: any) => b.collaborations - a.collaborations)
          .slice(0, 4)
          .map((idea: any, index: number) => ({
            rank: index + 1,
            title: idea.title,
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
    <main className="ideas-insights-page">
      {/* Header with Export Button */}
      <div className="insights-header">
        <ExportButton />
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
            <p className="time-card-value">1.4 Days</p>
            <div className="time-card-trend">
              <AssetIcon name="trend-up-red" size={24} color="#D53425" />
              <p className="trend-text">
                <span className="trend-percentage">1.3%</span>{" "}
                <span className="trend-label">Up from last month</span>
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
            <p className="time-card-value">2 Days</p>
            <div className="time-card-trend">
              <AssetIcon name="trend-up-red" size={24} color="#D53425" />
              <p className="trend-text">
                <span className="trend-percentage">1.3%</span>{" "}
                <span className="trend-label">Up from last month</span>
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
