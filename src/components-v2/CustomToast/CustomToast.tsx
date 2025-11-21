import React from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./CustomToast.css";

interface CustomToastProps {
  message: string;
  onClose: () => void;
}

export const CustomToast: React.FC<CustomToastProps> = ({
  message,
  onClose,
}) => {
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
        <button className="custom-toast-close-btn" onClick={onClose}>
          <AssetIcon name="x-icon" size={16} color="#5B6168" />
        </button>
      </div>
    </div>
  );
};
