import React, { useState, useEffect } from "react";
import { CModal, CModalBody, CButton } from "@coreui/react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./FlagUserModal.css";

export interface FlagUserModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const STORAGE_KEY = "walky-admin-flag-user-hide-message";

export const FlagUserModal: React.FC<FlagUserModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Load preference on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setDontShowAgain(true);
    }
  }, []);

  const handleConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    onConfirm();
  };

  const handleCancel = () => {
    // Don't save preference on cancel
    onClose();
  };

  const handleCheckboxChange = () => {
    setDontShowAgain(!dontShowAgain);
  };

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      alignment="center"
      backdrop="static"
      className="flag-user-modal"
    >
      <CModalBody className="flag-user-modal-body">
        {/* Close button */}
        <button
          data-testid="flag-modal-close-btn"
          className="flag-modal-close-icon"
          onClick={handleCancel}
          aria-label="Close modal"
        >
          <AssetIcon name="x-icon" size={16} color="#5B6168" />
        </button>

        <div className="flag-modal-content">
          {/* Content Section */}
          <div>
            {/* Title */}
            <h2 className="flag-modal-title">Flagging a user</h2>

            {/* Description */}
            <div className="flag-modal-description-container">
              <p className="flag-modal-description">
                When you flag a user, their profile will be highlighted, and
                this action will be visible to other administrators. This helps
                the team keep track of important cases.
              </p>
            </div>

            {/* Checkbox */}
            <div className="flag-modal-checkbox-container">
              <label className="flag-modal-checkbox-label">
                <input
                  data-testid="flag-modal-checkbox"
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={handleCheckboxChange}
                  className="flag-modal-checkbox-input"
                />
                <span className="flag-modal-checkbox-custom">
                  {dontShowAgain && (
                    <svg
                      width="12"
                      height="9"
                      viewBox="0 0 12 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 4.5L4.5 8L11 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="flag-modal-checkbox-text">
                  Do not show this message again
                </span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flag-modal-button-container">
            <CButton
              color="light"
              onClick={handleCancel}
              className="flag-modal-cancel-button"
            >
              Cancel
            </CButton>
            <CButton
              onClick={handleConfirm}
              className="flag-modal-confirm-button"
            >
              Flag user
            </CButton>
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};

export default FlagUserModal;
