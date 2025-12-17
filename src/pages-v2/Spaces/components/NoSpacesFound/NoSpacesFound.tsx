import React from "react";
import { AssetIcon } from "../../../../components-v2";
import "./NoSpacesFound.css";

interface NoSpacesFoundProps {
  message?: string;
}

export const NoSpacesFound: React.FC<NoSpacesFoundProps> = ({
  message = "No spaces found",
}) => {
  return (
    <div className="no-spaces-found">
      <div className="no-spaces-icon-circle">
        <AssetIcon name="space-icon" size={48} color="#526AC9" />
      </div>
      <p className="no-spaces-text">{message}</p>
    </div>
  );
};
