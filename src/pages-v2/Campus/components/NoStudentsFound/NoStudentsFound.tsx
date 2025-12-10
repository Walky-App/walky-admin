import React from "react";
import { AssetIcon } from "../../../../components-v2";
import "./NoStudentsFound.css";

interface NoStudentsFoundProps {
  message?: string;
}

export const NoStudentsFound: React.FC<NoStudentsFoundProps> = ({
  message = "No students found",
}) => {
  return (
    <div className="no-students-found">
      <div className="no-students-icon-circle">
        <AssetIcon name="double-users-icon" size={48} color="#526AC9" />
      </div>
      <p className="no-students-text">{message}</p>
    </div>
  );
};
