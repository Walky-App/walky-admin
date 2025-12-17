import React from "react";
import AssetIcon, { IconName } from "../AssetIcon/AssetIcon";
import "./NoData.css";

export type NoDataType = "primary";

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
  return (
    <div className={`no-data no-data-${type}`}>
      <div className="no-data-icon">
        <AssetIcon name={iconName} size={iconSize} color={iconColor} />
      </div>
      <p className="no-data-text">{message}</p>
    </div>
  );
};
