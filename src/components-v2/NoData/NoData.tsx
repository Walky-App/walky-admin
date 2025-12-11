import React from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./NoData.css";

export type NoDataType = "primary";

export interface NoDataProps {
  type?: NoDataType;
  message?: string;
}

export const NoData: React.FC<NoDataProps> = ({
  type = "primary",
  message = "No data yet",
}) => {
  return (
    <div className={`no-data no-data-${type}`}>
      <div className="no-data-icon">
        <AssetIcon name="double-users-icon" size={40} color="#526AC9" />
      </div>
      <p className="no-data-text">{message}</p>
    </div>
  );
};
