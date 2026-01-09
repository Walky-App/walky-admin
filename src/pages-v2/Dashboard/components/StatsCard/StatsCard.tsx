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
    direction: "up" | "down" | "neutral";
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
  const trendColor =
    trend?.direction === "up"
      ? theme.colors.trendUpGreen
      : trend?.direction === "down"
      ? theme.colors.trendDownRed
      : theme.colors.iconBlue;

  return (
    <div
      className="st-stats-card"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor,
        color: theme.colors.bodyColor,
      }}
    >
      <div className="st-stats-card-header">
        <p className="st-stats-card-title">{title}</p>
        <div
          className="st-stats-icon-container"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
      </div>

      <p
        className="st-stats-card-value"
        style={{ color: theme.colors.bodyColor }}
      >
        {value}
      </p>

      {trend && (
        <div className="st-stats-change-container">
          <div className={`st-trend-icon st-trend-${trend.direction}`}>
            {trend.direction === "neutral" ? (
              <span className="st-trend-dash" aria-hidden="true">
                —
              </span>
            ) : (
              <AssetIcon
                name={
                  trend.direction === "up" ? "trend-up-icon" : "trend-down-icon"
                }
                size={24}
                color={trendColor}
              />
            )}
          </div>
          <p className="st-stats-change-text">
            <span
              className={`st-trend-${trend.direction}`}
              style={{ color: trendColor }}
            >
              {trend.value}
            </span>{" "}
            <span style={{ color: "5b6168" }}>{trend.text}</span>
          </p>
        </div>
      )}
    </div>
  );
};
