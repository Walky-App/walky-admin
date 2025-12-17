import React, { useState } from "react";
import { CModal, CModalBody } from "@coreui/react";
import AssetIcon from "../AssetIcon/AssetIcon";
import { StatusBadge } from "../../pages-v2/Campus/components/StatusBadge";
import { CustomToast } from "../CustomToast/CustomToast";
import { BanUserModal } from "../BanUserModal/BanUserModal";
import { DeactivateUserModal } from "../DeactivateUserModal/DeactivateUserModal";
import { UnbanUserModal } from "../UnbanUserModal/UnbanUserModal";
import { CopyableId } from "../CopyableId/CopyableId";
import { formatMemberSince } from "../../lib/utils/dateUtils";
import "./StudentProfileModal.css";

export interface StudentProfileData {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  areaOfStudy?: string;
  status: "active" | "banned" | "deactivated" | "disengaged";
  memberSince: string;
  lastLogin: string;
  totalPeers?: number;
  bio?: string;
  interests?: string[];
  isFlagged?: boolean;
  flagReason?: string;
  // Ban specific info
  bannedBy?: string;
  bannedByEmail?: string;
  bannedDate?: string;
  bannedTime?: string;
  // Block history
  blockedByUsers?: Array<{
    id: string;
    name: string;
    avatar?: string;
    date: string;
    time: string;
  }>;
  banHistory?: Array<{
    title: string;
    duration: string;
    expiresIn?: string;
    reason: string;
    bannedDate: string;
    bannedTime: string;
    bannedBy: string;
  }>;
  reportHistory?: Array<{
    reportedIdea: string;
    reportId: string;
    reason: string;
    description: string;
    reportedDate: string;
    reportedTime: string;
    reportedBy: string;
    status: "Pending" | "Resolved";
  }>;
  blockHistory?: Array<{
    date: string;
    blockedUser: string;
  }>;
}

interface StudentProfileModalProps {
  visible: boolean;
  student: StudentProfileData | null;
  onClose: () => void;
  onBanUser?: (
    student: StudentProfileData,
    duration: string,
    reason: string
  ) => void;
  onDeactivateUser?: (student: StudentProfileData) => void;
  onUnbanUser?: (student: StudentProfileData) => void;
}

type HistoryTab = "ban" | "report" | "block";

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  visible,
  student,
  onClose,
  onBanUser,
  onDeactivateUser,
  onUnbanUser,
}) => {
  const [activeTab, setActiveTab] = useState<HistoryTab>("ban");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isUnbanModalOpen, setIsUnbanModalOpen] = useState(false);

  const formatEmail = (email: string) => {
    const MAX_LENGTH = 32;
    if (!email || email.length <= MAX_LENGTH) return email;

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

  // Format text by replacing underscores with spaces and capitalizing first letter
  const formatDisplayText = (text: string) => {
    if (!text) return text;
    const formatted = text.replace(/_/g, " ");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
  };

  if (!student) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(student.email);
    setToastMessage("Email copied to clipboard");
    setShowToast(true);
  };

  const handleBanClick = () => {
    setIsBanModalOpen(true);
  };

  const handleDeactivateClick = () => {
    setIsDeactivateModalOpen(true);
  };

  const handleConfirmBan = (
    duration: string,
    reason: string,
    _resolveReports: boolean
  ) => {
    onBanUser?.(student, duration, reason);
    setIsBanModalOpen(false);
  };

  const handleConfirmDeactivate = () => {
    onDeactivateUser?.(student);
    setIsDeactivateModalOpen(false);
  };

  const handleUnbanClick = () => {
    setIsUnbanModalOpen(true);
  };

  const handleConfirmUnban = () => {
    onUnbanUser?.(student);
    setIsUnbanModalOpen(false);
  };

  const handleModalClose = () => {
    setIsBanModalOpen(false);
    setIsDeactivateModalOpen(false);
    setIsUnbanModalOpen(false);
    onClose();
  };

  const renderHistoryContent = () => {
    if (activeTab === "ban") {
      if (!student.banHistory || student.banHistory.length === 0) {
        return (
          <div className="history-empty">
            <div className="history-empty-icon">
              <AssetIcon name="check-icon" size={33} color="#546FD9" />
            </div>
            <p className="history-empty-text">No ban history for this user</p>
          </div>
        );
      }
      return (
        <div className="ban-history-list">
          {student.banHistory.map((ban, idx) => (
            <div key={idx} className="ban-history-item">
              <p className="ban-history-title">{ban.title}</p>

              <div className="ban-history-row">
                <span className="ban-history-label">Ban duration:</span>
                <div className="ban-history-duration-container">
                  <div className="ban-history-duration-badge">
                    {ban.duration}
                  </div>
                  {ban.expiresIn && (
                    <span className="ban-history-expires">{ban.expiresIn}</span>
                  )}
                </div>
              </div>

              <p className="ban-history-reason">
                <span className="ban-history-reason-label">Reason:</span>{" "}
                <span className="ban-history-reason-value">{ban.reason}</span>
              </p>

              <p className="ban-history-banned-info">
                Banned on {ban.bannedDate} {ban.bannedTime} by {ban.bannedBy}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "report") {
      if (!student.reportHistory || student.reportHistory.length === 0) {
        return (
          <div className="history-empty">
            <div className="history-empty-icon">
              <AssetIcon name="check-icon" size={33} color="#546FD9" />
            </div>
            <p className="history-empty-text">
              No report history for this user
            </p>
          </div>
        );
      }
      return (
        <div className="report-history-list">
          {student.reportHistory.map((report, idx) => (
            <div key={idx} className="report-history-item">
              <div className="report-history-status-badge">
                <span
                  className={`report-status-text ${report.status
                    .toLowerCase()
                    .replace(/_/g, "-")}`}
                >
                  {formatDisplayText(report.status)}
                </span>
              </div>

              <div className="report-history-row">
                <span className="report-history-label">Reported Idea:</span>
                <span className="report-history-idea-link">
                  {report.reportedIdea}
                </span>
              </div>

              <div className="report-history-row">
                <span className="report-history-label">Report ID:</span>
                <div className="report-id-container">
                  <CopyableId
                    id={report.reportId}
                    collapsed={true}
                    showToast={true}
                    testId={`profile-report-id-${idx}`}
                  />
                </div>
              </div>

              <div className="report-history-row">
                <span className="report-history-label">Reason</span>
                <div className="report-reason-badge">
                  <span className="report-reason-text">
                    {formatDisplayText(report.reason)}
                  </span>
                </div>
              </div>

              <p className="report-history-description">
                <span className="report-description-label">Description:</span>{" "}
                <span className="report-description-value">
                  {report.description}
                </span>
              </p>

              <p className="report-history-reported-info">
                Reported on {report.reportedDate} - {report.reportedTime} by{" "}
                {report.reportedBy}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "block") {
      if (!student.blockedByUsers || student.blockedByUsers.length === 0) {
        return (
          <div className="history-empty">
            <div className="history-empty-icon">
              <AssetIcon name="check-icon" size={33} color="#546FD9" />
            </div>
            <p className="history-empty-text">No blocked by users</p>
          </div>
        );
      }
      return (
        <div className="blocked-by-section">
          <h3 className="blocked-by-title">Blocked by</h3>
          <div className="blocked-by-list">
            {student.blockedByUsers.map((user, idx) => (
              <div key={idx} className="blocked-by-user">
                <div className="blocked-by-user-avatar">
                  {user.avatar && !user.avatar.match(/^[A-Z]$/) ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="blocked-by-user-avatar-placeholder">
                      {user.avatar || user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="blocked-by-user-info">
                  <span className="blocked-by-user-name">{user.name}</span>
                  <span className="blocked-by-user-date">
                    {user.date} - {user.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <CModal
        visible={visible}
        onClose={handleModalClose}
        alignment="center"
        size="lg"
        className={`student-profile-modal ${
          isBanModalOpen || isDeactivateModalOpen ? "profile-hidden" : ""
        }`}
      >
        <CModalBody className="student-profile-modal-body">
          <button
            data-testid="profile-close-icon"
            className="profile-close-icon"
            onClick={handleModalClose}
            aria-label="Close modal"
          >
            <AssetIcon name="close-button" size={16} color="#5B6168" />
          </button>

          {/* View de Profile */}
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-user-section">
                <div className="profile-avatar-large">
                  {Boolean(student.isFlagged) && (
                    <div
                      className="profile-flag-icon"
                      title={student.flagReason || "Flagged"}
                    >
                      <AssetIcon name="flag-icon" size={16} color="#d32f2f" />
                    </div>
                  )}
                  {student.avatar && !student.avatar.match(/^[A-Z]$/) ? (
                    <img src={student.avatar} alt={student.name} />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {student.avatar || student.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="profile-user-info">
                  <h2 className="profile-name">{student.name}</h2>

                  <div className="profile-email-row">
                    <span className="profile-email" title={student.email}>
                      {formatEmail(student.email)}
                    </span>
                    <button
                      data-testid="profile-copy-email-btn"
                      className="profile-copy-btn"
                      onClick={handleCopyEmail}
                      title="Copy email"
                      aria-label="Copy email to clipboard"
                    >
                      <AssetIcon name="copy-icon" size={16} color="#ACB6BA" />
                    </button>
                  </div>

                  <div className="profile-userid-row">
                    <CopyableId
                      id={student.userId}
                      collapsed={true}
                      showToast={true}
                      testId="profile-userid"
                    />
                  </div>
                </div>
              </div>

              <div className="profile-action-buttons">
                {student.status !== "banned" && (
                  <button
                    data-testid="profile-deactivate-btn"
                    className="profile-btn profile-btn-deactivate"
                    onClick={handleDeactivateClick}
                  >
                    Deactivate user
                  </button>
                )}
                {student.status === "banned" ? (
                  <button
                    data-testid="profile-unban-btn"
                    className="profile-btn profile-btn-unban"
                    onClick={handleUnbanClick}
                  >
                    Unban user
                  </button>
                ) : (
                  <button
                    data-testid="profile-ban-btn"
                    className="profile-btn profile-btn-ban"
                    onClick={handleBanClick}
                  >
                    Ban user
                  </button>
                )}
              </div>
            </div>

            <div className="profile-details-container">
              <div className="profile-details-row">
                <span className="profile-detail-label">Area of study:</span>
                <span className="profile-detail-value">
                  {student.areaOfStudy || "N/A"}
                </span>
              </div>

              <div className="profile-details-row">
                <span className="profile-detail-label">Status:</span>
                <StatusBadge status={student.status} />
              </div>

              <div className="profile-details-row">
                <span className="profile-detail-label">Member since:</span>
                <span className="profile-detail-value">
                  {formatMemberSince(student.memberSince)}
                </span>
              </div>

              <div className="profile-details-row">
                <span className="profile-detail-label">Last login:</span>
                <span className="profile-detail-value">
                  {student.lastLogin}
                </span>
              </div>

              <div className="profile-details-row">
                <span className="profile-detail-label">Total peers:</span>
                <span className="profile-detail-value">
                  {student.totalPeers || 0}
                </span>
              </div>

              <div className="profile-details-row">
                <span className="profile-detail-label">Bio:</span>
                <span className="profile-detail-value">
                  {student.bio || "No bio available"}
                </span>
              </div>

              <div className="profile-interests-section">
                <span className="profile-detail-label">Interests:</span>
                {student.interests && student.interests.length > 0 ? (
                  <div className="profile-interests-list">
                    {student.interests.map((interest, idx) => (
                      <div key={idx} className="profile-interest-chip">
                        {interest}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="profile-detail-value">No interests</span>
                )}
              </div>
            </div>

            {student.status === "banned" && (
              <div className="profile-ban-info-container">
                <div className="profile-details-row">
                  <span className="profile-detail-label">Status:</span>
                  <div className="profile-banned-badge">Banned</div>
                </div>

                <div className="profile-details-row">
                  <span className="profile-detail-label">Banned by:</span>
                  <span className="profile-detail-value">
                    {student.bannedBy || "N/A"}
                    {student.bannedByEmail && ` (${student.bannedByEmail})`}
                  </span>
                </div>

                <div className="profile-details-row">
                  <span className="profile-detail-label">Ban date:</span>
                  <span className="profile-detail-value">
                    {student.bannedDate || "N/A"}
                    {student.bannedTime && ` - ${student.bannedTime}`}
                  </span>
                </div>
              </div>
            )}

            <div className="profile-history-section">
              <div className="profile-history-tabs">
                <button
                  data-testid="profile-history-ban-tab"
                  className={`profile-history-tab ${
                    activeTab === "ban" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("ban")}
                >
                  Ban history
                </button>
                <button
                  data-testid="profile-history-report-tab"
                  className={`profile-history-tab ${
                    activeTab === "report" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("report")}
                >
                  Report history
                </button>
                <button
                  data-testid="profile-history-block-tab"
                  className={`profile-history-tab ${
                    activeTab === "block" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("block")}
                >
                  Block history
                </button>
              </div>

              <div className="profile-history-content">
                {renderHistoryContent()}
              </div>
            </div>

            <div className="profile-close-button-container">
              <button
                data-testid="profile-close-footer-btn"
                className="profile-close-button"
                onClick={handleModalClose}
              >
                Close
              </button>
            </div>
          </div>
        </CModalBody>

        {showToast && (
          <CustomToast
            message={toastMessage}
            onClose={() => setShowToast(false)}
          />
        )}
      </CModal>

      <BanUserModal
        visible={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        onConfirm={handleConfirmBan}
        userName={student.name}
      />

      <DeactivateUserModal
        visible={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleConfirmDeactivate}
        userName={student.name}
      />

      <UnbanUserModal
        visible={isUnbanModalOpen}
        onClose={() => setIsUnbanModalOpen(false)}
        onConfirm={handleConfirmUnban}
        userName={student.name}
      />
    </>
  );
};
