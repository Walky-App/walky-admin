import React from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./UnsavedChangesModal.css";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeave: () => void;
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onClose,
  onLeave,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="unsaved-changes-overlay" onClick={handleOverlayClick}>
      <div className="unsaved-changes-content" onClick={handleContentClick}>
        <button className="unsaved-changes-close" onClick={onClose}>
          <AssetIcon name="x-icon" size={16} />
        </button>

        <div className="unsaved-changes-body">
          <h2 className="unsaved-changes-title">Leave without updating</h2>

          <div className="unsaved-changes-message">
            <p className="unsaved-changes-question">
              Are you sure you want to continue?
            </p>
            <p className="unsaved-changes-warning">
              Any unsaved progress will be lost.
            </p>
          </div>

          <div className="unsaved-changes-buttons">
            <button className="unsaved-changes-stay" onClick={onClose}>
              Stay
            </button>
            <button className="unsaved-changes-leave" onClick={onLeave}>
              Leave without updating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;
