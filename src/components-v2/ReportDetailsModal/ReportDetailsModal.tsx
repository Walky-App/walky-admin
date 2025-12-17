import React from "react";
import { CModal, CModalHeader, CModalBody, CButton } from "@coreui/react";
import { CopyableId } from "../CopyableId";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import {
  formatChipLabel,
  getUserReasonChipStyle,
  getEventReasonChipStyle,
  getIdeaReasonChipStyle,
  getSpaceReasonChipStyle,
  getStatusChipStyle,
} from "../utils/chipStyles";
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
  status: string;
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

  const getReasonStyleByType = (reason: string) => {
    const type = reportType.toLowerCase();
    if (type.includes("event")) return getEventReasonChipStyle(reason);
    if (type.includes("idea")) return getIdeaReasonChipStyle(reason);
    if (type.includes("space")) return getSpaceReasonChipStyle(reason);
    return getUserReasonChipStyle(reason);
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
        <div className="reports-list-container">
          <div className="reports-list">
            {loading ? (
              <>
                {[1, 2, 3].map((idx) => (
                  <div
                    key={`report-skeleton-${idx}`}
                    className="report-item skeleton"
                    style={{
                      backgroundColor: theme.colors.cardBg,
                      borderColor: theme.colors.borderColor,
                    }}
                  >
                    <div className="report-status-badge skeleton-badge">
                      <SkeletonLoader
                        width="110px"
                        height="20px"
                        borderRadius="999px"
                      />
                    </div>

                    <div className="skeleton-line-group">
                      <SkeletonLoader width="140px" height="14px" />
                      <SkeletonLoader width="220px" height="18px" />
                    </div>

                    <div className="skeleton-line-group">
                      <SkeletonLoader width="110px" height="14px" />
                      <SkeletonLoader
                        width="150px"
                        height="22px"
                        borderRadius="10px"
                      />
                    </div>

                    <div className="skeleton-line-group">
                      <SkeletonLoader width="120px" height="14px" />
                      <SkeletonLoader
                        width="100%"
                        height="42px"
                        borderRadius="10px"
                      />
                    </div>

                    <div className="report-footer">
                      <SkeletonLoader width="45%" height="12px" />
                    </div>
                  </div>
                ))}
              </>
            ) : reports.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: theme.colors.textMuted,
                }}
              >
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
                  {(() => {
                    const statusStyle = getStatusChipStyle(report.status);
                    return (
                      <div
                        className="report-status-badge"
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          padding: statusStyle.padding || undefined,
                        }}
                      >
                        {statusStyle.label}
                      </div>
                    );
                  })()}

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
                      variant="primary"
                      size="small"
                      iconSize={14}
                      iconColor="#6366F1"
                      testId="copy-report-id"
                    />
                  </div>

                  <div className="report-field">
                    <span
                      className="report-field-label"
                      style={{ color: theme.colors.bodyColor }}
                    >
                      Reason
                    </span>
                    {(() => {
                      const reasonStyle = getReasonStyleByType(
                        report.reasonTag
                      );
                      return (
                        <span
                          className="reason-tag"
                          style={{
                            backgroundColor: reasonStyle.bg,
                            color: reasonStyle.text,
                            padding: reasonStyle.padding || undefined,
                          }}
                        >
                          {reasonStyle.label ||
                            formatChipLabel(report.reasonTag)}
                        </span>
                      );
                    })()}
                  </div>

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
