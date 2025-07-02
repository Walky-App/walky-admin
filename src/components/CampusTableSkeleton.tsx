import React from "react";
import { CTableRow, CTableDataCell } from "@coreui/react";
import SkeletonLoader from "./SkeletonLoader";

interface CampusTableSkeletonProps {
  rows?: number;
}

const CampusTableSkeleton: React.FC<CampusTableSkeletonProps> = ({
  rows = 3,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <CTableRow key={`skeleton-${index}`}>
          {/* Checkbox Column */}
          <CTableDataCell style={{ width: "50px" }}>
            <SkeletonLoader width="16px" height="16px" borderRadius="2px" />
          </CTableDataCell>

          {/* Campus Column */}
          <CTableDataCell>
            <div className="d-flex align-items-center">
              <SkeletonLoader
                width="40px"
                height="40px"
                borderRadius="4px"
                className="me-3"
              />
              <SkeletonLoader width="120px" height="20px" />
            </div>
          </CTableDataCell>

          {/* Location Column */}
          <CTableDataCell>
            <SkeletonLoader width="100px" height="16px" />
          </CTableDataCell>

          {/* Address Column */}
          <CTableDataCell>
            <SkeletonLoader width="180px" height="16px" />
          </CTableDataCell>

          {/* Geofence Column */}
          <CTableDataCell>
            <SkeletonLoader width="90px" height="24px" borderRadius="12px" />
          </CTableDataCell>

          {/* Status Column */}
          <CTableDataCell>
            <SkeletonLoader width="60px" height="24px" borderRadius="12px" />
          </CTableDataCell>

          {/* Actions Column */}
          <CTableDataCell>
            <div className="d-flex">
              <SkeletonLoader
                width="32px"
                height="32px"
                borderRadius="4px"
                className="me-2"
              />
              <SkeletonLoader width="32px" height="32px" borderRadius="4px" />
            </div>
          </CTableDataCell>
        </CTableRow>
      ))}
    </>
  );
};

export default CampusTableSkeleton;
