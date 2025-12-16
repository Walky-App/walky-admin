import React, { useState, useRef, useEffect } from "react";
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
  collapsed?: boolean;
}

export const CopyableId: React.FC<CopyableIdProps> = ({
  id,
  label = "User ID",
  variant = "primary",
  size = "medium",
  iconSize = 16,
  iconColor = "#6366F1",
  showToast = false,
  toastMessage = "ID copied to clipboard",
  className = "",
  testId = "copyable-id",
  collapsed = true,
}) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsCopied(true);
    setIsHovering(false);

    // Reset after 4 seconds
    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 4000);

    if (showToast) {
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
  };

  const handleMouseEnter = () => {
    if (!isCopied) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const formatId = (id: string): string => {
    if (!collapsed || id.length <= 12) {
      return id;
    }
    const first4 = id.slice(0, 4);
    const last4 = id.slice(-4);
    return `${first4}...${last4}`;
  };

  return (
    <>
      <div
        className={`copyable-id-container ${variant} ${size} ${className}`}
        data-testid={testId}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="copyable-id-badge">
          <span
            className="copyable-id-text"
            style={{ fontFamily: "monospace" }}
          >
            {formatId(id)}
          </span>
        </div>
        <button
          data-testid={`${testId}-copy-btn`}
          className="copyable-id-copy-btn"
          onClick={handleCopy}
          title={`Copy ${label}`}
          aria-label={`Copy ${label}`}
        >
          {isCopied ? (
            <AssetIcon
              name="check-copy-icon"
              size={iconSize}
              color={iconColor}
            />
          ) : (
            <AssetIcon name="copy-icon" size={iconSize} color={iconColor} />
          )}
        </button>

        {/* Hover tooltip */}
        {(isHovering || isCopied) && (
          <div className="copyable-id-tooltip">
            {isCopied ? "Copied!" : `Copy ${label}`}
          </div>
        )}
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
