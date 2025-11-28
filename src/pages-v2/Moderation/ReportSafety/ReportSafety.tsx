import React, { useState } from "react";
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
} from "../../../components-v2";
import type { ReportType, ReportStatus } from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";

interface ReportData {
  id: string;
  description: string;
  studentId: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    reportId: string;
    newStatus: string;
  } | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);

  // Mock data
  const [reports, setReports] = useState<ReportData[]>([
    {
      id: "1",
      description: "I'm concerned this person might be breaking the rules...",
      studentId: "166g...fjhsgt",
      reportDate: "Oct 7, 2025",
      type: "Event",
      reason: "Harmful / Unsafe Behavior",
      reasonTag: "Harmful / Unsafe Behavior",
      status: "Pending review",
      isFlagged: true,
    },
    {
      id: "2",
      description: "This event contains inappropriate content",
      studentId: "234h...klmnop",
      reportDate: "Oct 6, 2025",
      type: "Event",
      reason: "Explicit / Nudity / Inappropriate",
      reasonTag: "Harmful / Unsafe Behavior",
      status: "Under evaluation",
      isFlagged: false,
    },
    {
      id: "3",
      description: "Spam messages in this space",
      studentId: "345j...qrstuv",
      reportDate: "Oct 5, 2025",
      type: "Space",
      reason: "Spam, Fake Profile, or Misuse",
      reasonTag: "Spam",
      status: "Pending review",
      isFlagged: true,
    },
    {
      id: "5",
      description: "I'm concerned this person might be breaking the rules...",
      studentId: "166g...fjhsgt",
      reportDate: "Oct 7, 2025",
      type: "Message",
      reason: "Made Me Uncomfortable",
      reasonTag: "Made Me Uncomfortable",
      status: "Under evaluation",
      isFlagged: false,
    },
    {
      id: "6",
      description: "Received threatening messages from this user",
      studentId: "567l...cdefgh",
      reportDate: "Oct 3, 2025",
      type: "Message",
      reason: "Harassment / Threats",
      reasonTag: "Harassment",
      status: "Pending review",
      isFlagged: true,
    },
    {
      id: "7",
      description: "This idea contains hate speech",
      studentId: "678m...ijklmn",
      reportDate: "Oct 2, 2025",
      type: "Event",
      reason: "Hate Speech / Offensive",
      reasonTag: "Harmful / Unsafe Behavior",
      status: "Under evaluation",
      isFlagged: false,
    },
    {
      id: "8",
      description: "Duplicate event posted multiple times",
      studentId: "789n...opqrst",
      reportDate: "Oct 1, 2025",
      type: "Event",
      reason: "Duplicate Event",
      reasonTag: "Spam",
      status: "Pending review",
      isFlagged: true,
    },
    {
      id: "10",
      description: "False information being spread in this space",
      studentId: "901p...abcdef",
      reportDate: "Sep 29, 2025",
      type: "Space",
      reason: "Misinformation (false or misleading)",
      reasonTag: "Harmful / Unsafe Behavior",
      status: "Under evaluation",
      isFlagged: true,
    },
    {
      id: "11",
      description: "This idea contains inappropriate content",
      studentId: "102q...rstuvw",
      reportDate: "Sep 28, 2025",
      type: "Idea",
      reason: "Inappropriate or offensive",
      reasonTag: "Harmful / Unsafe Behavior",
      status: "Pending review",
      isFlagged: false,
    },
  ]);

  const handleStatusChange = (reportId: string, newStatus: string) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId
          ? { ...report, status: newStatus as ReportData["status"] }
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

  const filteredReports = reports.filter((report) => {
    // Exclude Resolved and Dismissed from Report & Safety
    if (report.status === "Resolved" || report.status === "Dismissed") {
      return false;
    }
    const matchesSearch = report.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(report.type);
    const matchesStatus =
      selectedStatus === "all" || report.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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

  const totalReports = reports.filter(
    (r) => r.status !== "Resolved" && r.status !== "Dismissed"
  ).length;
  const pendingReports = reports.filter(
    (r) => r.status === "Pending review"
  ).length;
  const underEvaluationReports = reports.filter(
    (r) => r.status === "Under evaluation"
  ).length;

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
                  { value: "all", label: "All status" },
                  { value: "Pending review", label: "Pending review" },
                  { value: "Under evaluation", label: "Under evaluation" },
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
              {filteredReports.map((report, index) => {
                const reasonColors = getReasonColor(report.reasonTag);
                return (
                  <React.Fragment key={report.id}>
                    <tr className={report.isFlagged ? "flagged-row" : ""}>
                      <td>
                        <div className="report-description-cell">
                          {report.isFlagged && (
                            <div className="flag-icon-wrapper">
                              <AssetIcon
                                name="flag-icon"
                                size={16}
                                color="#d32f2f"
                              />
                            </div>
                          )}
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
                    {index < filteredReports.length - 1 &&
                      !report.isFlagged && (
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
                      title: "New Campus Initiative",
                      tag: "Campus Life",
                      description: "A proposal to improve student engagement",
                      ideaBy: "Austin",
                      avatar:
                        "https://www.figma.com/api/mcp/asset/e83b2a68-fa91-4f81-99c7-4d3b01197ac8",
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
