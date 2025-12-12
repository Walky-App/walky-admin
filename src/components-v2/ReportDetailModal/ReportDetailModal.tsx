import React, { useState } from "react";
import { CModal, CModalBody } from "@coreui/react";
import "./ReportDetailModal.css";
import AssetIcon from "../AssetIcon/AssetIcon";
import { CopyableId } from "../CopyableId/CopyableId";
import { StatusDropdown } from "../StatusDropdown/StatusDropdown";
import { DeactivateUserModal } from "../DeactivateUserModal/DeactivateUserModal";
import { BanUserModal } from "../BanUserModal/BanUserModal";

export type ReportType =
  | "Event"
  | "Event of Space"
  | "Space"
  | "Idea"
  | "Message"
  | "User";
export type ReportStatus =
  | "Pending review"
  | "Under evaluation"
  | "Resolved"
  | "Dismissed";
export type SafetyTab = "ban" | "report" | "block";

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: ReportType;
  reportData: {
    // Associated User
    associatedUser: {
      name: string;
      id: string;
      avatar: string;
      email?: string;
      isDeactivated?: boolean;
      isBanned?: boolean;
    };

    // Report Details
    status: ReportStatus;
    reason: string;
    reasonColor: "red" | "purple" | "orange";
    reportDate: string;
    contentId: string;
    description: string;
    reportingUser: {
      name: string;
      id: string;
      avatar: string;
    };

    // Content Details (varies by type)
    content: {
      // Event
      event?: {
        image: string;
        date: string;
        title: string;
        location: string;
      };
      // Space
      space?: {
        image: string;
        title: string;
        description: string;
        category: string;
        memberCount: string;
      };
      // Idea
      idea?: {
        title: string;
        tag: string;
        description: string;
        ideaBy: string;
        avatar: string;
      };
      // Message
      message?: {
        text: string;
        timestamp: string;
      };
    };

    // Safety Record
    safetyRecord: {
      banHistory: Array<{
        duration: string;
        reason: string;
        bannedOn: string;
        bannedBy: string;
        expiresIn?: string;
      }>;
      reportHistory: Array<{
        reportedContent: string;
        reportId: string;
        reason: string;
        reasonColor: "red" | "purple" | "orange";
        description: string;
        reportedOn: string;
        reportedBy: string;
        status: ReportStatus;
      }>;
      blockHistory: Array<{
        name: string;
        avatar: string;
        blockedOn: string;
      }>;
    };
  };
  onStatusChange?: (newStatus: ReportStatus) => void;
  onNoteRequired?: (newStatus: ReportStatus) => void;
  onDeactivateUser?: () => void;
  onBanUser?: (
    duration: string,
    reason: string,
    resolveReports: boolean
  ) => void;
  isLoading?: boolean;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  isOpen,
  onClose,
  reportType,
  reportData,
  onStatusChange,
  onNoteRequired,
  onDeactivateUser,
  onBanUser,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<SafetyTab>("ban");
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isEmailCopied, setIsEmailCopied] = useState(false);

  const handleDeactivateUser = () => {
    setIsDeactivateModalOpen(true);
  };

  const handleBanUser = () => {
    setIsBanModalOpen(true);
  };

  const handleDeactivateConfirm = () => {
    if (onDeactivateUser) {
      onDeactivateUser();
    }
    setIsDeactivateModalOpen(false);
  };

  const handleBanConfirm = (
    duration: string,
    reason: string,
    resolveReports: boolean
  ) => {
    if (onBanUser) {
      onBanUser(duration, reason, resolveReports);
    }
    setIsBanModalOpen(false);
  };

  const renderReasonChip = (
    reason: string,
    color: "red" | "purple" | "orange"
  ) => {
    const colorClasses = {
      red: "reason-chip-red",
      purple: "reason-chip-purple",
      orange: "reason-chip-orange",
    };

    return <div className={`reason-chip ${colorClasses[color]}`}>{reason}</div>;
  };

  const formatEmail = (email?: string) => {
    if (!email) return "";

    const MAX_LENGTH = 32;
    if (email.length <= MAX_LENGTH) {
      return email;
    }

    const atIndex = email.indexOf("@");

    if (atIndex === -1) {
      return `${email.slice(0, 12)}...${email.slice(-10)}`;
    }

    const localPart = email.slice(0, atIndex);
    const domainPart = email.slice(atIndex);

    const trimmedLocal = localPart.slice(0, 12);
    const trimmedDomain =
      domainPart.length > 16 ? domainPart.slice(-16) : domainPart;

    return `${trimmedLocal}...${trimmedDomain}`;
  };

  const handleCopyEmail = (email?: string) => {
    if (!email) return;

    navigator.clipboard.writeText(email);
    setIsEmailCopied(true);

    setTimeout(() => {
      setIsEmailCopied(false);
    }, 2000);
  };

  const renderContentDetails = () => {
    const { content } = reportData;

    if (reportType === "Event" && content.event) {
      return (
        <div className="content-details-section">
          <h3 className="rdm-section-title">Content details</h3>
          <div className="content-container">
            <div className="event-card">
              <img
                src={content.event.image}
                alt="Event"
                className="event-image"
              />
              <div className="event-info">
                <p className="event-date">{content.event.date}</p>
                <h4 className="event-title">{content.event.title}</h4>
                <div className="event-location">
                  <AssetIcon name="location-icon" size={20} />
                  <span>{content.event.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (reportType === "Event of Space" && content.space && content.event) {
      return (
        <div className="content-details-section">
          <h3 className="rdm-section-title">Content details</h3>
          <div className="content-container dual-content">
            <div className="space-section">
              <h4 className="subsection-title">Space details</h4>
              <div className="space-card">
                <img
                  src={content.space.image}
                  alt="Space"
                  className="space-image"
                />
                <div className="space-info">
                  <h4 className="space-title">{content.space.title}</h4>
                  <p className="space-description">
                    {content.space.description}
                  </p>
                  <div className="space-meta">
                    <span>{content.space.category}</span>
                    <span>•</span>
                    <span>{content.space.memberCount}</span>
                  </div>
                </div>
                <AssetIcon
                  name="arrow-large-left-icon"
                  size={16}
                  className="chevron-icon"
                />
              </div>
            </div>

            <div className="divider-vertical" />

            <div className="event-section">
              <h4 className="subsection-title">Event details</h4>
              <div className="event-card-small">
                <img
                  src={content.event.image}
                  alt="Event"
                  className="event-image-small"
                />
                <div className="event-info">
                  <p className="event-date">{content.event.date}</p>
                  <h4 className="event-title">{content.event.title}</h4>
                  <div className="event-location">
                    <AssetIcon name="location-icon" size={20} />
                    <span>{content.event.location}</span>
                  </div>
                </div>
                <AssetIcon
                  name="arrow-large-left-icon"
                  size={16}
                  className="chevron-icon"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (reportType === "Space" && content.space) {
      return (
        <div className="content-details-section">
          <h3 className="rdm-section-title">Content details</h3>
          <div className="content-container">
            <div className="space-card">
              <img
                src={content.space.image}
                alt="Space"
                className="space-image"
              />
              <div className="space-info">
                <h4 className="space-title">{content.space.title}</h4>
                <p className="space-description">{content.space.description}</p>
                <div className="space-meta">
                  <span>{content.space.category}</span>
                  <span>•</span>
                  <span>{content.space.memberCount}</span>
                </div>
              </div>
              <AssetIcon
                name="arrow-large-left-icon"
                size={16}
                className="chevron-icon"
              />
            </div>
          </div>
        </div>
      );
    }

    if (reportType === "Idea" && content.idea) {
      return (
        <div className="content-details-section">
          <h3 className="rdm-section-title">Content details</h3>
          <div className="content-container">
            <div className="idea-card">
              <div className="idea-bar"></div>
              <div className="idea-content">
                <div className="idea-header">
                  <div className="idea-title-section">
                    <h4 className="idea-title">{content.idea.title}</h4>
                  </div>
                  <div className="idea-author">
                    <div className="idea-by-text">
                      <span className="idea-by-label">Idea by</span>
                      <span className="idea-by-name">
                        {content.idea.ideaBy}
                      </span>
                    </div>
                    <img
                      src={content.idea.avatar}
                      alt={content.idea.ideaBy}
                      className="idea-author-avatar"
                    />
                  </div>
                </div>
                <div className="idea-tag-section">
                  <div className="idea-tag">{content.idea.tag}</div>
                  <p className="idea-description">{content.idea.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (reportType === "Message" && content.message) {
      return (
        <div className="content-details-section">
          <h3 className="rdm-section-title">Content details</h3>
          <div className="content-container">
            <div className="message-container">
              <div className="message-bubble">
                <p className="message-text">{content.message.text}</p>
              </div>
              <p className="message-timestamp">{content.message.timestamp}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSafetyRecord = () => {
    const { banHistory, reportHistory, blockHistory } = reportData.safetyRecord;

    let content;
    if (activeTab === "ban") {
      content = banHistory.map((ban, index) => (
        <div key={index} className="safety-record-item">
          <p className="ban-duration">{ban.duration}</p>
          {ban.expiresIn && (
            <div className="ban-duration-info">
              <span className="ban-duration-label">Ban duration:</span>
              <div className="ban-duration-badge">
                {ban.duration.split(" ")[0]} Days
              </div>
              <span className="ban-expires">{ban.expiresIn}</span>
            </div>
          )}
          <p className="safety-reason">
            <span className="rdm-label">Reason:</span> {ban.reason}
          </p>
          <p className="safety-meta">
            {ban.bannedOn} by {ban.bannedBy}
          </p>
        </div>
      ));
    } else if (activeTab === "report") {
      content = reportHistory.map((report, index) => (
        <div key={index} className="safety-record-item rdm-report-item">
          <div className="rdm-report-header">
            <p className="rdm-report-content-label">
              <span className="rdm-label">
                Reported {reportType.toLowerCase()}:
              </span>{" "}
              <span className="rdm-report-content-name">
                {report.reportedContent}
              </span>
            </p>
            <div className="rdm-report-status-badge">
              <span>{report.status}</span>
              <AssetIcon name="arrow-down" size={10} />
            </div>
          </div>
          <div className="rdm-report-id-row">
            <span className="rdm-label">Report ID:</span>
            <div className="rdm-id-container">
              <div className="rdm-id-badge">{report.reportId}</div>
              <AssetIcon name="copy-icon" size={16} className="rdm-copy-icon" />
            </div>
          </div>
          <div className="rdm-report-reason-row">
            <span className="rdm-label">Reason</span>
            {renderReasonChip(report.reason, report.reasonColor)}
          </div>
          <p className="rdm-report-description">
            <span className="rdm-label">Description:</span> {report.description}
          </p>
          <p className="safety-meta">
            {report.reportedOn} by {report.reportedBy}
          </p>
        </div>
      ));
    } else if (activeTab === "block") {
      content = (
        <div className="safety-record-item">
          <p className="block-title">Blocked By</p>
          <div className="block-list">
            {blockHistory.map((block, index) => (
              <div key={index} className="block-item">
                <img
                  src={block.avatar}
                  alt={block.name}
                  className="block-avatar"
                />
                <div className="block-info">
                  <p className="block-name">{block.name}</p>
                  <p className="block-date">{block.blockedOn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="safety-record-section">
        <h3 className="rdm-section-title">User safety record</h3>
        <div className="safety-tabs">
          <button
            data-testid="safety-tab-ban"
            className={`safety-tab ${activeTab === "ban" ? "active" : ""}`}
            onClick={() => setActiveTab("ban")}
          >
            Ban history ({banHistory.length})
          </button>
          <button
            data-testid="safety-tab-report"
            className={`safety-tab ${activeTab === "report" ? "active" : ""}`}
            onClick={() => setActiveTab("report")}
          >
            Report history ({reportHistory.length})
          </button>
          <button
            data-testid="safety-tab-block"
            className={`safety-tab ${activeTab === "block" ? "active" : ""}`}
            onClick={() => setActiveTab("block")}
          >
            Block history ({blockHistory.length})
          </button>
        </div>
        <div className="safety-content">{content}</div>
      </div>
    );
  };

  const userStatusMessage = reportData.associatedUser.isBanned
    ? "This user is currently banned"
    : reportData.associatedUser.isDeactivated
    ? "This user is currently deactivated"
    : null;

  const buttonsDisabled =
    reportData.associatedUser.isBanned ||
    reportData.associatedUser.isDeactivated;

  return (
    <>
      <CModal
        visible={isOpen}
        onClose={onClose}
        size="xl"
        alignment="center"
        className="report-detail-modal"
        backdrop="static"
      >
        <CModalBody className="report-detail-modal-body">
          <button
            className="close-button"
            onClick={onClose}
            data-testid="report-detail-modal-close-btn"
            aria-label="Close modal"
          >
            <AssetIcon name="close-button" size={24} />
          </button>

          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "400px",
                fontSize: "1.2rem",
                color: "#666",
              }}
            >
              Loading report details...
            </div>
          ) : (
            <div className="modal-content-wrapper">
              {/* Associated User */}
              <div className="associated-user-section">
                <h3 className="rdm-section-title">Associated user</h3>
                <div className="user-info-container">
                  <div className="user-details">
                    <img
                      src={reportData.associatedUser.avatar}
                      alt={reportData.associatedUser.name}
                      className="rdm-user-avatar"
                    />
                    <div className="user-text">
                      <h4 className="user-name">
                        {reportData.associatedUser.name}
                      </h4>
                      {reportData.associatedUser.email && (
                        <div className="user-email-row">
                          <span
                            className="user-email"
                            title={reportData.associatedUser.email}
                          >
                            {formatEmail(reportData.associatedUser.email)}
                          </span>
                          <button
                            className="user-email-copy-btn"
                            data-testid="report-detail-email-copy-btn"
                            onClick={() =>
                              handleCopyEmail(reportData.associatedUser.email)
                            }
                            aria-label="Copy email"
                            title="Copy email"
                          >
                            <AssetIcon
                              name={
                                isEmailCopied ? "check-copy-icon" : "copy-icon"
                              }
                              size={16}
                              color="#321FDB"
                            />
                          </button>
                        </div>
                      )}
                      <CopyableId id={reportData.associatedUser.id} />
                    </div>
                  </div>

                  <div className="report-detail-user-actions">
                    <div className="report-detail-action-buttons">
                      <button
                        className="report-detail-deactivate-button"
                        onClick={handleDeactivateUser}
                        disabled={buttonsDisabled}
                        data-testid="report-detail-deactivate-btn"
                        style={{ opacity: buttonsDisabled ? 0.4 : 1 }}
                      >
                        Deactivate user
                      </button>
                      <button
                        className="report-detail-ban-button"
                        onClick={handleBanUser}
                        disabled={buttonsDisabled}
                        data-testid="report-detail-ban-btn"
                        style={{ opacity: buttonsDisabled ? 0.4 : 1 }}
                      >
                        Ban user
                      </button>
                    </div>
                    {userStatusMessage && (
                      <div className="report-detail-user-status-message">
                        <AssetIcon name="tooltip-icon" size={16} />
                        <span>{userStatusMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Report Details */}
              <div className="rdm-report-details-section">
                <h3 className="rdm-section-title">Report details</h3>
                <div className="rdm-report-summary">
                  <div className="rdm-report-header-row">
                    <div className="rdm-report-type">
                      <span className="rdm-label">Type:</span>
                      <span className="rdm-value">{reportType}</span>
                    </div>
                    <span className="rdm-separator">|</span>
                    <div className="rdm-report-status">
                      <span className="rdm-label">Status:</span>
                      <StatusDropdown
                        value={reportData.status}
                        onChange={(newStatus) => {
                          if (onStatusChange) {
                            onStatusChange(newStatus as ReportStatus);
                          }
                        }}
                        onNoteRequired={(newStatus) => {
                          if (onNoteRequired) {
                            onNoteRequired(newStatus as ReportStatus);
                          }
                        }}
                        options={[
                          "Pending review",
                          "Under evaluation",
                          "Resolved",
                          "Dismissed",
                        ]}
                        testId="modal-status-dropdown"
                      />
                    </div>
                  </div>

                  <div className="rdm-report-reason-row">
                    <span className="rdm-label">Reason:</span>
                    {renderReasonChip(
                      reportData.reason,
                      reportData.reasonColor
                    )}
                  </div>

                  <div className="rdm-report-date-row">
                    <span className="rdm-label">Report date:</span>
                    <span className="rdm-value">{reportData.reportDate}</span>
                  </div>

                  <div className="rdm-report-content-id-row">
                    <span className="rdm-label">Reported content ID:</span>
                    <div className="rdm-id-container">
                      <div className="rdm-id-badge">{reportData.contentId}</div>
                      <AssetIcon
                        name="copy-icon"
                        size={16}
                        className="rdm-copy-icon"
                      />
                    </div>
                  </div>

                  <p className="rdm-report-description">
                    <span className="rdm-label">Description:</span>{" "}
                    {reportData.description}
                  </p>

                  <div className="rdm-reporting-user">
                    <span className="rdm-label">Reporting user:</span>
                    <img
                      src={reportData.reportingUser.avatar}
                      alt={reportData.reportingUser.name}
                      className="rdm-reporting-user-avatar"
                    />
                    <div className="rdm-reporting-user-info">
                      <p className="rdm-reporting-user-name">
                        {reportData.reportingUser.name}
                      </p>
                      <div className="user-id-container">
                        <div className="user-id-badge">
                          {reportData.reportingUser.id}
                        </div>
                        <AssetIcon
                          name="copy-icon"
                          size={16}
                          className="rdm-copy-icon"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Details */}
              {renderContentDetails()}

              {/* Safety Record */}
              {renderSafetyRecord()}

              {/* Close Button */}
              <div className="modal-footer">
                <button
                  className="close-footer-button"
                  data-testid="report-detail-close-footer-button"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </CModalBody>
      </CModal>

      {/* Deactivate User Modal */}
      <DeactivateUserModal
        visible={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleDeactivateConfirm}
        userName={reportData.associatedUser.name}
      />

      {/* Ban User Modal */}
      <BanUserModal
        visible={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        onConfirm={handleBanConfirm}
        userName={reportData.associatedUser.name}
      />
    </>
  );
};
