import React from "react";
import "./DeleteAccountModal.css";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-account-modal-overlay" onClick={onClose}>
      <div
        className="delete-account-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="delete-account-modal-close"
          onClick={onClose}
          data-testid="delete-account-modal-close"
        >
          ×
        </button>

        <div className="delete-account-modal-body">
          <h2 className="delete-account-modal-title">
            Request to delete account
          </h2>

          <div className="delete-account-modal-message">
            <p className="delete-account-question">
              Are you sure you want to proceed with the account deletion
              request?
            </p>

            <div className="delete-account-alert">
              <p>This action cannot be undone!</p>
            </div>
          </div>

          <div className="delete-account-modal-buttons">
            <button
              className="delete-account-cancel-btn"
              onClick={onClose}
              data-testid="delete-account-cancel-btn"
            >
              Cancel
            </button>
            <button
              className="delete-account-confirm-btn"
              onClick={onConfirm}
              data-testid="delete-account-confirm-btn"
            >
              Send request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
