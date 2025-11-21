import React, { useState } from "react";
import "./ReportSafety.css";
import {
  AssetIcon,
  ExportButton,
  SearchInput,
  CopyableId,
  ActionDropdown,
} from "../../components-v2";

interface ReportData {
  id: string;
  description: string;
  studentId: string;
  reportDate: string;
  type: "Event" | "Message" | "User" | "Space";
  reason: string;
  reasonTag:
    | "Harmful / Unsafe Behavior"
    | "Made Me Uncomfortable"
    | "Spam"
    | "Harassment";
  status: "Pending review" | "Under evaluation" | "Resolved";
  isFlagged?: boolean;
}

export const ReportSafety: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType] = useState<string>("all");
  const [selectedStatus] = useState<string>("all");

  // Mock data
  const mockReports: ReportData[] = [
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
      description: "I'm concerned this person might be breaking the rules...",
      studentId: "166g...fjhsgt",
      reportDate: "Oct 7, 2025",
      type: "Message",
      reason: "Made Me Uncomfortable",
      reasonTag: "Made Me Uncomfortable",
      status: "Under evaluation",
      isFlagged: false,
    },
  ];

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch = report.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || report.type === selectedType;
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

  const totalReports = mockReports.length;
  const pendingReports = mockReports.filter(
    (r) => r.status === "Pending review"
  ).length;
  const underEvaluationReports = mockReports.filter(
    (r) => r.status === "Under evaluation"
  ).length;

  return (
    <div className="report-safety-page">
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
        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Total</p>
            <div className="stats-card-icon" style={{ background: "#e5e4ff" }}>
              <AssetIcon name="stats-icon" size={30} color="#8280FF" />
            </div>
          </div>
          <p className="stats-card-value">{totalReports}</p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Pending review</p>
            <div className="stats-card-icon" style={{ background: "#eef0f1" }}>
              <AssetIcon name="flag-icon" size={30} color="#5b6168" />
            </div>
          </div>
          <p className="stats-card-value">{pendingReports}</p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <p className="stats-card-title">Under evaluation</p>
            <div className="stats-card-icon" style={{ background: "#fff3d6" }}>
              <AssetIcon name="search-icon" size={30} color="#ebb129" />
            </div>
          </div>
          <p className="stats-card-value">{underEvaluationReports}</p>
        </div>
      </div>

      {/* Reports Table Container */}
      <div className="reports-container">
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
            <tbody>
              {filteredReports.map((report) => {
                const reasonColors = getReasonColor(report.reasonTag);
                return (
                  <tr
                    key={report.id}
                    className={report.isFlagged ? "flagged-row" : ""}
                  >
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
                            {idx === 0 && "/"}
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
                      <ActionDropdown
                        testId="report-options"
                        items={[
                          {
                            label: "View details",
                            onClick: (e) => {
                              e.stopPropagation();
                              console.log("View report", report);
                            },
                          },
                          {
                            label: "Resolve",
                            onClick: (e) => {
                              e.stopPropagation();
                              console.log("Resolve report", report);
                            },
                          },
                          {
                            label: "Dismiss",
                            onClick: (e) => {
                              e.stopPropagation();
                              console.log("Dismiss report", report);
                            },
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
