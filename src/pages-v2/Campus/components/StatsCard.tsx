import React from "react";
import { AssetIcon } from "../../../components-v2";
import "./StatsCard.css";

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName?: "double-users-icon" | "tooltip-icon" | "lock-icon" | "check-icon";
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  tooltip?: string;
  showTooltip?: boolean;
  onTooltipHover?: (show: boolean) => void;
  hideComparison?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  iconName,
  iconBgColor = "#E9FCF4",
  iconColor,
  trend,
  tooltip,
  showTooltip,
  onTooltipHover,
  hideComparison = false,
}) => {
  const hasIcon = Boolean(iconName);
  const iconContainerStyle = hasIcon
    ? { backgroundColor: iconBgColor }
    : { backgroundColor: "transparent" };

  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div className="stats-card-title-container">
          <span className="stats-card-title">{title}</span>
          {tooltip && (
            <div className="stats-card-tooltip-wrapper">
              <button
                data-testid="stats-card-tooltip-btn"
                className="stats-card-tooltip-btn"
                aria-label="More information"
                onMouseEnter={() => onTooltipHover?.(true)}
                onMouseLeave={() => onTooltipHover?.(false)}
              >
                <AssetIcon
                  name="tooltip-icon"
                  size={16}
                  color="#ACB6BA"
                  className="stats-card-tooltip-icon"
                />
              </button>
              {showTooltip && (
                <div className="stats-card-tooltip">{tooltip}</div>
              )}
            </div>
          )}
        </div>
        <div className="stats-card-icon-container-main">
          <div className="stats-card-icon-container" style={iconContainerStyle}>
            {hasIcon ? (
              <AssetIcon name={iconName!} size={24} color={iconColor} />
            ) : null}
          </div>
        </div>
      </div>
      <div className="stats-card-value">{value}</div>
      {trend && !hideComparison && (
        <div className="stats-card-trend">
          <AssetIcon
            name={trend.isPositive ? "trend-up-icon" : "trend-up-red"}
            size={24}
            className="stats-card-trend-icon"
          />
          <span
            className={`stats-card-trend-value ${
              trend.isPositive ? "positive" : "negative"
            }`}
          >
            {trend.value}
          </span>
          <span className="stats-card-trend-label">{trend.label}</span>
        </div>
      )}
      {trend && hideComparison && (
        <div className="stats-card-trend" style={{ visibility: "hidden" }}>
          <AssetIcon
            name="trend-up-icon"
            size={24}
            className="stats-card-trend-icon"
          />
          <span className="stats-card-trend-value">0%</span>
          <span className="stats-card-trend-label">placeholder</span>
        </div>
      )}
    </div>
  );
};
