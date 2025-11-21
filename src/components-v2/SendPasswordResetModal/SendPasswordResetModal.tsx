import React, { useState } from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./SendPasswordResetModal.css";

interface SendPasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dontShowAgain: boolean) => void;
}

const SendPasswordResetModal: React.FC<SendPasswordResetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSendLink = () => {
    onConfirm(dontShowAgain);
    setDontShowAgain(false); // Reset for next time
  };

  return (
    <div className="send-password-overlay" onClick={handleOverlayClick}>
      <div className="send-password-content" onClick={handleContentClick}>
        <button
          data-testid="send-password-close-btn"
          className="send-password-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <AssetIcon name="x-icon" size={16} />
        </button>

        <div className="send-password-body">
          <h2 className="send-password-title">Send password reset</h2>

          <p className="send-password-description">
            A password reset link will be sent to the user's registered email
            address.
          </p>

          <div className="send-password-checkbox-container">
            <label className="send-password-checkbox-label">
              <input
                data-testid="send-password-checkbox"
                type="checkbox"
                className="send-password-checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              <span className="send-password-checkbox-text">
                Do not show this message again
              </span>
            </label>
          </div>

          <div className="send-password-buttons">
            <button
              data-testid="send-password-cancel-btn"
              className="send-password-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              data-testid="send-password-confirm-btn"
              className="send-password-confirm"
              onClick={handleSendLink}
            >
              Send link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendPasswordResetModal;
