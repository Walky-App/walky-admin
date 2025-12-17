import React from "react";
import { useTheme } from "../../hooks/useTheme";
import "./LastUpdated.css";

interface LastUpdatedProps {
  className?: string;
  lastUpdated?: string | Date;
}

const formatDate = (value: string | Date | undefined): string => {
  if (!value) return "–";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "–";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const LastUpdated: React.FC<LastUpdatedProps> = ({
  className = "",
  lastUpdated,
}) => {
  const { theme } = useTheme();
  const formattedDate = formatDate(lastUpdated ?? new Date());

  return (
    <div className={`footer-container ${className}`}>
      <div
        className="last-updated-left"
        style={{ backgroundColor: theme.colors.lastUpdatedBg }}
      >
        <p className="last-updated-text">
          Don't see the data you are looking for?{" "}
          <a
            href="https://walkyapp.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="suggest-link"
            style={{ color: theme.colors.primary }}
          >
            Suggest here
          </a>
        </p>
      </div>
      <div className="last-updated-right">
        <p className="last-updated-text">Last updated: {formattedDate}</p>
      </div>
    </div>
  );
};
