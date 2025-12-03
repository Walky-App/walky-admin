import React from "react";
import { CModal, CModalHeader, CModalBody, CButton } from "@coreui/react";
import { CopyableId } from "../CopyableId";
import { useTheme } from "../../hooks/useTheme";
import "./ReportDetailsModal.css";

interface Report {
  id: string;
  reportedItemName: string;
  reportId: string;
  reason: string;
  reasonTag: string;
  description: string;
  reportedOn: string;
  reportedBy: string;
  status: "pending" | "reviewed" | "resolved";
}

interface ReportDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  reportType: string;
  reports: Report[];
  totalCount: number;
  period: string;
  loading?: boolean;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  visible,
  onClose,
  reportType,
  reports,
  totalCount,
  period,
  loading,
}) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#ebb129";
      case "reviewed":
        return "#4379ee";
      case "resolved":
        return "#00c943";
      default:
        return "#676d70";
    }
  };

  const getReasonTagColor = (reason: string) => {
    const lowerReason = reason.toLowerCase();
    if (lowerReason.includes("harassment") || lowerReason.includes("threats")) {
      return { bg: "#ffe9f5", text: "#ba0066" };
    }
    if (
      lowerReason.includes("intellectual") ||
      lowerReason.includes("property")
    ) {
      return { bg: "#fff3d6", text: "#8f5400" };
    }
    if (lowerReason.includes("spam")) {
      return { bg: "#ffe9e9", text: "#ba0000" };
    }
    return { bg: "#f4f5f7", text: "#676d70" };
  };

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      alignment="center"
      backdrop={true}
      className="report-details-modal"
      size="lg"
    >
      <CModalHeader closeButton>
        <div className="modal-header-content">
          <h3 style={{ color: theme.colors.bodyColor }}>Report history</h3>
          <p style={{ color: theme.colors.textMuted }}>
            Reported {reportType.toLowerCase()}: <strong>{totalCount}</strong>{" "}
            in {period}
          </p>
        </div>
      </CModalHeader>

      <CModalBody
        style={{
          backgroundColor: theme.colors.cardBg,
        }}
      >
        {/* Reports List */}
        <div className="reports-list-container">
          <div className="reports-list">
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px", color: theme.colors.textMuted }}>
                Loading...
              </div>
            ) : reports.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: theme.colors.textMuted }}>
                No reports found
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="report-item"
                  style={{
                    backgroundColor: theme.colors.cardBg,
                    borderColor: theme.colors.borderColor,
                  }}
                >
                  {/* Status Badge */}
                  <div
                    className="report-status-badge"
                    style={{
                      backgroundColor: `${getStatusColor(report.status)}20`,
                      color: getStatusColor(report.status),
                    }}
                  >
                    {report.status.charAt(0).toUpperCase() +
                      report.status.slice(1)}
                  </div>

                  {/* Reported Item */}
                  <div className="report-field">
                    <span
                      className="report-field-label"
                      style={{ color: theme.colors.bodyColor }}
                    >
                      Reported {reportType.toLowerCase().slice(0, -1)}:
                    </span>
                    <a
                      href="#"
                      className="report-field-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      {report.reportedItemName}
                    </a>
                  </div>

                  {/* Report ID */}
                  <div className="report-field">
                    <span
                      className="report-field-label"
                      style={{ color: theme.colors.bodyColor }}
                    >
                      Report ID:
                    </span>
                    <CopyableId
                      id={report.reportId}
                      label="Report ID"
                      variant="secondary"
                      size="small"
                      iconSize={14}
                      iconColor="#acb6ba"
                      testId="copy-report-id"
                    />
                  </div>

                  {/* Reason */}
                  <div className="report-field">
                    <span
                      className="report-field-label"
                      style={{ color: theme.colors.bodyColor }}
                    >
                      Reason
                    </span>
                    <span
                      className="reason-tag"
                      style={{
                        backgroundColor: getReasonTagColor(report.reasonTag).bg,
                        color: getReasonTagColor(report.reasonTag).text,
                      }}
                    >
                      {report.reasonTag}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="report-field">
                    <span
                      className="report-field-label"
                      style={{ color: theme.colors.bodyColor }}
                    >
                      Description:
                    </span>
                    <p
                      className="report-description"
                      style={{ color: theme.colors.bodyColor }}
                    >
                      {report.description}
                    </p>
                  </div>

                  {/* Reported On */}
                  <div className="report-footer">
                    <p
                      className="report-footer-text"
                      style={{ color: theme.colors.textMuted }}
                    >
                      Reported on {report.reportedOn} by {report.reportedBy}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CModalBody>

      {/* Footer outside body */}
      <div className="custom-modal-footer">
        <CButton
          color="light"
          onClick={onClose}
          className="close-button"
          style={{
            backgroundColor: theme.colors.cardBg,
            border: `1px solid ${theme.colors.borderColor}`,
            color: theme.colors.bodyColor,
          }}
        >
          Close
        </CButton>
      </div>
    </CModal>
  );
};

export default ReportDetailsModal;
