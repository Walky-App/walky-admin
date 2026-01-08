import React from "react";
import AssetIcon, { IconName } from "../AssetIcon/AssetIcon";
import "./NoData.css";

export type NoDataType = "primary" | "graph";

export interface NoDataProps {
  type?: NoDataType;
  message?: string;
  iconName?: IconName;
  iconColor?: string;
  iconSize?: number;
}

export const NoData: React.FC<NoDataProps> = ({
  type = "primary",
  message = "No data yet",
  iconName = "double-users-icon",
  iconColor = "#526AC9",
  iconSize = 40,
}) => {
  // Special rendering for graph type - uses nd-graf-icon as background with text overlay
  if (type === "graph") {
    return (
      <div className="no-data no-data-graph">
        <div className="no-data-graph-container">
          <AssetIcon
            name="nd-graf-icon"
            className="no-data-graph-bg"
            style={{ width: "100%", height: "100%" }}
          />
          <p className="no-data-graph-text">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`no-data no-data-${type}`}>
      <div className="no-data-icon">
        <AssetIcon name={iconName} size={iconSize} color={iconColor} />
      </div>
      <p className="no-data-text">{message}</p>
    </div>
  );
};
