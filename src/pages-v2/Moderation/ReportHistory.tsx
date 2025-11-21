import React, { useState } from "react";
import "./ReportHistory.css";
import { AssetIcon, ExportButton, SearchInput } from "../../components-v2";

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
  const [selectedType] = useState<string>("all");
  const [selectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - historical reports that have been resolved or dismissed
  const mockHistoryReports: HistoryReportData[] = [
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
      description: "I'm concerned this person might be breaking the rules...",
      studentId: "166g...fjhsgt",
      reportDate: "Oct 7, 2025",
      type: "Idea",
      reason: "Inappropriate or offensive",
      reasonTag: "Inappropriate or offensive",
      status: "Resolved",
    },
    {
      id: "3",
      description: "I'm concerned this person might be breaking the rules...",
      studentId: "166g...fjhsgt",
      reportDate: "Oct 7, 2025",
      type: "Idea",
      reason: "Harassment / Threats",
      reasonTag: "Harassment / Threats",
      status: "Dismissed",
    },
  ];

  const filteredReports = mockHistoryReports.filter((report) => {
    const matchesSearch = report.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || report.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || report.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  const handleCopyStudentId = (studentId: string) => {
    navigator.clipboard.writeText(studentId);
  };

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

  const totalReports = mockHistoryReports.length;
  const resolvedReports = mockHistoryReports.filter(
    (r) => r.status === "Resolved"
  ).length;
  const dismissedReports = mockHistoryReports.filter(
    (r) => r.status === "Dismissed"
  ).length;

  return (
    <div className="report-history-page">
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
              <AssetIcon name="table-icon" size={30} color="#8280ff" />
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
              <AssetIcon name="stats-icon" size={30} color="#5b6168" />
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

              <div className="filter-dropdown">
                <AssetIcon name="grid-icon" size={24} color="#5b6168" />
                <span>Filter by type</span>
              </div>

              <div className="status-dropdown">
                <span>All status</span>
                <AssetIcon name="arrow-down" size={10} color="#5b6168" />
              </div>
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
            <tbody>
              {currentReports.map((report) => {
                const reasonColors = getReasonColor(report.reasonTag);
                return (
                  <tr key={report.id}>
                    <td>
                      <div className="report-description-cell">
                        <div className="report-content-wrapper">
                          <p className="report-description">
                            {report.description}
                          </p>
                          <div className="student-id-container">
                            <div className="student-id-badge">
                              {report.studentId}
                            </div>
                            <button
                              data-testid="copy-student-id-btn"
                              className="copy-button"
                              onClick={() =>
                                handleCopyStudentId(report.studentId)
                              }
                            >
                              <AssetIcon
                                name="copy-icon"
                                size={16}
                                color="#ACB6BA"
                              />
                            </button>
                          </div>
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
                      <div className="status-dropdown-cell">
                        <span>{report.status}</span>
                        <AssetIcon
                          name="arrow-down"
                          size={10}
                          color="#5b6168"
                        />
                      </div>
                    </td>
                    <td>
                      <button
                        data-testid="options-btn"
                        className="options-button"
                        aria-label="Report options"
                      >
                        <AssetIcon
                          name="vertical-3-dots-icon"
                          size={24}
                          color="#1d1b20"
                        />
                      </button>
                    </td>
                  </tr>
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
    </div>
  );
};
