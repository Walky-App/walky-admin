import React from "react";
import { CCard, CCardBody } from "@coreui/react";

export interface InfoStatWidgetProps {
  title?: string;
  label?: string; // Alias for title for backwards compatibility
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
  tooltip?: string; // Optional tooltip text
}

const InfoStatWidget: React.FC<InfoStatWidgetProps> = ({
  title,
  label,
  value,
  icon,
  color = "primary",
  className = "",
}) => {
  const displayTitle = title || label || "";
  return (
    <CCard className={`border-0 shadow-sm ${className}`}>
      <CCardBody className="d-flex align-items-center">
        {icon && (
          <div
            className={`rounded-circle p-3 me-3 bg-${color} bg-opacity-10`}
          >
            {icon}
          </div>
        )}
        <div>
          <div className="text-muted small text-uppercase">{displayTitle}</div>
          <div className="fs-4 fw-semibold">{value}</div>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default InfoStatWidget;
