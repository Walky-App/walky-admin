import React from "react";
import { CTable, CTableBody, CTableRow, CTableDataCell } from "@coreui/react";
import SkeletonLoader from "./SkeletonLoader";

interface CampusTableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const CampusTableSkeleton: React.FC<CampusTableSkeletonProps> = ({
  rows = 5,
  columns = 6,
}) => {
  return (
    <CTable hover responsive>
      <CTableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <CTableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <CTableDataCell key={colIndex}>
                <SkeletonLoader height="20px" />
              </CTableDataCell>
            ))}
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default CampusTableSkeleton;
