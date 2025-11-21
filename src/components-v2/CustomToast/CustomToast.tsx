import React, { useEffect } from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./CustomToast.css";

interface CustomToastProps {
  message: string;
  onClose: () => void;
  duration?: number; // duration in milliseconds, default 3000ms (3s)
}

export const CustomToast: React.FC<CustomToastProps> = ({
  message,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="custom-toast">
      <div className="custom-toast-container">
        <div className="custom-toast-message-container">
          <div className="custom-toast-icon-success">
            <div className="custom-toast-icon-bg"></div>
            <div className="custom-toast-icon-check">
              <AssetIcon name="check-icon" size={21} color="#FFFFFF" />
            </div>
          </div>
          <div className="custom-toast-content">
            <p className="custom-toast-text">{message}</p>
          </div>
        </div>
        <button
          data-testid="custom-toast-close-btn"
          className="custom-toast-close-btn"
          onClick={onClose}
          aria-label="Close notification"
        >
          <AssetIcon name="close-button" size={14} color="#5B6168" />
        </button>
      </div>
    </div>
  );
};
