import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSkeleton } from "../components";
import { apiClient } from "../../../API";
import API from "../../../API";
import {
  AssetIcon,
  FilterBar,
  StackedBarChart,
  LastUpdated,
  ReportDetailsModal,
} from "../../../components-v2";
import "./StudentSafety.css";

import { useDashboard } from "../../../contexts/DashboardContext";
import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";

const StudentSafety: React.FC = () => {
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const { timePeriod, setTimePeriod } = useDashboard();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");

  // ... (inside component)

  const handleExport = async () => {
    try {
      const response = await API.get('/admin/v2/dashboard/student-safety', {
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
      link.setAttribute('download', `student_safety_stats_${timePeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const [modalReports, setModalReports] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchModalReports = async (type: string) => {
    setModalLoading(true);
    try {
      // Map legend label to API type
      let apiType = "";
      if (type.includes("Messages")) apiType = "Message";
      else if (type.includes("Ideas")) apiType = "Idea";
      else if (type.includes("Spaces")) apiType = "Space";
      else if (type.includes("Events")) apiType = "Event";
      else if (type.includes("People")) apiType = "User";

      const res = await apiClient.api.adminV2ReportsList({
        type: apiType,
        limit: 10,
        schoolId: selectedSchool?._id,
        campusId: selectedCampus?._id
      }) as any;

      const reports = res.data.data || [];
      const transformedReports = reports.map((r: any) => ({
        id: r.id,
        reportedItemName: r.description || "Unknown Item", // Ideally backend provides item name
        reportId: r.studentId || "Unknown",
        reason: r.reason || "unknown",
        reasonTag: r.reasonTag || "Other",
        description: r.description || "",
        reportedOn: new Date(r.reportDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        reportedBy: "Unknown", // Backend might not provide this in list view
        status: (r.status || "resolved").toLowerCase(),
      }));

      setModalReports(transformedReports);
    } catch (error) {
      console.error("Failed to fetch modal reports:", error);
      setModalReports([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleBarClick = (_legendKey: string, legendLabel: string) => {
    const type = legendLabel.replace("Reported ", "");
    setSelectedReportType(type);
    setModalVisible(true);
    fetchModalReports(legendLabel);
  };

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['studentSafety', timePeriod, selectedSchool?._id, selectedCampus?._id],
    queryFn: () => apiClient.api.adminV2DashboardStudentSafetyList({
      period: timePeriod,
      schoolId: selectedSchool?._id,
      campusId: selectedCampus?._id
    }),
  });

  const data = (apiData?.data || {}) as any;
  const chartLabels = data.labels || [];
  const chartSubLabels = data.subLabels;
  const reportsData = data.reportsData || [];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Format data for StackedBarChart component
  const weeksFormatted = chartLabels.map((label: string, index: number) => ({
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
        onTimePeriodChange={setTimePeriod}
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
        onClose={() => setModalVisible(false)}
        reportType={selectedReportType}
        reports={modalReports}
        totalCount={modalReports.length}
        period={timePeriod === "month" ? "Month" : timePeriod === "week" ? "Week" : "All Time"}
        loading={modalLoading}
      />
    </main>
  );
};

export default StudentSafety;
