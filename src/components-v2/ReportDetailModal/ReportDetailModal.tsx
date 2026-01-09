import React, { useState } from "react";
import { CModal, CModalBody } from "@coreui/react";
import "./ReportDetailModal.css";
import AssetIcon from "../AssetIcon/AssetIcon";
import { NoData } from "../NoData/NoData";
import { CopyableId } from "../CopyableId/CopyableId";
import { StatusDropdown } from "../StatusDropdown/StatusDropdown";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import { Chip } from "../Chip";

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
        id?: string;
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

    // Admin notes
    notes?: Array<{
      note: string;
      date: string;
    }>;
  };
  onStatusChange?: (newStatus: ReportStatus) => void;
  onNoteRequired?: (newStatus: ReportStatus) => void;
  onDeactivateUser?: () => void;
  onBanUser?: (
    duration: string,
    reason: string,
    resolveReports: boolean
  ) => void;
  onSpaceClick?: (spaceId: string) => void;
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
  onSpaceClick,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<SafetyTab>("ban");
  const [isEmailCopied, setIsEmailCopied] = useState(false);

  const handleDeactivateUser = () => {
    onDeactivateUser?.();
  };

  const handleBanUser = () => {
    onBanUser?.("", "", false);
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return "-";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    const datePart = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })
      .format(parsed)
      .toUpperCase();

    const timePart = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    }).format(parsed);

    return `${datePart} | ${timePart}`;
  };

  const getReasonChipType = () => {
    const type = reportType.toLowerCase();
    if (type.includes("event")) return "eventReason" as const;
    if (type.includes("idea")) return "ideaReason" as const;
    if (type.includes("space")) return "spaceReason" as const;
    return "userReason" as const;
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

  const getInitials = (value?: string) => {
    if (!value) return "?";
    const parts = value.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    const first = parts[0][0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] || "" : "";
    return `${first}${last}`.toUpperCase();
  };

  const renderContentDetails = () => {
    const { content } = reportData;

    if (reportType === "Event" && content.event) {
      return (
        <div className="rdm-content-section">
          <h3 className="rdm-section-title">Content details</h3>
          <div className="rdm-content-container">
            <div className="rdm-event-card">
              <img
                src={content.event.image}
                alt="Event"
                className="rdm-event-image"
              />
              <div className="rdm-event-info">
                <p className="rdm-event-date">
                  {formatDateTime(content.event.date)}
                </p>
                <h4 className="rdm-event-title">{content.event.title}</h4>
                <div className="rdm-event-location">
                  <AssetIcon name="location-icon" size={20} />
                  <span>{content.event.location}</span>
                </div>
              </div>
              <AssetIcon
                name="right-arrow-icon"
                size={16}
                color="#546FD9"
                className="space-event-chevron-icon"
              />
            </div>
          </div>
        </div>
      );
    }

    if (reportType === "Event of Space" && content.space && content.event) {
      return (
        <div className="rdm-content-section">
          <h3 className="rdm-section-title">Content details</h3>
          <div className="rdm-content-container rdm-dual-content">
            <div className="rdm-space-section">
              <h4 className="rdm-subsection-title">Space details</h4>
              <div
                className={`rdm-space-card ${
                  onSpaceClick && content.space.id ? "rdm-clickable" : ""
                }`}
                onClick={() => {
                  if (onSpaceClick && content.space?.id) {
                    onSpaceClick(content.space.id);
                  }
                }}
                style={{
                  cursor:
                    onSpaceClick && content.space.id ? "pointer" : "default",
                }}
              >
                <img
                  src={content.space.image}
                  alt="Space"
                  className="rdm-space-image"
                />
                <div className="rdm-space-info">
                  <h4 className="rdm-space-title">{content.space.title}</h4>
                  <p className="rdm-space-description">
                    {content.space.description}
                  </p>
                  <div className="rdm-space-meta">
                    <span>{content.space.category}</span>
                    <span>•</span>
                    <span>{content.space.memberCount}</span>
                  </div>
                </div>
                <AssetIcon
                  name="right-arrow-icon"
                  size={16}
                  color="#546FD9"
                  className="space-event-chevron-icon"
                />
              </div>
            </div>

            <div className="rdm-divider-vertical" />

            <div className="rdm-event-section">
              <h4 className="rdm-subsection-title">Event details</h4>
              <div className="rdm-event-card-small">
                <img
                  src={content.event.image}
                  alt="Event"
                  className="rdm-event-image-small"
                />
                <div className="rdm-event-info">
                  <p className="rdm-event-date">
                    {formatDateTime(content.event.date)}
                  </p>
                  <h4 className="rdm-event-title">{content.event.title}</h4>
                  <div className="rdm-event-location">
                    <AssetIcon name="location-icon" size={20} />
                    <span>{content.event.location}</span>
                  </div>
                </div>
                <AssetIcon
                  name="right-arrow-icon"
                  size={16}
                  color="#546FD9"
                  className="space-event-chevron-icon"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (reportType === "Space" && content.space) {
      return (
        <div className="rdm-content-section">
          <h3 className="rdm-section-title">Content details</h3>
          <div className="rdm-content-container">
            <div className="rdm-space-card">
              <img
                src={content.space.image}
                alt="Space"
                className="rdm-space-image"
              />
              <div className="rdm-space-info">
                <h4 className="rdm-space-title">{content.space.title}</h4>
                <p className="rdm-space-description">
                  {content.space.description}
                </p>
                <div className="rdm-space-meta">
                  <span>{content.space.category}</span>
                  <span>•</span>
                  <span>{content.space.memberCount}</span>
                </div>
              </div>
              <AssetIcon
                name="right-arrow-icon"
                size={16}
                color="#546FD9"
                className="space-event-chevron-icon"
              />
            </div>
          </div>
        </div>
      );
    }

    if (reportType === "Idea" && content.idea) {
      return (
        <div className="rdm-content-section">
          <h3 className="rdm-section-title">Content details</h3>
          <div className="rdm-content-container">
            <div className="rdm-idea-card">
              <div className="rdm-idea-bar"></div>
              <div className="rdm-idea-content">
                <div className="rdm-idea-header">
                  <h4 className="rdm-idea-title">{content.idea.title}</h4>
                  <div className="rdm-idea-author">
                    <div className="rdm-idea-by-text">
                      <span className="rdm-idea-by-label">Idea by</span>
                      <span className="rdm-idea-by-name">
                        {content.idea.ideaBy}
                      </span>
                    </div>
                    {content.idea.avatar ? (
                      <img
                        src={content.idea.avatar}
                        alt={content.idea.ideaBy}
                        className="rdm-idea-author-avatar"
                      />
                    ) : (
                      <div className="rdm-idea-avatar-fallback">
                        {getInitials(content.idea.ideaBy)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="rdm-idea-tagline">
                  <div className="rdm-idea-tag">{content.idea.tag}</div>
                  <p className="rdm-idea-description">
                    {content.idea.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (reportType === "Message" && content.message) {
      return (
        <div className="rdm-content-section">
          <h3 className="rdm-section-title">Content details</h3>
          <div className="rdm-content-container">
            <div className="rdm-message-container">
              <div className="rdm-message-bubble">
                <p className="rdm-message-text">{content.message.text}</p>
              </div>
              <p className="rdm-message-timestamp">
                {formatDateTime(content.message.timestamp)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderEmptyState = (message: string) => (
    <div className="rdm-safety-item rdm-empty-state">
      <NoData iconName="check-icon" message={message} />
    </div>
  );

  const renderSafetyRecord = () => {
    const { banHistory, reportHistory, blockHistory } = reportData.safetyRecord;

    let content: React.ReactNode = null;
    if (activeTab === "ban") {
      content =
        banHistory.length > 0
          ? banHistory.map((ban, index) => (
              <div key={index} className="rdm-safety-item">
                <p className="rdm-ban-duration">{ban.duration}</p>
                {ban.expiresIn && (
                  <div className="rdm-ban-duration-info">
                    <span className="rdm-ban-duration-label">
                      Ban duration:
                    </span>
                    <div className="rdm-ban-duration-badge">
                      {ban.duration.split(" ")[0]} Days
                    </div>
                    <span className="rdm-ban-expires">{ban.expiresIn}</span>
                  </div>
                )}
                <p className="rdm-safety-reason">
                  <span className="rdm-label">Reason:</span> {ban.reason}
                </p>
                <p className="rdm-safety-meta">
                  {ban.bannedOn} by {ban.bannedBy}
                </p>
              </div>
            ))
          : renderEmptyState("No ban history for this user");
    } else if (activeTab === "report") {
      content =
        reportHistory.length > 0
          ? reportHistory.map((report, index) => (
              <div key={index} className="rdm-safety-item rdm-report-item">
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
                    <AssetIcon
                      name="copy-icon"
                      size={16}
                      className="rdm-copy-icon"
                    />
                  </div>
                </div>
                <div className="rdm-report-reason-row">
                  <span className="rdm-label">Reason</span>
                  <Chip value={report.reason} type={getReasonChipType()} />
                </div>
                <p className="rdm-report-description">
                  <span className="rdm-label">Description:</span>{" "}
                  {report.description}
                </p>
                <p className="rdm-safety-meta">
                  {report.reportedOn} by {report.reportedBy}
                </p>
              </div>
            ))
          : renderEmptyState("No report history for this user");
    } else if (activeTab === "block") {
      content =
        blockHistory.length > 0 ? (
          <div className="rdm-safety-item">
            <p className="rdm-block-title">Blocked By</p>
            <div className="rdm-block-list">
              {blockHistory.map((block, index) => (
                <div key={index} className="rdm-block-item">
                  <img
                    src={block.avatar}
                    alt={block.name}
                    className="rdm-block-avatar"
                  />
                  <div className="rdm-block-info">
                    <p className="rdm-block-name">{block.name}</p>
                    <p className="rdm-block-date">{block.blockedOn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          renderEmptyState("No block history for this user")
        );
    }

    return (
      <div className="rdm-safety-record-section">
        <h3 className="rdm-section-title">User safety record</h3>
        <div className="rdm-safety-tabs">
          <button
            data-testid="safety-tab-ban"
            className={`rdm-safety-tab ${activeTab === "ban" ? "active" : ""}`}
            onClick={() => setActiveTab("ban")}
          >
            Ban history ({banHistory.length})
          </button>
          <button
            data-testid="safety-tab-report"
            className={`rdm-safety-tab ${
              activeTab === "report" ? "active" : ""
            }`}
            onClick={() => setActiveTab("report")}
          >
            Report history ({reportHistory.length})
          </button>
          <button
            data-testid="safety-tab-block"
            className={`rdm-safety-tab ${
              activeTab === "block" ? "active" : ""
            }`}
            onClick={() => setActiveTab("block")}
          >
            Block history ({blockHistory.length})
          </button>
        </div>
        <div className="rdm-safety-content">{content}</div>
      </div>
    );
  };

  const isUserBanned = reportData.associatedUser.isBanned === true;
  const isUserDeactivated = reportData.associatedUser.isDeactivated === true;

  const userStatusMessage =
    isUserBanned && isUserDeactivated
      ? "This user is currently banned and deactivated"
      : isUserBanned
      ? "This user is currently banned"
      : isUserDeactivated
      ? "This user is currently deactivated"
      : null;

  const disableBanUser = isUserBanned || isUserDeactivated;
  const disableDeactivateUser = isUserDeactivated || isUserBanned;

  const renderContentSkeleton = () => {
    const wrapContent = (body: React.ReactNode) => (
      <div className="rdm-content-section">
        <h3 className="rdm-section-title">Content details</h3>
        {body}
      </div>
    );

    if (reportType === "Event of Space") {
      return wrapContent(
        <div className="rdm-content-container rdm-dual-content">
          <div className="rdm-loading-card rdm-content-loading-card">
            <SkeletonLoader
              height="112px"
              width="96px"
              borderRadius="8px"
              className="rdm-loading-media"
            />
            <div className="rdm-loading-stack">
              <SkeletonLoader height="18px" width="180px" />
              <SkeletonLoader height="16px" width="200px" />
              <SkeletonLoader height="14px" width="150px" />
            </div>
          </div>

          <div className="rdm-loading-divider" />

          <div className="rdm-loading-card rdm-content-loading-card">
            <SkeletonLoader
              height="112px"
              width="96px"
              borderRadius="8px"
              className="rdm-loading-media"
            />
            <div className="rdm-loading-stack">
              <SkeletonLoader height="18px" width="200px" />
              <SkeletonLoader height="16px" width="180px" />
              <SkeletonLoader height="14px" width="140px" />
            </div>
          </div>
        </div>
      );
    }

    if (reportType === "Event") {
      return wrapContent(
        <div className="rdm-content-container">
          <div className="rdm-loading-card">
            <SkeletonLoader
              height="96px"
              width="96px"
              borderRadius="8px"
              className="rdm-loading-media"
            />
            <div className="rdm-loading-stack">
              <SkeletonLoader height="14px" width="200px" />
              <SkeletonLoader height="20px" width="220px" />
              <SkeletonLoader height="14px" width="180px" />
            </div>
          </div>
        </div>
      );
    }

    if (reportType === "Space") {
      return wrapContent(
        <div className="rdm-content-container">
          <div className="rdm-loading-card">
            <SkeletonLoader
              height="112px"
              width="96px"
              borderRadius="8px"
              className="rdm-loading-media"
            />
            <div className="rdm-loading-stack">
              <SkeletonLoader height="20px" width="200px" />
              <SkeletonLoader height="14px" width="240px" />
              <SkeletonLoader height="14px" width="180px" />
            </div>
          </div>
        </div>
      );
    }

    if (reportType === "Idea") {
      return wrapContent(
        <div className="rdm-content-container">
          <div className="rdm-loading-card rdm-idea-loading-card">
            <SkeletonLoader height="12px" width="8px" borderRadius="4px" />
            <div className="rdm-loading-stack">
              <SkeletonLoader height="18px" width="220px" />
              <SkeletonLoader height="14px" width="180px" />
              <SkeletonLoader height="14px" width="200px" />
              <SkeletonLoader height="14px" width="160px" />
            </div>
            <SkeletonLoader
              height="40px"
              width="40px"
              borderRadius="50%"
              className="rdm-loading-media"
            />
          </div>
        </div>
      );
    }

    if (reportType === "Message") {
      return wrapContent(
        <div className="rdm-content-container">
          <div className="rdm-loading-card rdm-message-loading-card">
            <SkeletonLoader height="60px" width="100%" borderRadius="12px" />
            <SkeletonLoader height="14px" width="120px" />
          </div>
        </div>
      );
    }

    return wrapContent(
      <div className="rdm-content-container">
        <div className="rdm-loading-card">
          <SkeletonLoader height="120px" width="120px" borderRadius="8px" />
          <div className="rdm-loading-stack">
            <SkeletonLoader height="18px" width="200px" />
            <SkeletonLoader height="14px" width="180px" />
            <SkeletonLoader height="14px" width="160px" />
          </div>
        </div>
      </div>
    );
  };

  const renderLoadingState = () => (
    <div className="rdm-modal-loading" aria-busy="true">
      <div className="rdm-associated-user-section">
        <h3 className="rdm-section-title">Associated user</h3>
        <div className="rdm-user-info">
          <div className="rdm-user-details">
            <SkeletonLoader
              height="140px"
              width="140px"
              borderRadius="50%"
              className="rdm-loading-avatar"
            />
            <div className="rdm-user-text">
              <SkeletonLoader height="22px" width="180px" />
              <SkeletonLoader height="16px" width="220px" />
              <SkeletonLoader height="16px" width="160px" />
            </div>
          </div>

          <div className="rdm-user-actions">
            <div className="rdm-action-buttons">
              <SkeletonLoader height="40px" width="150px" borderRadius="12px" />
              <SkeletonLoader height="40px" width="120px" borderRadius="12px" />
            </div>
            <SkeletonLoader height="18px" width="210px" />
          </div>
        </div>
      </div>

      <div className="rdm-report-details-section">
        <h3 className="rdm-section-title">Report details</h3>
        <div className="rdm-report-summary">
          <div className="rdm-report-header-row">
            <div className="rdm-report-type">
              <span className="rdm-label">Type:</span>
              <SkeletonLoader height="18px" width="120px" />
            </div>
            <span className="rdm-separator">|</span>
            <div className="rdm-report-status">
              <span className="rdm-label">Status:</span>
              <SkeletonLoader height="36px" width="190px" borderRadius="12px" />
            </div>
          </div>

          <div className="rdm-report-reason-row">
            <span className="rdm-label">Reason:</span>
            <SkeletonLoader height="20px" width="140px" borderRadius="999px" />
          </div>

          <div className="rdm-report-date-row">
            <span className="rdm-label">Report date:</span>
            <SkeletonLoader height="16px" width="160px" />
          </div>

          <div className="rdm-report-content-id-row">
            <span className="rdm-label">Reported content ID:</span>
            <SkeletonLoader height="20px" width="180px" />
          </div>

          <div className="rdm-loading-stack">
            <SkeletonLoader height="14px" width="100%" />
            <SkeletonLoader height="14px" width="90%" />
          </div>

          <div className="rdm-reporting-user">
            <span className="rdm-label">Reporting user:</span>
            <SkeletonLoader height="38px" width="38px" borderRadius="50%" />
            <div className="rdm-reporting-user-info">
              <SkeletonLoader height="14px" width="160px" />
              <SkeletonLoader height="14px" width="120px" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Details */}
      {renderContentSkeleton()}

      <div className="rdm-safety-section">
        <h3 className="rdm-section-title">Safety record</h3>
        <div className="rdm-safety-tabs">
          <SkeletonLoader
            height="36px"
            width="140px"
            borderRadius="12px"
            className="rdm-loading-tab"
          />
          <SkeletonLoader
            height="36px"
            width="140px"
            borderRadius="12px"
            className="rdm-loading-tab"
          />
          <SkeletonLoader
            height="36px"
            width="140px"
            borderRadius="12px"
            className="rdm-loading-tab"
          />
        </div>
        <div className="rdm-loading-stack">
          <div className="rdm-loading-card">
            <SkeletonLoader height="16px" width="240px" />
            <SkeletonLoader height="14px" width="200px" />
            <SkeletonLoader height="14px" width="180px" />
          </div>
          <div className="rdm-loading-card">
            <SkeletonLoader height="16px" width="220px" />
            <SkeletonLoader height="14px" width="190px" />
            <SkeletonLoader height="14px" width="170px" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <CModal
        visible={isOpen}
        onClose={onClose}
        size="xl"
        alignment="center"
        className="rdm-modal"
        backdrop="static"
      >
        <CModalBody className="rdm-modal-body">
          <button
            className="rdm-close-button"
            onClick={onClose}
            data-testid="report-detail-modal-close-btn"
            aria-label="Close modal"
          >
            <AssetIcon name="close-button" size={20} />
          </button>

          {isLoading ? (
            renderLoadingState()
          ) : (
            <div className="rdm-modal-content">
              {/* Associated User */}
              <div className="rdm-associated-user-section">
                <h3 className="rdm-section-title">Associated user</h3>
                <div className="rdm-user-info">
                  <div className="rdm-user-details">
                    <img
                      src={reportData.associatedUser.avatar}
                      alt={reportData.associatedUser.name}
                      className="rdm-user-avatar"
                    />
                    <div className="rdm-user-text">
                      <h4 className="rdm-user-name">
                        {reportData.associatedUser.name}
                      </h4>
                      {reportData.associatedUser.email && (
                        <div className="rdm-user-email-row">
                          <span
                            className="rdm-user-email"
                            title={reportData.associatedUser.email}
                          >
                            {formatEmail(reportData.associatedUser.email)}
                          </span>
                          <button
                            className="rdm-user-email-copy-btn"
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

                  <div className="rdm-user-actions">
                    <div className="rdm-action-buttons">
                      <button
                        className="rdm-deactivate-btn"
                        onClick={handleDeactivateUser}
                        data-testid="report-detail-deactivate-btn"
                        disabled={disableDeactivateUser}
                        aria-disabled={disableDeactivateUser}
                        title={
                          isUserDeactivated
                            ? "User is already deactivated"
                            : isUserBanned
                            ? "User is already banned"
                            : "Deactivate user"
                        }
                      >
                        Deactivate user
                      </button>
                      <button
                        className="rdm-ban-btn"
                        onClick={handleBanUser}
                        data-testid="report-detail-ban-btn"
                        disabled={disableBanUser}
                        aria-disabled={disableBanUser}
                        title={
                          isUserDeactivated
                            ? "User is deactivated"
                            : isUserBanned
                            ? "User is already banned"
                            : "Ban user"
                        }
                      >
                        Ban user
                      </button>
                    </div>
                    {userStatusMessage && (
                      <div className="rdm-status-message">
                        <AssetIcon name="tooltip-icon" size={16} />
                        <span>{userStatusMessage}</span>
                      </div>
                    )}
                    <div className="rdm-action-descriptions">
                      <div className="rdm-action-description-line">
                        <AssetIcon name="tooltip-icon" size={16} />
                        <span>
                          <span className="rdm-action-desc-title">
                            Deactivate:
                          </span>{" "}
                          <span className="rdm-action-desc-text">
                            The user no longer has access.
                          </span>
                        </span>
                      </div>
                      <div className="rdm-action-description-line">
                        <AssetIcon name="tooltip-icon" size={16} />
                        <span>
                          <span className="rdm-action-desc-title">Ban:</span>{" "}
                          <span className="rdm-action-desc-text">
                            Blocks the user’s access for a limited period of
                            time.
                          </span>
                        </span>
                      </div>
                    </div>
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
                    <Chip
                      value={reportData.reason}
                      type={getReasonChipType()}
                    />
                  </div>

                  <div className="rdm-report-date-row">
                    <span className="rdm-label">Report date:</span>
                    <span className="rdm-value">
                      {formatDateTime(reportData.reportDate)}
                    </span>
                  </div>

                  <div className="rdm-report-content-id-row">
                    <span className="rdm-label">Reported content ID:</span>
                    <CopyableId id={reportData.contentId} />
                  </div>

                  <p className="rdm-report-description">
                    <span className="rdm-label">Description:</span>{" "}
                    {reportData.description}
                  </p>

                  {reportData.notes && reportData.notes.length > 0 && (
                    <div className="rdm-admin-notes">
                      <span className="rdm-label">Admin notes:</span>
                      {reportData.notes.map((noteItem, index) => (
                        <div key={index} className="rdm-note-item">
                          <p className="rdm-note-text">{noteItem.note}</p>
                          <span className="rdm-note-date">
                            {formatDateTime(noteItem.date)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

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
                      <CopyableId id={reportData.reportingUser.id} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Details */}
              {renderContentDetails()}

              {/* Safety Record */}
              {renderSafetyRecord()}

              {/* Close Button */}
              <div className="rdm-modal-footer">
                <button
                  className="rdm-close-footer-button"
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
    </>
  );
};
