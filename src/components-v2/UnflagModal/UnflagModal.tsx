import React from "react";
import { CModal, CModalBody } from "@coreui/react";
import "./UnflagModal.css";
import { AssetIcon } from "../AssetIcon/AssetIcon";

export type UnflagModalType = "event" | "space" | "idea";

interface UnflagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  type: UnflagModalType;
}

export const UnflagModal: React.FC<UnflagModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  type,
}) => {
  const getTypeLabel = () => {
    switch (type) {
      case "event":
        return "event";
      case "space":
        return "space";
      case "idea":
        return "idea";
      default:
        return "item";
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <CModal
      visible={isOpen}
      onClose={onClose}
      alignment="center"
      backdrop="static"
      className="unflag-modal-wrapper"
    >
      <CModalBody className="unflag-modal-body">
        <button
          data-testid="unflag-modal-close-btn"
          className="unflag-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={16} color="#5b6168" />
        </button>

        <div className="unflag-modal-content">
          <h2 className="unflag-modal-title">Unflag {getTypeLabel()}</h2>

          <div className="unflag-modal-message">
            <p className="unflag-modal-question">
              Are you sure you want to unflag <strong>{itemName}</strong>?
            </p>
            <p className="unflag-modal-warning">
              This will remove the flag from this {getTypeLabel()} and it will
              no longer be marked as flagged.
            </p>
          </div>

          <div className="unflag-modal-actions">
            <button
              data-testid="unflag-modal-cancel-btn"
              className="unflag-modal-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              data-testid="unflag-modal-confirm-btn"
              className="unflag-modal-confirm-btn"
              onClick={handleConfirm}
            >
              Unflag {getTypeLabel()}
            </button>
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};
