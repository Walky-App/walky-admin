import React, { useState, useEffect } from "react";
import "./ReportHistory.css";
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
} from "../../../components-v2";
import type { ReportType, ReportStatus } from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import { apiClient } from "../../../API";

interface HistoryReportData {
  id: string;
  description: string;
  studentId: string;
  reportDate: string;
  type: "Event" | "Message" | "User" | "Space" | "Idea";
  reason: string;
  reasonTag:
  | "Self-Injury / Harmful Behavior"
  | "Inappropriate or offensive"
  | "Harassment / Threats"
  | "Spam"
  | "Other";
  status: "Resolved" | "Dismissed" | "Pending review";
}

export const ReportHistory: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    reportId: string;
    newStatus: string;
  } | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] =
    useState<HistoryReportData | null>(null);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    dismissed: 0,
  });

  // Reports state
  const [historyReports, setHistoryReports] = useState<HistoryReportData[]>([]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await apiClient.api.adminV2ReportsStatsList() as any;
      setStats({
        total: statsRes.data.total || 0,
        resolved: statsRes.data.resolved || 0,
        dismissed: statsRes.data.dismissed || 0,
      });

      // Fetch reports
      const reportsRes = await apiClient.api.adminV2ReportsList({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        type: selectedTypes.length > 0 ? selectedTypes.join(',') : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      } as any) as any;

      const reports = reportsRes.data.data || [];

      // Transform API data to component format
      const transformedReports = reports.map((r: any) => ({
        id: r.id,
        description: r.description || "No description",
        studentId: r.studentId || "Unknown",
        reportDate: new Date(r.reportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: r.type as any,
        reason: r.reason || "Unknown",
        reasonTag: r.reasonTag as any || "Other",
        status: r.status as any,
      }));

      setHistoryReports(transformedReports);

    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [currentPage, searchQuery, selectedTypes, selectedStatus]);

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      // If reopening, change status to "Pending review" which will move it to Report & Safety
      const statusToSend = newStatus === "Reopen" ? "Pending review" : newStatus;

      await apiClient.api.adminV2ReportsStatusPartialUpdate(reportId, {
        status: statusToSend
      });

      // Update local state
      setHistoryReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId
            ? {
              ...report,
              status: statusToSend as HistoryReportData["status"],
            }
            : report
        )
      );

      // Refresh stats
      const statsRes = await apiClient.api.adminV2ReportsStatsList() as any;
      setStats({
        total: statsRes.data.total || 0,
        resolved: statsRes.data.resolved || 0,
        dismissed: statsRes.data.dismissed || 0,
      });

    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleNoteRequired = (reportId: string, newStatus: string) => {
    setPendingStatusChange({ reportId, newStatus });
    setIsNoteModalOpen(true);
  };

  const handleNoteConfirm = async (note: string) => {
    if (pendingStatusChange) {
      try {
        // Save note first
        await apiClient.api.adminV2ReportsNoteCreate(pendingStatusChange.reportId, { note } as any);

        // Then update status
        await handleStatusChange(
          pendingStatusChange.reportId,
          pendingStatusChange.newStatus
        );
        console.log("Note saved:", note);
      } catch (error) {
        console.error("Failed to save note:", error);
      } finally {
        setPendingStatusChange(null);
      }
    }
  };

  const handleNoteClose = () => {
    setIsNoteModalOpen(false);
    setPendingStatusChange(null);
  };

  // Filter logic is now handled by API, but we keep this for client-side filtering if needed
  // or for filtering out "Pending review" if API returns them
  const filteredReports = historyReports.filter((report) => {
    if (report.status === "Pending review") {
      return false;
    }
    return true;
  });

  // Pagination is now handled by API, so we don't slice here if API returns paginated data
  // But since we are fetching per page, we just use the data as is.
  // However, the original code used client-side pagination on a full list.
  // We'll assume the API returns the correct page.
  const currentReports = filteredReports;
  // Note: totalPages calculation needs total count from API
  // For now, we'll assume infinite scroll or just basic next/prev
  const totalPages = Math.ceil(stats.total / itemsPerPage);

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case "Self-Injury / Harmful Behavior":
        return { bg: "#ffe5e4", text: "#a4181a" };
      case "Inappropriate or offensive":
        return { bg: "#fff4e4", text: "#8f5400" };
      case "Harassment / Threats":
        return { bg: "#ffe2fa", text: "#91127c" };
      case "Spam":
        return { bg: "#fff3d6", text: "#8f5400" };
      default:
        return { bg: "#f4f5f7", text: "#676d70" };
    }
  };

  const handleDeactivateUser = async () => {
    if (selectedReport) {
      try {
        await apiClient.api.adminV2StudentsDelete(selectedReport.studentId);
        console.log("User deactivated:", selectedReport.studentId);
        // Refresh reports
        fetchReports();
      } catch (error) {
        console.error("Failed to deactivate user:", error);
      }
    }
  };

  const handleBanUser = async (duration: string, reason: string, resolveReports: boolean) => {
    if (selectedReport) {
      try {
        // Parse duration
        let durationDays = 0;
        if (duration.includes("24 hours")) durationDays = 1;
        else if (duration.includes("3 days")) durationDays = 3;
        else if (duration.includes("7 days")) durationDays = 7;
        else if (duration.includes("30 days")) durationDays = 30;
        else if (duration.includes("Permanent")) durationDays = 36500;

        await apiClient.api.adminV2ReportsBanUserCreate(selectedReport.id, {
          reason,
          duration: durationDays
        });

        if (resolveReports) {
          await handleStatusChange(selectedReport.id, "Resolved");
        }

        console.log("User banned:", selectedReport.studentId);
        // Refresh reports
        fetchReports();
      } catch (error) {
        console.error("Failed to ban user:", error);
      }
    }
  };

  return (
    <main className="report-history-page">
      {/* Info Banner */}
      <div className="info-banner">
        <div className="info-banner-content">
          <div className="info-icon-wrapper">
            <AssetIcon name="tooltip-icon" size={24} color="#546fd9" />
          </div>
          <div className="info-text">
            <h2 className="info-title">Need Direct Support?</h2>
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
            <h3 className="stats-card-title">History total</h3>
            <div className="stats-card-icon" style={{ background: "#e5e4ff" }}>
              <AssetIcon name="mod-table-icon" size={30} color="#8280FF" />
            </div>
          </div>
          <p className="stats-card-value">{loading ? "..." : stats.total}</p>
        </div>

        <div className={`stats-card ${theme.isDark ? "dark-mode" : ""}`}>
          <div className="stats-card-header">
            <h3 className="stats-card-title">Resolved</h3>
            <div className="stats-card-icon" style={{ background: "#e9fcf4" }}>
              <AssetIcon name="check-icon" size={30} color="#00c48c" />
            </div>
          </div>
          <p className="stats-card-value">{loading ? "..." : stats.resolved}</p>
        </div>

        <div className={`stats-card ${theme.isDark ? "dark-mode" : ""}`}>
          <div className="stats-card-header">
            <h3 className="stats-card-title">Dismissed</h3>
            <div className="stats-card-icon" style={{ background: "#eef0f1" }}>
              <AssetIcon
                name="mod-empty-table-icon"
                size={30}
                color="#5b6168"
              />
            </div>
          </div>
          <p className="stats-card-value">{loading ? "..." : stats.dismissed}</p>
        </div>
      </div>

      {/* Reports Container */}
      <div className={`reports-container ${theme.isDark ? "dark-mode" : ""}`}>
        <div className="reports-header">
          <div className="reports-title-section">
            <h2 className="reports-title">
              History of reported users & content
            </h2>
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
                  { value: "all", label: "All status" },
                  { value: "Pending review", label: "Pending review" },
                  { value: "Under evaluation", label: "Under evaluation" },
                  { value: "Resolved", label: "Resolved" },
                  { value: "Dismissed", label: "Dismissed" },
                ]}
                placeholder="All status"
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
                <th>Report description</th>
                <th>
                  <div className="sortable-header">
                    Report date
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
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Loading...</td>
                </tr>
              ) : currentReports.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No reports found</td>
                </tr>
              ) : (
                currentReports.map((report, index) => {
                  const reasonColors = getReasonColor(report.reasonTag);
                  return (
                    <React.Fragment key={report.id}>
                      <tr>
                        <td>
                          <div className="report-description-cell">
                            <div className="report-content-wrapper">
                              <p
                                className="report-description"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setIsDetailModalOpen(true);
                                }}
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
                            {report.reasonTag.split("/").map((line, idx) => (
                              <span key={idx}>
                                {line}
                                {idx === 0 &&
                                  report.reasonTag.includes("/") &&
                                  " /"}
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
                            options={["Reopen"]}
                            testId={`status-dropdown-${report.id}`}
                          />
                        </td>
                        <td>
                          <ActionDropdown
                            testId="report-history-options"
                            items={[
                              {
                                label: "Report details",
                                onClick: (e) => {
                                  e.stopPropagation();
                                  setSelectedReport(report);
                                  setIsDetailModalOpen(true);
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
                      {index < currentReports.length - 1 && (
                        <tr className="report-divider-row">
                          <td colSpan={5}>
                            <Divider />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <p className="pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1} of {stats.total} entries
          </p>
          <div className="pagination-controls">
            <button
              data-testid="pagination-prev-btn"
              className="pagination-button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <div className="pagination-page-number active">{currentPage}</div>
            <button
              data-testid="pagination-next-btn"
              className="pagination-button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <WriteNoteModal
        isOpen={isNoteModalOpen}
        onClose={handleNoteClose}
        onConfirm={handleNoteConfirm}
      />

      {selectedReport && (
        <ReportDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedReport(null);
          }}
          reportType={selectedReport.type as ReportType}
          reportData={{
            associatedUser: {
              name: "Austin",
              id: "166g...fjhsgt",
              avatar:
                "https://www.figma.com/api/mcp/asset/e83b2a68-fa91-4f81-99c7-4d3b01197ac8",
              isBanned: false,
              isDeactivated: false,
            },
            status: selectedReport.status as ReportStatus,
            reason: selectedReport.reason,
            reasonColor: "red",
            reportDate: selectedReport.reportDate,
            contentId: selectedReport.id,
            description: selectedReport.description,
            reportingUser: {
              name: "Jackie",
              id: "166g...fjhsgt",
              avatar:
                "https://www.figma.com/api/mcp/asset/16f9b692-7d5e-4cff-b5dd-d15f87a0d1fc",
            },
            content: {
              event:
                selectedReport.type === "Event"
                  ? {
                    image:
                      "https://www.figma.com/api/mcp/asset/faaf4e36-54ea-43fd-a9db-64987f8b6a57",
                    date: "FEB 12, 2025 | 2:00 PM",
                    title: "4v4 Basketball game",
                    location: "S. Campus Basketball Courts",
                  }
                  : undefined,
              space:
                selectedReport.type === "Space"
                  ? {
                    image:
                      "https://www.figma.com/api/mcp/asset/faaf4e36-54ea-43fd-a9db-64987f8b6a57",
                    title: "Sisters of Unity",
                    description: "Strength in sisterhood, power in unity.",
                    category: "Sororities",
                    memberCount: "1-10 Members",
                  }
                  : undefined,
              idea:
                selectedReport.type === "Idea"
                  ? {
                    title: "Children's App",
                    tag: "Looking For",
                    description:
                      "Marketing Junior year, Design students, and all business majors interested in a ne...",
                    ideaBy: "You",
                    avatar: "https://via.placeholder.com/24",
                  }
                  : undefined,
              message:
                selectedReport.type === "Message"
                  ? {
                    text: "top bothering me, you're annoying",
                    timestamp: "Oct 7, 2025 - 12:45",
                  }
                  : undefined,
            },
            safetyRecord: {
              banHistory: [
                {
                  duration: "3 Day ban",
                  reason: "Spam",
                  bannedOn: "Banned on Oct 07, 2025 - 12:14",
                  bannedBy: "Admin Name",
                },
              ],
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
          onDeactivateUser={handleDeactivateUser}
          onBanUser={handleBanUser}
        />
      )}

      <FlagModal
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        onConfirm={(reason) => {
          console.log("Flag report:", selectedReport?.id, "Reason:", reason);
          setIsFlagModalOpen(false);
        }}
        itemName={selectedReport?.description || ""}
        type="event"
      />
    </main>
  );
};
