import React from "react";
import { AssetIcon } from "../../../../components-v2";
import "./NoIdeasFound.css";

interface NoIdeasFoundProps {
  message?: string;
}

export const NoIdeasFound: React.FC<NoIdeasFoundProps> = ({
  message = "No ideas found",
}) => {
  return (
    <div className="no-ideas-found">
      <div className="no-ideas-icon-circle">
        <AssetIcon name="ideia-icon" size={48} color="#526AC9" />
      </div>
      <p className="no-ideas-text">{message}</p>
    </div>
  );
};
