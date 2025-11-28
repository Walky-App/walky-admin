import React from "react";
import { AssetIcon } from "../../../../components-v2";
import { useTheme } from "../../../../hooks/useTheme";
import "./StatsCard.css";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  trend?: {
    value: string;
    direction: "up" | "down";
    text: string;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  trend,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="stats-card"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor,
        color: theme.colors.bodyColor,
      }}
    >
      <div className="stats-card-header">
        <p
          className="stats-card-title"
          style={{ color: theme.colors.textMuted }}
        >
          {title}
        </p>
        <div
          className="stats-icon-container"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
      </div>

      <p className="stats-card-value" style={{ color: theme.colors.bodyColor }}>
        {value}
      </p>

      {trend && (
        <div className="stats-change-container">
          <div className={`trend-icon trend-${trend.direction}`}>
            <AssetIcon
              name={
                trend.direction === "up" ? "trend-up-icon" : "trend-down-icon"
              }
              size={16}
              color={trend.direction === "up" ? "#18682c" : "#d53425"}
            />
          </div>
          <p className="stats-change-text">
            <span
              className={trend.direction === "up" ? "trend-up" : "trend-down"}
              style={{
                color: trend.direction === "up" ? "#18682c" : "#d53425",
              }}
            >
              {trend.value}
            </span>{" "}
            <span style={{ color: theme.colors.textMuted }}>{trend.text}</span>
          </p>
        </div>
      )}
    </div>
  );
};
