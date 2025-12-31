import React, { useState } from "react";
import { CModal, CModalBody } from "@coreui/react";
import { AssetIcon } from "../AssetIcon/AssetIcon";
import "./WriteNoteModal.css";

export interface WriteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  title?: string;
  description?: string;
  maxCharacters?: number;
}

export const WriteNoteModal: React.FC<WriteNoteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Write a note",
  description = "Add a brief note describing the actions or steps you took regarding this report.",
  maxCharacters = 500,
}) => {
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    if (note.trim()) {
      onConfirm(note);
      setNote("");
      onClose();
    }
  };

  const handleClose = () => {
    setNote("");
    onClose();
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setNote(value);
    }
  };

  return (
    <CModal
      visible={isOpen}
      onClose={handleClose}
      alignment="center"
      className="write-note-modal"
    >
      <CModalBody className="write-note-modal-body">
        <button
          className="write-note-close-button"
          onClick={handleClose}
          data-testid="write-note-modal-close-btn"
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={24} color="#5b6168" />
        </button>

        <div className="write-note-content">
          <h2 className="write-note-title">{title}</h2>

          <p className="write-note-description">{description}</p>

          <div className="write-note-input-container">
            <label className="write-note-label">Add a note</label>
            <textarea
              className="write-note-textarea"
              placeholder="Write here"
              value={note}
              onChange={handleNoteChange}
              rows={4}
            />
            <p className="write-note-character-count">
              {note.length}/{maxCharacters} characters
            </p>
          </div>

          <div className="write-note-button-container">
            <button
              className="write-note-cancel-button"
              data-testid="write-note-cancel-button"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="write-note-confirm-button"
              data-testid="write-note-confirm-button"
              onClick={handleConfirm}
              disabled={!note.trim()}
            >
              Confirm
            </button>
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};
