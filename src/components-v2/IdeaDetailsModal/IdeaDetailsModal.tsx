import React from "react";
import { CModal, CModalBody } from "@coreui/react";
import "./IdeaDetailsModal.css";
import { AssetIcon, CopyableId, NoData } from "../../components-v2";

export interface IdeaCollaborator {
  id: string;
  name: string;
  avatar?: string;
}

export interface IdeaDetailsData {
  id: string;
  title: string;
  owner: {
    name: string;
    studentId: string;
    avatar?: string;
  };
  creationDate: string;
  creationTime: string;
  description: string;
  lookingFor: string;
  collaborators: IdeaCollaborator[];
  isFlagged?: boolean;
  flagReason?: string;
}

interface IdeaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaData: IdeaDetailsData | null;
}

export const IdeaDetailsModal: React.FC<IdeaDetailsModalProps> = ({
  isOpen,
  onClose,
  ideaData,
}) => {
  if (!ideaData) return null;

  return (
    <CModal
      visible={isOpen}
      onClose={onClose}
      size="xl"
      alignment="center"
      backdrop="static"
      className="idea-details-modal-wrapper"
    >
      <CModalBody className="idea-details-modal-body">
        <button
          data-testid="idea-details-close-btn"
          className="idea-details-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={16} color="#5b6168" />
        </button>

        <div className="idea-details-content">
          {/* Header */}
          <div className="idea-details-header">
            <h2 className="idea-details-title">Idea details</h2>
          </div>

          {/* Main Content */}
          <div className="idea-details-main">
            {/* Left Column */}
            <div className="idea-details-left">
              {/* Idea Owner */}
              <div className="idea-details-section">
                <h3 className="idea-details-section-title">Idea owner</h3>
                <div className="idea-details-owner">
                  <div className="idea-owner-avatar">
                    {ideaData.owner.avatar ? (
                      <img
                        src={ideaData.owner.avatar}
                        alt={ideaData.owner.name}
                      />
                    ) : (
                      <div className="idea-owner-avatar-placeholder">
                        {ideaData.owner.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="idea-owner-info">
                    <p className="idea-owner-name">{ideaData.owner.name}</p>
                    <CopyableId
                      id={ideaData.owner.studentId}
                      label="Student ID"
                      variant="secondary"
                      iconColor="#ACB6BA"
                      testId="idea-owner-copy"
                    />
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="idea-details-section">
                <h3 className="idea-details-section-title">Information</h3>
                <div className="idea-details-info-box">
                  <div className="idea-info-row">
                    <span className="idea-info-label">Name:</span>
                    <span className="idea-info-value">{ideaData.title}</span>
                  </div>
                  <div className="idea-info-row">
                    <span className="idea-info-label">Creation date:</span>
                    <span className="idea-info-value">
                      {ideaData.creationDate} - {ideaData.creationTime}
                    </span>
                  </div>
                  <div className="idea-info-description">
                    <span className="idea-info-label">Description:</span>{" "}
                    <span className="idea-info-value">
                      {ideaData.description}
                    </span>
                  </div>
                  <div className="idea-info-description">
                    <span className="idea-info-label">
                      Who are you looking to collaborate with?:
                    </span>{" "}
                    <span className="idea-info-value">
                      {ideaData.lookingFor}
                    </span>
                  </div>
                  {ideaData.isFlagged && ideaData.flagReason && (
                    <div className="idea-info-flag-reason">
                      <span className="idea-info-label">Reason for flag:</span>{" "}
                      <span className="idea-info-value-flagged">
                        {ideaData.flagReason}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="idea-details-divider"></div>

            {/* Right Column - Collaborators */}
            <div className="idea-details-right">
              <div className="idea-collaborators-header">
                <h3 className="idea-collaborators-title">Collaborators</h3>
              </div>
              <div className="idea-collaborators-list">
                {ideaData.collaborators.length === 0 ? (
                  <NoData message="This idea has no collaborators yet" />
                ) : (
                  ideaData.collaborators.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="idea-collaborator-item"
                    >
                      <div className="idea-collaborator-avatar">
                        {collaborator.avatar ? (
                          <img
                            src={collaborator.avatar}
                            alt={collaborator.name}
                          />
                        ) : (
                          <div className="idea-collaborator-avatar-placeholder">
                            {collaborator.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <p className="idea-collaborator-name">
                        {collaborator.name}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="idea-details-footer">
            <button
              data-testid="idea-details-close-footer-btn"
              className="idea-details-close-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};
