import React, { useState } from "react";
import {
  AssetIcon,
  FilterBar,
  TimePeriod,
  LastUpdated,
} from "../../../components-v2";
import { BarChart } from "./components/BarChart";
import "./Community.css";

const Community: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");

  const handleExport = () => {
    console.log("Exporting community data...");
  };

  // Mock data for different time periods
  // All time data (11 months)
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
  ];
  const creationDataMonth = [
    { events: 400, ideas: 500, spaces: 350 },
    { events: 450, ideas: 550, spaces: 380 },
    { events: 500, ideas: 600, spaces: 420 },
    { events: 550, ideas: 650, spaces: 460 },
    { events: 600, ideas: 700, spaces: 500 },
    { events: 650, ideas: 750, spaces: 540 },
    { events: 700, ideas: 800, spaces: 580 },
    { events: 750, ideas: 850, spaces: 620 },
    { events: 800, ideas: 900, spaces: 660 },
    { events: 850, ideas: 950, spaces: 700 },
    { events: 900, ideas: 1000, spaces: 750 },
  ];

  // Week data (5 weeks)
  const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
  const weekSubLabels = [
    "Oct 1 - Oct 5",
    "Oct 6 - Oct 12",
    "Oct 13 - Oct 19",
    "Oct 20 - Oct 26",
    "Oct 27 - Oct 31",
  ];
  const creationDataWeek = [
    { events: 51, ideas: 65, spaces: 45 },
    { events: 68, ideas: 85, spaces: 49 },
    { events: 75, ideas: 78, spaces: 60 },
    { events: 70, ideas: 80, spaces: 60 },
    { events: 70, ideas: 85, spaces: 53 },
  ];

  // Day data (7 days)
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const creationDataDay = [
    { events: 12, ideas: 15, spaces: 10 },
    { events: 15, ideas: 18, spaces: 12 },
    { events: 18, ideas: 20, spaces: 14 },
    { events: 16, ideas: 19, spaces: 13 },
    { events: 20, ideas: 22, spaces: 16 },
    { events: 22, ideas: 25, spaces: 18 },
    { events: 19, ideas: 21, spaces: 15 },
  ];

  // Select data based on time period
  const chartLabels =
    timePeriod === "week"
      ? dayLabels
      : timePeriod === "month"
      ? weekLabels
      : monthLabels;

  const chartSubLabels = timePeriod === "month" ? weekSubLabels : undefined;

  const creationData =
    timePeriod === "week"
      ? creationDataDay
      : timePeriod === "month"
      ? creationDataWeek
      : creationDataMonth;

  // Format data for BarChart component
  const weeksFormatted = chartLabels.map((label, index) => ({
    label,
    dateRange: chartSubLabels?.[index] || "",
  }));

  return (
    <main className="community-page" aria-label="Community Dashboard">
      {/* Filter Bar */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        onExport={handleExport}
      />

      {/* Header Section */}
      <div className="page-header">
        <div className="icon-container" aria-hidden="true">
          <div className="icon-circle">
            <AssetIcon name="popular-emoji-icon" color="#f69b39" size={30} />
          </div>
        </div>
        <h1 className="page-title">Community Creation</h1>
      </div>

      {/* Creation Metrics Bar Chart */}
      <div className="creation-section">
        <BarChart
          title="Creation metrics by type"
          weeks={weeksFormatted}
          data={creationData}
        />
      </div>

      {/* Last Updated Footer */}
      <LastUpdated />
    </main>
  );
};

export default Community;
