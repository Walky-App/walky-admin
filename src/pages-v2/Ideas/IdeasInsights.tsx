import React, { useState } from "react";
import "./IdeasInsights.css";
import AssetIcon from "../../components-v2/AssetIcon/AssetIcon";
import { ExportButton } from "../../components-v2";

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

  // Mock data from Figma design
  const popularIdeas: PopularIdea[] = [
    {
      rank: 1,
      title: "Children's App",
      owner: {
        name: "Tamika",
        avatar:
          "https://www.figma.com/api/mcp/asset/c7761cf3-44c4-4af2-b819-aff487d3fd85",
      },
      collaborations: 70,
    },
    {
      rank: 2,
      title: "Language Exchange",
      owner: {
        name: "Mariana",
        avatar:
          "https://www.figma.com/api/mcp/asset/e92fcc5c-2808-41d5-850b-f8accc18ceee",
      },
      collaborations: 65,
    },
    {
      rank: 3,
      title: "LSAT Study Group",
      owner: {
        name: "Julian",
        avatar:
          "https://www.figma.com/api/mcp/asset/1eedfcfe-3a3f-4264-bd43-a4eeaa32ff9a",
      },
      collaborations: 63,
    },
    {
      rank: 4,
      title: "Form a Band",
      owner: {
        name: "Arturo",
        avatar:
          "https://www.figma.com/api/mcp/asset/3540c7ce-300e-40ca-82e2-c3007bcd6bae",
      },
      collaborations: 60,
    },
  ];

  return (
    <div className="ideas-insights-page">
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
          <p className="stats-card-value">8502</p>
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
          <p className="stats-card-value">75089</p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Historical conversion rate</p>
            <div className="stats-card-icon conversion-icon-bg">
              <AssetIcon name="stats-icon" size={30} color="#00C943" />
            </div>
          </div>
          <p className="stats-card-value">80%</p>
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
            {popularIdeas.map((idea) => (
              <div key={idea.rank} className="popular-idea-item">
                <div className="idea-item-left">
                  <span className="idea-rank">{idea.rank}.</span>
                  <img
                    src={idea.owner.avatar}
                    alt={idea.owner.name}
                    className="idea-owner-avatar"
                  />
                  <p className="idea-title">{idea.title}</p>
                </div>
                <p className="idea-collaborations">
                  {idea.collaborations} Collaborations
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
