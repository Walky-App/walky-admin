import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import "./ReportSafety.css";
import {
  AssetIcon,
  ExportButton,
  SearchInput,
  CopyableId,
  ActionDropdown,
  FilterDropdown,
  MultiSelectFilterDropdown,
  StatusDropdown,
  WriteNoteModal,
  ReportDetailModal,
  Divider,
  FlagModal,
  CustomToast,
  BanUserModal,
  Pagination,
} from "../../../components-v2";
import type { ReportType, ReportStatus } from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";

interface ReportData {
  id: string;
  description: string;
  studentId: string;
  reportedItemId: string;
  reportDate: string;
  type: "Event" | "Message" | "User" | "Space" | "Idea";
  reason: string;
  reasonTag:
    | "Harmful / Unsafe Behavior"
    | "Made Me Uncomfortable"
    | "Spam"
    | "Harassment";
  status: "Pending review" | "Under evaluation" | "Resolved" | "Dismissed";
  isFlagged?: boolean;
}

export const ReportSafety: React.FC = () => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>(
    "Pending review,Under evaluation"
  );
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    reportId: string;
    newStatus: string;
  } | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [selectedReportDetails, setSelectedReportDetails] = useState<any>(null);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const {
    data: reportsData,
    isLoading: isReportsLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "reports",
      currentPage,
      searchQuery,
      selectedTypes,
      selectedStatus,
    ],
    queryFn: () =>
      apiClient.api.adminV2ReportsList({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        type: selectedTypes.join(","),
        status: selectedStatus,
      }),
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["reportStats"],
    queryFn: () => apiClient.api.adminV2ReportsStatsList(),
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2StudentsDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setToastMessage("User deactivated successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    onError: (error) => {
      console.error("Error deactivating user:", error);
      setToastMessage("Error deactivating user");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const banStudentMutation = useMutation({
    mutationFn: (data: { id: string; duration: number; reason: string }) =>
      apiClient.api.adminV2StudentsLockSettingsUpdate(data.id, {
        lockDuration: data.duration,
        lockReason: data.reason,
      } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setToastMessage("User banned successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    onError: (error) => {
      console.error("Error banning user:", error);
      setToastMessage("Error banning user");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const flagMutation = useMutation({
    mutationFn: (data: { id: string; type: string; reason: string }) => {
      switch (data.type.toLowerCase()) {
        case "user":
          return apiClient.api.adminV2StudentsFlagCreate(data.id, {
            reason: data.reason,
          });
        case "event":
          return apiClient.api.adminV2EventsFlagCreate(data.id, {
            reason: data.reason,
          });
        case "idea":
          return apiClient.api.adminV2IdeasFlagCreate(data.id, {
            reason: data.reason,
          });
        case "space":
          return apiClient.api.adminV2SpacesFlagCreate(data.id, {
            reason: data.reason,
          });
        default:
          throw new Error(`Cannot flag type: ${data.type}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setToastMessage("Item flagged successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setIsFlagModalOpen(false);
    },
    onError: (error) => {
      console.error("Error flagging item:", error);
      setToastMessage("Error flagging item");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const reports = (reportsData?.data.data || []).map((report: any) => ({
    id: report.id,
    description: report.description,
    studentId: report.studentId,
    reportedItemId: report.reportedItemId,
    reportDate: report.reportDate,
    type: report.type,
    reason: report.reason,
    reasonTag: report.reasonTag,
    status: report.status,
    isFlagged: report.isFlagged,
  }));

  const totalReports = statsData?.data.total || 0;
  const pendingReports = statsData?.data.pending || 0;
  const underEvaluationReports = statsData?.data.underEvaluation || 0;

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    await apiClient.api.adminV2ReportsStatusPartialUpdate(reportId, {
      status: newStatus,
    });
    refetch();
  };

  const handleNoteRequired = (reportId: string, newStatus: string) => {
    setPendingStatusChange({ reportId, newStatus });
    setIsNoteModalOpen(true);
  };

  const handleNoteConfirm = async (note: string) => {
    if (pendingStatusChange) {
      await apiClient.api.adminV2ReportsNoteCreate(
        pendingStatusChange.reportId,
        { note }
      );
      await handleStatusChange(
        pendingStatusChange.reportId,
        pendingStatusChange.newStatus
      );
      console.log("Note saved:", note);
      setPendingStatusChange(null);
    }
  };

  const handleNoteClose = () => {
    setIsNoteModalOpen(false);
    setPendingStatusChange(null);
  };

  const handleViewReport = async (report: ReportData) => {
    try {
      const response = await apiClient.api.adminV2ReportsDetail(report.id);
      setSelectedReportDetails(response.data);
      setSelectedReport(report);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching report details:", error);
      setToastMessage("Error fetching report details");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case "Harmful / Unsafe Behavior":
        return { bg: "#ffe5e4", text: "#a4181a" };
      case "Made Me Uncomfortable":
        return { bg: "#ffe2fa", text: "#91127c" };
      case "Spam":
        return { bg: "#fff3d6", text: "#8f5400" };
      case "Harassment":
        return { bg: "#ffe9f5", text: "#ba0066" };
      default:
        return { bg: "#f4f5f7", text: "#676d70" };
    }
  };

  if (isReportsLoading || isStatsLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <main className="report-safety-page">
      {/* Info Banner */}
      <div className="info-banner">
        <div className="info-banner-content">
          <div className="info-icon-wrapper">
            <AssetIcon name="tooltip-icon" size={24} color="#546fd9" />
          </div>
          <div className="info-text">
            <h3 className="info-title">Need direct support?</h3>
            <p className="info-description">
              For urgent safety concerns or complex cases, contact Walky support
              directly at{" "}
              <a href="mailto:support@walkyapp.com" className="info-link">
                support@walkyapp.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards-row">
        <div className={`stats-card ${theme.isDark ? "dark-mode" : ""}`}>
          <div className="stats-card-header">
            <p className="stats-card-title">Total</p>
            <div className="stats-card-icon" style={{ background: "#e5e4ff" }}>
              <AssetIcon name="mod-table-icon" size={30} color="#8280FF" />
            </div>
          </div>
          <p className="stats-card-value">{totalReports}</p>
        </div>

        <div className={`stats-card ${theme.isDark ? "dark-mode" : ""}`}>
          <div className="stats-card-header">
            <p className="stats-card-title">Pending review</p>
            <div className="stats-card-icon" style={{ background: "#eef0f1" }}>
              <AssetIcon
                name="mod-table-pause-icon"
                size={30}
                color="#5b6168"
              />
            </div>
          </div>
          <p className="stats-card-value">{pendingReports}</p>
        </div>

        <div className={`stats-card ${theme.isDark ? "dark-mode" : ""}`}>
          <div className="stats-card-header">
            <p className="stats-card-title">Under evaluation</p>
            <div className="stats-card-icon" style={{ background: "#fff3d6" }}>
              <AssetIcon
                name="mod-table-search-icon"
                size={30}
                color="#ebb129"
              />
            </div>
          </div>
          <p className="stats-card-value">{underEvaluationReports}</p>
        </div>
      </div>

      {/* Reports Table Container */}
      <div className={`reports-container ${theme.isDark ? "dark-mode" : ""}`}>
        <div className="reports-header">
          <div className="reports-title-section">
            <h1 className="reports-title">Reported users & content</h1>
            <div className="reports-filters">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search"
                variant="secondary"
              />

              <MultiSelectFilterDropdown
                selectedValues={selectedTypes}
                onChange={setSelectedTypes}
                options={[
                  { value: "User", label: "User" },
                  { value: "Message", label: "Message" },
                  { value: "Event", label: "Event" },
                  { value: "Idea", label: "Idea" },
                  { value: "Space", label: "Space" },
                ]}
                placeholder="Filter by type"
                icon="mod-filter-icon"
                testId="type-filter"
                ariaLabel="Filter by type"
              />

              <FilterDropdown
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  {
                    value: "Pending review,Under evaluation",
                    label: "All active",
                  },
                  { value: "Pending review", label: "Pending review" },
                  { value: "Under evaluation", label: "Under evaluation" },
                ]}
                placeholder="All active"
                testId="status-filter"
                ariaLabel="Filter by status"
              />
            </div>
          </div>
          <ExportButton />
        </div>

        {/* Reports Table */}
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Report Description</th>
                <th>
                  <div className="sortable-header">
                    <span>Report date</span>
                    <AssetIcon
                      name="swap-arrows-icon"
                      size={24}
                      color="#1d1b20"
                    />
                  </div>
                </th>
                <th>Type</th>
                <th>Reason</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <div className="content-space-divider" />

            <tbody>
              {reports.map((report, index) => {
                const reasonColors = getReasonColor(report.reasonTag);
                return (
                  <React.Fragment key={report.id}>
                    <tr>
                      <td>
                        <div className="report-description-cell">
                          <div className="report-content-wrapper">
                            <p
                              className="report-description"
                              onClick={() => handleViewReport(report)}
                            >
                              {report.description}
                            </p>
                            <CopyableId
                              id={report.studentId}
                              label="Student ID"
                              variant="secondary"
                              iconColor="#ACB6BA"
                              testId="copy-student-id"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="report-date">{report.reportDate}</td>
                      <td className="report-type">{report.type}</td>
                      <td>
                        <div
                          className="reason-badge"
                          style={{
                            background: reasonColors.bg,
                            color: reasonColors.text,
                          }}
                        >
                          {report.reasonTag
                            .split("/")
                            .map((line: string, idx: number) => (
                              <span key={idx}>
                                {line}
                                {idx === 0 && "/"}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td>
                        <StatusDropdown
                          value={report.status}
                          onChange={(newStatus) =>
                            handleStatusChange(report.id, newStatus)
                          }
                          onNoteRequired={(newStatus) =>
                            handleNoteRequired(report.id, newStatus)
                          }
                          options={[
                            "Pending review",
                            "Under evaluation",
                            "Resolved",
                            "Dismissed",
                          ]}
                          testId={`status-dropdown-${report.id}`}
                        />
                      </td>
                      <td>
                        <ActionDropdown
                          testId="report-options"
                          items={[
                            {
                              label: "Report details",
                              onClick: (e) => {
                                e.stopPropagation();
                                handleViewReport(report);
                              },
                            },
                            {
                              label: "Flag",
                              icon: "flag-icon",
                              iconSize: 18,
                              onClick: (e) => {
                                e.stopPropagation();
                                setSelectedReport(report);
                                setIsFlagModalOpen(true);
                              },
                            },
                          ]}
                        />
                      </td>
                    </tr>
                    {index < reports.length - 1 && !report.isFlagged && (
                      <tr className="report-divider-row">
                        <td colSpan={5}>
                          <Divider />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalReports / 10)}
          totalEntries={totalReports}
          entriesPerPage={10}
          onPageChange={setCurrentPage}
        />
      </div>

      <WriteNoteModal
        isOpen={isNoteModalOpen}
        onClose={handleNoteClose}
        onConfirm={handleNoteConfirm}
      />

      {selectedReport && selectedReportDetails && (
        <ReportDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedReport(null);
            setSelectedReportDetails(null);
          }}
          reportType={selectedReport.type as ReportType}
          reportData={{
            associatedUser: {
              name: selectedReportDetails.reportedUser?.name || "Unknown",
              id: selectedReportDetails.reportedUser?.id || "N/A",
              avatar: selectedReportDetails.reportedUser?.avatar,
              isBanned: selectedReportDetails.reportedUser?.isBanned || false,
              isDeactivated:
                selectedReportDetails.reportedUser?.isDeactivated || false,
            },
            status: selectedReport.status as ReportStatus,
            reason: selectedReport.reason,
            reasonColor: "red",
            reportDate: selectedReport.reportDate,
            contentId: selectedReport.id,
            description: selectedReport.description,
            reportingUser: {
              name: selectedReportDetails.reporter?.name || "Unknown",
              id: selectedReportDetails.reporter?.id || "N/A",
              avatar: selectedReportDetails.reporter?.avatar,
            },
            content: {
              event:
                selectedReport.type === "Event"
                  ? {
                      image: selectedReportDetails.content?.image_url,
                      date: selectedReportDetails.content?.date,
                      title: selectedReportDetails.content?.name,
                      location: selectedReportDetails.content?.location,
                    }
                  : undefined,
              idea:
                selectedReport.type === "Idea"
                  ? {
                      title: selectedReportDetails.content?.title,
                      tag: selectedReportDetails.content?.looking_for || "N/A",
                      description: selectedReportDetails.content?.description,
                      ideaBy:
                        selectedReportDetails.reportedUser?.name || "Unknown",
                      avatar: selectedReportDetails.reportedUser?.avatar || "",
                    }
                  : undefined,
              space:
                selectedReport.type === "Space"
                  ? {
                      title: selectedReportDetails.content?.name,
                      description: selectedReportDetails.content?.description,
                      image: selectedReportDetails.content?.image_url,
                      category: "Other", // Placeholder
                      memberCount: "0", // Placeholder
                    }
                  : undefined,
            },
            safetyRecord: {
              banHistory: selectedReportDetails.reportedUser?.banHistory || [],
              reportHistory: [],
              blockHistory: [],
            },
          }}
          onStatusChange={(newStatus) => {
            if (selectedReport) {
              handleStatusChange(selectedReport.id, newStatus);
            }
          }}
          onNoteRequired={(newStatus) => {
            if (selectedReport) {
              handleNoteRequired(selectedReport.id, newStatus);
            }
          }}
          onDeactivateUser={() => {
            if (selectedReportDetails?.reportedUser?.id) {
              deleteStudentMutation.mutate(
                selectedReportDetails.reportedUser.id
              );
            }
          }}
          onBanUser={() => {
            if (selectedReportDetails?.reportedUser?.id) {
              setIsBanModalOpen(true);
            }
          }}
        />
      )}

      <BanUserModal
        visible={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        onConfirm={(duration, reason) => {
          if (selectedReportDetails?.reportedUser?.id) {
            let durationDays = 0;
            if (duration.includes("24 hours")) durationDays = 1;
            else if (duration.includes("7 days")) durationDays = 7;
            else if (duration.includes("30 days")) durationDays = 30;
            else if (duration.includes("Permanent")) durationDays = 36500;

            banStudentMutation.mutate({
              id: selectedReportDetails.reportedUser.id,
              duration: durationDays,
              reason,
            });
            setIsBanModalOpen(false);
          }
        }}
        userName={selectedReportDetails?.reportedUser?.name}
      />

      <FlagModal
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        onConfirm={(reason) => {
          if (selectedReport && selectedReport.reportedItemId) {
            flagMutation.mutate({
              id: selectedReport.reportedItemId,
              type: selectedReport.type,
              reason,
            });
          }
        }}
        itemName={selectedReport?.description || ""}
        type="event"
      />

      {showToast && (
        <CustomToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </main>
  );
};
