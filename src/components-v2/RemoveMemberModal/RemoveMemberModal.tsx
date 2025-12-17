import React from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./RemoveMemberModal.css";

interface RemoveMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
}

const RemoveMemberModal: React.FC<RemoveMemberModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  memberName,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="remove-member-overlay" onClick={handleOverlayClick}>
      <div className="remove-member-content" onClick={handleContentClick}>
        <button
          data-testid="remove-member-close-btn"
          className="remove-member-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={16} />
        </button>

        <div className="remove-member-body">
          <h2 className="remove-member-title">Remove member</h2>

          <div className="remove-member-message">
            <p className="remove-member-text">
              Are you sure you want to remove <strong>{memberName}</strong> as
              an administrator?
            </p>
            <p className="remove-member-warning">
              This action will revoke their access and permissions associated
              with the role.
            </p>
          </div>

          <div className="remove-member-buttons">
            <button
              data-testid="remove-member-cancel-btn"
              className="remove-member-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              data-testid="remove-member-confirm-btn"
              className="remove-member-confirm"
              onClick={onConfirm}
            >
              Remove role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveMemberModal;
