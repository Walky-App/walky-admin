import React from "react";
import { CModal, CModalBody, CButton } from "@coreui/react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./DeactivateUserModal.css";

export interface DeactivateUserModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export const DeactivateUserModal: React.FC<DeactivateUserModalProps> = ({
  visible,
  onClose,
  onConfirm,
  userName,
}) => {
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
      className="deactivate-user-modal"
    >
      <CModalBody className="deactivate-user-modal-body">
        {/* Close button */}
        <button
          data-testid="deactivate-modal-close-btn"
          className="deactivate-modal-close-icon"
          onClick={handleCancel}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={16} color="#5B6168" />
        </button>

        <div className="deactivate-modal-content">
          {/* Content Section */}
          <div>
            {/* Title */}
            <h2 className="deactivate-modal-title">Deactivate user</h2>

            {/* Message Container */}
            <div className="deactivate-modal-message-container">
              <p className="deactivate-modal-question">
                Are you sure you want to deactivate{" "}
                <span className="deactivate-modal-username">
                  {userName || "this user"}
                </span>
                ?
              </p>
              <p className="deactivate-modal-description">
                The selected student will be notified via email about the
                deactivation of their account. This action can be reversed later
                if needed.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="deactivate-modal-button-container">
            <CButton
              color="light"
              onClick={handleCancel}
              className="deactivate-modal-cancel-button"
            >
              Cancel
            </CButton>
            <CButton
              onClick={handleConfirm}
              className="deactivate-modal-confirm-button"
            >
              Deactivate user
            </CButton>
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};

export default DeactivateUserModal;
