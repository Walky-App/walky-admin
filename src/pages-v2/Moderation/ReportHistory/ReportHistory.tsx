import React, { useState } from "react";
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
} from "../../../components-v2";
import type { ReportType, ReportStatus } from "../../../components-v2";

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
  status: "Resolved" | "Dismissed";
}

export const ReportHistory: React.FC = () => {
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

  // Mock data - historical reports that have been resolved or dismissed
  const [historyReports, setHistoryReports] = useState<HistoryReportData[]>([
    {
      id: "1",
      description: "I'm concerned this person might be breaking the rules...",
      studentId: "166g...fjhsgt",
      reportDate: "Oct 7, 2025",
      type: "User",
      reason: "Self-Injury / Harmful Behavior",
      reasonTag: "Self-Injury / Harmful Behavior",
      status: "Resolved",
    },
    {
      id: "2",
      description: "This event contains explicit content",
      studentId: "234h...klmnop",
      reportDate: "Oct 6, 2025",
      type: "Event",
      reason: "Explicit / Nudity / Inappropriate",
      reasonTag: "Inappropriate or offensive",
      status: "Resolved",
    },
    {
      id: "3",
      description: "Harassment messages from this user",
      studentId: "345j...qrstuv",
      reportDate: "Oct 5, 2025",
      type: "Message",
      reason: "Harassment / Threats",
      reasonTag: "Harassment / Threats",
      status: "Dismissed",
    },
    {
      id: "4",
      description: "Spam in this space",
      studentId: "456k...wxyzab",
      reportDate: "Oct 4, 2025",
      type: "Space",
      reason: "Spam, Fake Profile, or Misuse",
      reasonTag: "Spam",
      status: "Resolved",
    },
    {
      id: "5",
      description: "This idea promotes harmful behavior",
      studentId: "567l...cdefgh",
      reportDate: "Oct 3, 2025",
      type: "Idea",
      reason: "Inappropriate or offensive",
      reasonTag: "Inappropriate or offensive",
      status: "Resolved",
    },
    {
      id: "6",
      description: "Hate speech in event description",
      studentId: "678m...ijklmn",
      reportDate: "Oct 2, 2025",
      type: "Event",
      reason: "Hate Speech / Offensive",
      reasonTag: "Harassment / Threats",
      status: "Dismissed",
    },
    {
      id: "7",
      description: "Discriminatory content in space",
      studentId: "789n...opqrst",
      reportDate: "Oct 1, 2025",
      type: "Space",
      reason: "Discriminatory / Exclusionary",
      reasonTag: "Harassment / Threats",
      status: "Resolved",
    },
    {
      id: "8",
      description: "Solicitation messages",
      studentId: "890o...uvwxyz",
      reportDate: "Sep 30, 2025",
      type: "Message",
      reason: "Solicitation or sales",
      reasonTag: "Spam",
      status: "Resolved",
    },
    {
      id: "9",
      description: "Duplicate event posted",
      studentId: "901p...abcdef",
      reportDate: "Sep 29, 2025",
      type: "Event",
      reason: "Duplicate Event",
      reasonTag: "Spam",
      status: "Dismissed",
    },
    {
      id: "10",
      description: "Misinformation spread",
      studentId: "012q...ghijkl",
      reportDate: "Sep 28, 2025",
      type: "Idea",
      reason: "Misinformation (false or misleading)",
      reasonTag: "Other",
      status: "Resolved",
    },
    {
      id: "11",
      description: "Unsafe behavior reported",
      studentId: "123r...mnopqr",
      reportDate: "Sep 27, 2025",
      type: "User",
      reason: "Unsafe or harmful behavior",
      reasonTag: "Self-Injury / Harmful Behavior",
      status: "Resolved",
    },
    {
      id: "12",
      description: "Inappropriate content in space",
      studentId: "234s...stuvwx",
      reportDate: "Sep 26, 2025",
      type: "Space",
      reason: "Inappropriate or offensive",
      reasonTag: "Inappropriate or offensive",
      status: "Dismissed",
    },
  ]);

  const handleStatusChange = (reportId: string, newStatus: string) => {
    setHistoryReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId
          ? { ...report, status: newStatus as HistoryReportData["status"] }
          : report
      )
    );
  };

  const handleNoteRequired = (reportId: string, newStatus: string) => {
    setPendingStatusChange({ reportId, newStatus });
    setIsNoteModalOpen(true);
  };

  const handleNoteConfirm = (note: string) => {
    if (pendingStatusChange) {
      handleStatusChange(
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

  const filteredReports = historyReports.filter((report) => {
    const matchesSearch = report.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(report.type);
    const matchesStatus =
      selectedStatus === "all" || report.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

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

  const totalReports = historyReports.length;
  const resolvedReports = historyReports.filter(
    (r) => r.status === "Resolved"
  ).length;
  const dismissedReports = historyReports.filter(
    (r) => r.status === "Dismissed"
  ).length;

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
        <div className="stats-card">
          <div className="stats-card-header">
            <h3 className="stats-card-title">History total</h3>
            <div className="stats-card-icon" style={{ background: "#e5e4ff" }}>
              <AssetIcon name="mod-table-icon" size={30} color="#8280FF" />
            </div>
          </div>
          <p className="stats-card-value">{totalReports}</p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <h3 className="stats-card-title">Resolved</h3>
            <div className="stats-card-icon" style={{ background: "#e9fcf4" }}>
              <AssetIcon name="check-icon" size={30} color="#00c48c" />
            </div>
          </div>
          <p className="stats-card-value">{resolvedReports}</p>
        </div>

        <div className="stats-card">
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
          <p className="stats-card-value">{dismissedReports}</p>
        </div>
      </div>

      {/* Reports Container */}
      <div className="reports-container">
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
              {currentReports.map((report, index) => {
                const reasonColors = getReasonColor(report.reasonTag);
                return (
                  <React.Fragment key={report.id}>
                    <tr>
                      <td>
                        <div className="report-description-cell">
                          <div className="report-content-wrapper">
                            <p className="report-description">
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
                          testId="report-history-options"
                          items={[
                            {
                              label: "View details",
                              onClick: (e) => {
                                e.stopPropagation();
                                setSelectedReport(report);
                                setIsDetailModalOpen(true);
                              },
                            },
                            {
                              label: "Export",
                              onClick: (e) => {
                                e.stopPropagation();
                                console.log("Export report", report);
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
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <p className="pagination-info">
            Showing {startIndex + 1} of {filteredReports.length} entries
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
              disabled={currentPage === totalPages || totalPages === 0}
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
          onDeactivateUser={() => console.log("Deactivate user")}
          onBanUser={() => console.log("Ban user")}
        />
      )}
    </main>
  );
};
