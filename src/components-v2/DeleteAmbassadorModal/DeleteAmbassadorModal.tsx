import React from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./DeleteAmbassadorModal.css";

interface DeleteAmbassadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ambassadorName: string;
}

export const DeleteAmbassadorModal: React.FC<DeleteAmbassadorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  ambassadorName,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="dam-overlay" onClick={onClose}>
      <div className="dam-content" onClick={(e) => e.stopPropagation()}>
        <button
          data-testid="delete-ambassador-close-btn"
          className="dam-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={16} />
        </button>

        <div className="dam-body">
          <h2 className="dam-title">Delete Ambassador</h2>

          <div className="dam-message">
            <p className="dam-question">
              Are you sure you want to delete{" "}
              <span className="dam-name">{ambassadorName}</span>?
            </p>
            <p className="dam-warning">This action cannot be undone.</p>
          </div>

          <div className="dam-actions">
            <button
              data-testid="delete-ambassador-cancel-btn"
              className="dam-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              data-testid="delete-ambassador-confirm-btn"
              className="dam-confirm-btn"
              onClick={handleConfirm}
            >
              Delete Ambassador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
