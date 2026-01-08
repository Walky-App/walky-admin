import React, { useEffect } from "react";
import { CModal, CModalBody, CButton } from "@coreui/react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./UnbanUserModal.css";

export interface UnbanUserModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export const UnbanUserModal: React.FC<UnbanUserModalProps> = ({
  visible,
  onClose,
  onConfirm,
  userName,
}) => {
  // Close modal on ESC key
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, onClose]);

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      alignment="center"
      backdrop="static"
      className="unban-user-modal"
    >
      <CModalBody className="unban-user-modal-body">
        {/* Close button */}
        <button
          data-testid="unban-modal-close-btn"
          className="unban-modal-close-icon"
          onClick={handleCancel}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={16} color="#5B6168" />
        </button>

        <div className="unban-modal-content">
          {/* Content Section */}
          <div>
            {/* Title */}
            <h2 className="unban-modal-title">Unban user</h2>

            {/* Message Container */}
            <div className="unban-modal-message-container">
              <p className="unban-modal-question">
                Are you sure you want to unban{" "}
                <span className="unban-modal-username">
                  {userName || "this user"}
                </span>
                ?
              </p>
              <p className="unban-modal-description">
                The student will regain access to the platform and receive an
                email notifying them that their account has been reinstated.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="unban-modal-button-container">
            <CButton
              color="light"
              onClick={handleCancel}
              className="unban-modal-cancel-button"
            >
              Cancel
            </CButton>
            <CButton
              onClick={handleConfirm}
              className="unban-modal-confirm-button"
            >
              Unban user
            </CButton>
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};

export default UnbanUserModal;
