import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSkeleton } from "../components";
import { apiClient } from "../../../API";
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

const mapTimePeriodToApi = (
  period: "all-time" | "week" | "month"
): "all" | "week" | "month" | "year" => {
  if (period === "all-time") return "all";
  return period;
};

const isWithinPeriod = (dateValue?: string, period?: string) => {
  if (!dateValue) return false;

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return true;

  if (period === "month") {
    const now = new Date();
    return (
      parsed.getUTCFullYear() === now.getUTCFullYear() &&
      parsed.getUTCMonth() === now.getUTCMonth()
    );
  }

  if (period === "week") {
    const now = new Date();
    const start = new Date(now);
    start.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7));
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 7);

    return parsed >= start && parsed < end;
  }

  return true;
};

const formatReasonLabel = (value?: string) => {
  if (!value) return "Other";

  return value
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatStatusLabel = (value?: string) => {
  if (!value) return "Resolved";

  const cleaned = value.replace(/_/g, " ").trim();
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const StudentSafety: React.FC = () => {
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const { timePeriod, setTimePeriod } = useDashboard();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");
  const exportRef = useRef<HTMLElement | null>(null);

  // ... (inside component)

  const [modalReports, setModalReports] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTotalCount, setModalTotalCount] = useState(0);

  const fetchModalReports = async (type: string) => {
    setModalLoading(true);
    try {
      // Map legend label to API type
      let apiType = "";
      if (type.includes("Messages")) apiType = "message";
      else if (type.includes("Ideas")) apiType = "idea";
      else if (type.includes("Spaces")) apiType = "space";
      else if (type.includes("Events")) apiType = "event";
      else if (type.includes("People")) apiType = "user";

      const apiPeriod = mapTimePeriodToApi(timePeriod);

      const res = await apiClient.api.adminV2ReportsList({
        type: apiType,
        limit: 100,
        schoolId: selectedSchool?._id,
        campusId: selectedCampus?._id,
        period: apiPeriod,
      });

      const reports = (res.data.data || []).filter((r: any) =>
        isWithinPeriod(r.reportDate, timePeriod)
      );

      setModalTotalCount(reports.length);

      const transformedReports = reports.map((r) => ({
        id: r.id,
        reportedItemName: r.description || "Unknown Item",
        reportId: r.reportedItemId || r.id,
        reason: formatReasonLabel(r.reason || r.reasonTag),
        reasonTag: formatReasonLabel(r.reasonTag || r.reason || "Other"),
        description: r.description || "",
        reportedOn: r.reportDate
          ? new Date(r.reportDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
        reportedBy:
          r.reporterName ||
          (r as any).reporter?.name ||
          (r as any).reporter?.fullName ||
          (r as any).reporter?.full_name ||
          (r as any).reporter ||
          "Unknown",
        status: formatStatusLabel(r.status || "resolved"),
      }));

      setModalReports(transformedReports);
    } catch (error) {
      console.error("Failed to fetch modal reports:", error);
      setModalReports([]);
      setModalTotalCount(0);
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
    queryKey: [
      "studentSafety",
      timePeriod,
      selectedSchool?._id,
      selectedCampus?._id,
    ],
    queryFn: () =>
      apiClient.api.adminV2DashboardStudentSafetyList({
        period: timePeriod,
        schoolId: selectedSchool?._id,
        campusId: selectedCampus?._id,
      }),
  });

  const data = apiData?.data || { labels: [], subLabels: [], reportsData: [] };
  const chartLabels = data.labels || [];
  const chartSubLabels = data.subLabels;
  const reportsData = (data.reportsData || []) as Array<{
    [key: string]: number;
  }>;

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
    <main
      className="student-safety-page"
      aria-label="Student Safety Dashboard"
      ref={exportRef}
    >
      {/* Filter Bar */}
      <FilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        exportTargetRef={exportRef}
        exportFileName={`student_safety_${timePeriod}`}
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
        totalCount={modalTotalCount}
        period={
          timePeriod === "month"
            ? "this month"
            : timePeriod === "week"
            ? "this week"
            : "all time"
        }
        loading={modalLoading}
      />
    </main>
  );
};

export default StudentSafety;
