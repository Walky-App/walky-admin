import React, { useState } from "react";
import { CModal, CModalBody } from "@coreui/react";
import "./FlagModal.css";
import { AssetIcon } from "../../components-v2";

export type FlagModalType = "event" | "space" | "idea";

interface FlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  itemName: string;
  type: FlagModalType;
}

export const FlagModal: React.FC<FlagModalProps> = ({
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
      className="flag-modal-wrapper"
    >
      <CModalBody className="flag-modal-body">
        <button
          data-testid="flag-modal-close-btn"
          className="flag-modal-close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={16} color="#5b6168" />
        </button>

        <div className="flag-modal-content">
          <h2 className="flag-modal-title">Flag {typeLabel}</h2>

          <div className="flag-modal-message">
            <p className="flag-modal-question">
              Are you sure you want to flag <strong>{itemName}</strong>{" "}
              {typeLabel}?
            </p>
            <p className="flag-modal-warning">
              This action will mark the {typeLabel} for review. The content will
              be reviewed by administrators and appropriate action will be
              taken.
            </p>
          </div>

          <div className="flag-modal-reason">
            <div className="flag-modal-input-wrapper">
              <label className="flag-modal-label">Write a reason</label>
              <textarea
                className="flag-modal-textarea"
                placeholder="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, maxChars))}
                maxLength={maxChars}
              />
            </div>
            <p className="flag-modal-char-count">
              {reason.length}/{maxChars} characters
            </p>
          </div>

          <div className="flag-modal-actions">
            <button
              data-testid="flag-modal-cancel-btn"
              className="flag-modal-cancel-btn"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              data-testid="flag-modal-confirm-btn"
              className="flag-modal-confirm-btn"
              onClick={handleConfirm}
            >
              Flag {typeLabel}
            </button>
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};
