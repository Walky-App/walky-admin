import React, { useState } from "react";
import { CModal, CModalBody } from "@coreui/react";
import "./DeleteModal.css";
import { AssetIcon } from "../../components-v2";

export type DeleteModalType = "event" | "space" | "idea";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  itemName: string;
  type: DeleteModalType;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  type,
}) => {
  const [reason, setReason] = useState("");
  const maxChars = 500;

  const typeLabels = {
    event: "Event",
    space: "Space",
    idea: "Idea",
  };

  const typeLabel = typeLabels[type];

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
    onClose();
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <CModal
      visible={isOpen}
      onClose={handleClose}
      alignment="center"
      backdrop="static"
      className="delete-modal-wrapper"
    >
      <CModalBody className="delete-modal-body">
        <button
          data-testid="delete-modal-close-btn"
          className="delete-modal-close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={16} color="#5b6168" />
        </button>

        <h2 className="delete-modal-title">Delete {typeLabel}</h2>

        <div className="delete-modal-message">
          <p className="delete-modal-question">
            Are you sure you want to delete <strong>{itemName}</strong>{" "}
            {typeLabel}?
          </p>
          <p className="delete-modal-warning">
            This action cannot be undone. The {typeLabel} and all its related
            information will be permanently removed from the platform.
          </p>
        </div>

        <div className="delete-modal-reason">
          <div className="delete-modal-input-wrapper">
            <label className="delete-modal-label">Write a reason</label>
            <textarea
              className="delete-modal-textarea"
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, maxChars))}
              maxLength={maxChars}
            />
          </div>
          <p className="delete-modal-char-count">
            {reason.length}/{maxChars} characters
          </p>
        </div>

        <div className="delete-modal-actions">
          <button
            data-testid="delete-modal-cancel-btn"
            className="delete-modal-cancel-btn"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            data-testid="delete-modal-confirm-btn"
            className="delete-modal-confirm-btn"
            onClick={handleConfirm}
          >
            Delete {typeLabel}
          </button>
        </div>
      </CModalBody>
    </CModal>
  );
};
