import React, { useState } from "react";
import { AssetIcon } from "../AssetIcon/AssetIcon";
import { CustomToast } from "../CustomToast/CustomToast";
import "./CopyableId.css";

export interface CopyableIdProps {
  id: string;
  label?: string;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  iconSize?: number;
  iconColor?: string;
  showToast?: boolean;
  toastMessage?: string;
  className?: string;
  testId?: string;
}

export const CopyableId: React.FC<CopyableIdProps> = ({
  id,
  label = "User ID",
  variant = "primary",
  size = "medium",
  iconSize = 16,
  iconColor = "#321FDB",
  showToast = false,
  toastMessage = "ID copied to clipboard",
  className = "",
  testId = "copyable-id",
}) => {
  const [toastVisible, setToastVisible] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);

    if (showToast) {
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
  };

  return (
    <>
      <div
        className={`copyable-id-container ${variant} ${size} ${className}`}
        data-testid={testId}
      >
        <div className="copyable-id-badge">
          <span className="copyable-id-text">{id}</span>
        </div>
        <button
          data-testid={`${testId}-copy-btn`}
          className="copyable-id-copy-btn"
          onClick={handleCopy}
          title={`Copy ${label}`}
          aria-label={`Copy ${label}`}
        >
          <AssetIcon name="copy-icon" size={iconSize} color={iconColor} />
        </button>
      </div>

      {showToast && toastVisible && (
        <CustomToast
          message={toastMessage}
          onClose={() => setToastVisible(false)}
        />
      )}
    </>
  );
};
