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
    <div className="delete-modal-overlay" onClick={onClose}>
      <div
        className="delete-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="delete-modal-close" onClick={onClose}>
          <AssetIcon name="x-icon" size={16} />
        </button>

        <div className="delete-modal-body">
          <h2 className="delete-modal-title">Delete Ambassador</h2>

          <div className="delete-modal-message">
            <p className="delete-modal-question">
              Are you sure you want to delete{" "}
              <span className="ambassador-name">{ambassadorName}</span>?
            </p>
            <p className="delete-modal-warning">
              This action cannot be undone.
            </p>
          </div>

          <div className="delete-modal-actions">
            <button className="delete-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="delete-modal-confirm" onClick={handleConfirm}>
              Delete Ambassador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
