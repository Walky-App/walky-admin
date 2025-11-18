import React, { useState } from "react";
import {
  AssetIcon,
  FilterBar,
  TimePeriod,
  StackedBarChart,
} from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import "./Community.css";

const Community: React.FC = () => {
  const { theme } = useTheme();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");

  const handleExport = () => {
    console.log("Exporting community data...");
  };

  // Mock data for creation metrics
  const creationData = {
    weeks: [
      { label: "Week 1", dateRange: "Oct 1 - Oct 5" },
      { label: "Week 2", dateRange: "Oct 6 - Oct 12" },
      { label: "Week 3", dateRange: "Oct 13 - Oct 19" },
      { label: "Week 4", dateRange: "Oct 20 - Oct 26" },
      { label: "Week 5", dateRange: "Oct 27 - Oct 31" },
    ],
    data: [
      { events: 51, ideas: 65, spaces: 45 },
      { events: 68, ideas: 85, spaces: 49 },
      { events: 75, ideas: 78, spaces: 60 },
      { events: 70, ideas: 80, spaces: 60 },
      { events: 70, ideas: 85, spaces: 53 },
    ],
    legend: [
      { key: "events", label: "Total Events created", color: "#ff9871" },
      { key: "ideas", label: "Total Ideas created", color: "#ebb129" },
      { key: "spaces", label: "Total Spaces created", color: "#4a4cd9" },
    ],
  };

  return (
    <main
      className="community-page"
      style={{ backgroundColor: theme.colors.bodyBg }}
      aria-label="Community Creation Dashboard"
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
          <div className="icon-circle" style={{ backgroundColor: "#fcf3e9" }}>
            <AssetIcon name="popular-emoji-icon" color="#f69b39" size={30} />
          </div>
        </div>
        <h1 className="page-title" style={{ color: theme.colors.bodyColor }}>
          Community Creation
        </h1>
      </div>

      {/* Creation Metrics Bar Chart */}
      <div className="creation-section">
        <StackedBarChart
          title="Creation metrics by type"
          weeks={creationData.weeks}
          data={creationData.data}
          legend={creationData.legend}
        />
      </div>

      {/* Footer */}
      <div className="footer-container">
        <div
          className="suggest-container"
          style={{ backgroundColor: theme.colors.lastUpdatedBg }}
        >
          <p className="suggest-text" style={{ color: theme.colors.textMuted }}>
            Don't see the data you are looking for?
          </p>
          <button className="suggest-link" data-testid="suggest-data-button">
            Suggest here
          </button>
        </div>
        <div className="last-updated-container">
          <p
            className="last-updated-text"
            style={{ color: theme.colors.textMuted }}
          >
            Last updated: Oct 25, 2025
          </p>
        </div>
      </div>
    </main>
  );
};

export default Community;
