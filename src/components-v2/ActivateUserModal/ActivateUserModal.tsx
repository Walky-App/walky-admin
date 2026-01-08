import React, { useEffect } from "react";
import { CModal, CModalBody, CButton } from "@coreui/react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./ActivateUserModal.css";

export interface ActivateUserModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export const ActivateUserModal: React.FC<ActivateUserModalProps> = ({
  visible,
  onClose,
  onConfirm,
  userName = "this student",
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

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      alignment="center"
      backdrop="static"
      className="activate-user-modal"
    >
      <CModalBody className="activate-user-modal-body">
        <button
          className="activate-user-modal-close"
          onClick={onClose}
          aria-label="Close"
          data-testid="activate-user-modal-close-btn"
        >
          <AssetIcon name="close-button" size={14} color="#5B6168" />
        </button>

        <h2 className="activate-user-modal-title">Activate user</h2>

        <p className="activate-user-modal-text">
          Are you sure you want to activate <strong>{userName}</strong>?
        </p>

        <p className="activate-user-modal-description">
          The selected student will be notified via email that their account has
          been activated.
        </p>

        <div className="activate-user-modal-actions">
          <CButton
            className="activate-user-modal-cancel-btn"
            onClick={onClose}
            data-testid="activate-user-modal-cancel-btn"
          >
            Cancel
          </CButton>
          <CButton
            className="activate-user-modal-confirm-btn"
            onClick={onConfirm}
            data-testid="activate-user-modal-confirm-btn"
          >
            Activate user
          </CButton>
        </div>
      </CModalBody>
    </CModal>
  );
};
