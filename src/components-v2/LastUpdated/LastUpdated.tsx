import React from "react";
import { useTheme } from "../../hooks/useTheme";
import "./LastUpdated.css";

interface LastUpdatedProps {
  className?: string;
}

export const LastUpdated: React.FC<LastUpdatedProps> = ({ className = "" }) => {
  const { theme } = useTheme();

  return (
    <div className={`footer-container ${className}`}>
      <div
        className="last-updated-left"
        style={{ backgroundColor: theme.colors.lastUpdatedBg }}
      >
        <p
          className="last-updated-text"
          style={{ color: theme.colors.textMuted }}
        >
          Don't see the data you are looking for?{" "}
          <a
            href="#"
            className="suggest-link"
            style={{ color: theme.colors.primary }}
          >
            Suggest here
          </a>
        </p>
      </div>
      <div className="last-updated-right">
        <p
          className="last-updated-text"
          style={{ color: theme.colors.textMuted }}
        >
          Last updated: Oct 25, 2025
        </p>
      </div>
    </div>
  );
};
