import React from "react";
import "./LogoutAllDevicesModal.css";

interface LogoutAllDevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutAllDevicesModal: React.FC<LogoutAllDevicesModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="logout-all-modal-overlay" onClick={onClose}>
      <div
        className="logout-all-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="logout-all-modal-close"
          onClick={onClose}
          data-testid="logout-all-modal-close"
        >
          ×
        </button>

        <div className="logout-all-modal-body">
          <h2 className="logout-all-modal-title">Logout all devices</h2>

          <div className="logout-all-modal-message">
            <p className="logout-all-question">
              Are you sure you want to logout of all devices?
            </p>

            <p className="logout-all-description">
              You will remain logged in on this device, but all other active
              sessions will be terminated.
            </p>
          </div>

          <div className="logout-all-modal-buttons">
            <button
              className="logout-all-cancel-btn"
              onClick={onClose}
              data-testid="logout-all-cancel-btn"
            >
              Cancel
            </button>
            <button
              className="logout-all-confirm-btn"
              onClick={onConfirm}
              data-testid="logout-all-confirm-btn"
            >
              Logout all divices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
