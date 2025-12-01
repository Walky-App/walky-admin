import React, { useState } from "react";
import {
  AssetIcon,
  FilterBar,
  TimePeriod,
  StackedBarChart,
  LastUpdated,
  ReportDetailsModal,
} from "../../../components-v2";
import { useMixpanel } from "../../../hooks";
import "./StudentSafety.css";

const StudentSafety: React.FC = () => {
  const { trackEvent } = useMixpanel();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");

  const handleTimePeriodChange = (newTimePeriod: TimePeriod) => {
    setTimePeriod(newTimePeriod);
    trackEvent("Student Safety - Filter Time Period Changed", {
      time_period: newTimePeriod,
      previous_period: timePeriod,
    });
  };

  const handleExport = () => {
    console.log("Exporting student safety data...");
    trackEvent("Student Safety - Data Exported", {
      time_period: timePeriod,
    });
  };

  const handleBarClick = (_legendKey: string, legendLabel: string) => {
    const reportType = legendLabel.replace("Reported ", "");
    setSelectedReportType(reportType);
    setModalVisible(true);
    trackEvent("Student Safety - Report History Modal Opened", {
      report_type: reportType,
      time_period: timePeriod,
    });
  };

  const handleModalClose = () => {
    setModalVisible(false);
    trackEvent("Student Safety - Report History Modal Closed", {
      report_type: selectedReportType,
      time_period: timePeriod,
    });
  };

  // Mock reports data
  const mockReports = [
    {
      id: "1",
      reportedItemName: "Children's App",
      reportId: "166g...fjhsgt",
      reason: "intellectual-property",
      reasonTag: "Intellectual property",
      description: "Review the idea because it is the topic of my thesis.",
      reportedOn: "October 20, 2025 - 12:14",
      reportedBy: "Jackie",
      status: "resolved" as const,
    },
    {
      id: "2",
      reportedItemName: "Form a Band",
      reportId: "166g...fjhsgt",
      reason: "harassment-threats",
      reasonTag: "Harassment / Threats",
      description:
        "I am reporting this idea because it includes threatening language toward other students and makes me feel unsafe participating",
      reportedOn: "October 20, 2025 - 12:14",
      reportedBy: "Jackie",
      status: "resolved" as const,
    },
  ];

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
  const reportsDataMonth = [
    {
      reportedPeople: 20,
      reportedEvents: 15,
      reportedSpaces: 12,
      reportedIdeas: 10,
      reportedMessages: 18,
    },
    {
      reportedPeople: 22,
      reportedEvents: 16,
      reportedSpaces: 14,
      reportedIdeas: 12,
      reportedMessages: 20,
    },
    {
      reportedPeople: 25,
      reportedEvents: 18,
      reportedSpaces: 15,
      reportedIdeas: 14,
      reportedMessages: 22,
    },
    {
      reportedPeople: 28,
      reportedEvents: 20,
      reportedSpaces: 16,
      reportedIdeas: 15,
      reportedMessages: 24,
    },
    {
      reportedPeople: 30,
      reportedEvents: 22,
      reportedSpaces: 18,
      reportedIdeas: 16,
      reportedMessages: 26,
    },
    {
      reportedPeople: 32,
      reportedEvents: 24,
      reportedSpaces: 20,
      reportedIdeas: 18,
      reportedMessages: 28,
    },
    {
      reportedPeople: 35,
      reportedEvents: 26,
      reportedSpaces: 22,
      reportedIdeas: 20,
      reportedMessages: 30,
    },
    {
      reportedPeople: 38,
      reportedEvents: 28,
      reportedSpaces: 24,
      reportedIdeas: 22,
      reportedMessages: 32,
    },
    {
      reportedPeople: 40,
      reportedEvents: 30,
      reportedSpaces: 26,
      reportedIdeas: 24,
      reportedMessages: 34,
    },
    {
      reportedPeople: 42,
      reportedEvents: 32,
      reportedSpaces: 28,
      reportedIdeas: 26,
      reportedMessages: 36,
    },
    {
      reportedPeople: 45,
      reportedEvents: 35,
      reportedSpaces: 30,
      reportedIdeas: 28,
      reportedMessages: 38,
    },
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
  const reportsDataWeek = [
    {
      reportedPeople: 3,
      reportedEvents: 2,
      reportedSpaces: 2,
      reportedIdeas: 2,
      reportedMessages: 2,
    },
    {
      reportedPeople: 3,
      reportedEvents: 2,
      reportedSpaces: 2,
      reportedIdeas: 2,
      reportedMessages: 2,
    },
    {
      reportedPeople: 3,
      reportedEvents: 2,
      reportedSpaces: 2,
      reportedIdeas: 2,
      reportedMessages: 2,
    },
    {
      reportedPeople: 3,
      reportedEvents: 2,
      reportedSpaces: 2,
      reportedIdeas: 2,
      reportedMessages: 2,
    },
    {
      reportedPeople: 3,
      reportedEvents: 2,
      reportedSpaces: 2,
      reportedIdeas: 2,
      reportedMessages: 2,
    },
  ];

  // Day data (7 days)
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const reportsDataDay = [
    {
      reportedPeople: 1,
      reportedEvents: 1,
      reportedSpaces: 0,
      reportedIdeas: 1,
      reportedMessages: 1,
    },
    {
      reportedPeople: 2,
      reportedEvents: 1,
      reportedSpaces: 1,
      reportedIdeas: 1,
      reportedMessages: 1,
    },
    {
      reportedPeople: 1,
      reportedEvents: 2,
      reportedSpaces: 1,
      reportedIdeas: 0,
      reportedMessages: 2,
    },
    {
      reportedPeople: 2,
      reportedEvents: 1,
      reportedSpaces: 1,
      reportedIdeas: 1,
      reportedMessages: 1,
    },
    {
      reportedPeople: 3,
      reportedEvents: 2,
      reportedSpaces: 1,
      reportedIdeas: 2,
      reportedMessages: 2,
    },
    {
      reportedPeople: 2,
      reportedEvents: 2,
      reportedSpaces: 2,
      reportedIdeas: 1,
      reportedMessages: 1,
    },
    {
      reportedPeople: 1,
      reportedEvents: 1,
      reportedSpaces: 1,
      reportedIdeas: 1,
      reportedMessages: 2,
    },
  ];

  // Select data based on time period
  const chartLabels =
    timePeriod === "week"
      ? dayLabels
      : timePeriod === "month"
      ? weekLabels
      : monthLabels;

  const chartSubLabels = timePeriod === "month" ? weekSubLabels : undefined;

  const reportsData =
    timePeriod === "week"
      ? reportsDataDay
      : timePeriod === "month"
      ? reportsDataWeek
      : reportsDataMonth;

  // Format data for StackedBarChart component
  const weeksFormatted = chartLabels.map((label, index) => ({
    label,
    dateRange: chartSubLabels?.[index] || "",
  }));

  // Order matters: bars stack from bottom to top in the order listed
  const legend = [
    { key: "reportedMessages", label: "Reported Messages", color: "#bff2ff" },
    { key: "reportedIdeas", label: "Reported Ideas", color: "#ebb129" },
    { key: "reportedSpaces", label: "Reported Spaces", color: "#576cc2" },
    { key: "reportedEvents", label: "Reported Events", color: "#ff9871" },
    { key: "reportedPeople", label: "Reported People", color: "#00c617" },
  ];

  const reportsDataFormatted = {
    weeks: weeksFormatted,
    data: reportsData,
    legend,
  };

  return (
    <main className="student-safety-page" aria-label="Student Safety Dashboard">
      {/* Filter Bar */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={handleTimePeriodChange}
        onExport={handleExport}
      />

      {/* Header Section */}
      <div className="page-header">
        <div className="icon-container" aria-hidden="true">
          <div className="icon-circle">
            <AssetIcon name="lock-icon" color="#ef6161" size={30} />
          </div>
        </div>
        <h1 className="student-safety-title">Student Safety</h1>
      </div>

      {/* Reports Bar Chart */}
      <div className="reports-section">
        <StackedBarChart
          title="Reports"
          weeks={reportsDataFormatted.weeks}
          data={reportsDataFormatted.data}
          legend={reportsDataFormatted.legend}
          onBarClick={handleBarClick}
        />
      </div>

      {/* Last Updated Footer */}
      <LastUpdated />

      {/* Report Details Modal */}
      <ReportDetailsModal
        visible={modalVisible}
        onClose={handleModalClose}
        reportType={selectedReportType}
        reports={mockReports}
        totalCount={2}
        period="March"
      />
    </main>
  );
};

export default StudentSafety;
