import React from "react";
import "./DashboardSkeleton.css";
import { SkeletonLoader } from "../../../components-v2";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="dashboard-skeleton">
      {/* Header / Filter Bar */}
      <div className="skeleton-header">
        <SkeletonLoader height="40px" width="100%" borderRadius="8px" />
      </div>

      {/* Stats Cards Row */}
      <div className="skeleton-stats-row">
        <SkeletonLoader height="120px" width="32%" borderRadius="12px" />
        <SkeletonLoader height="120px" width="32%" borderRadius="12px" />
        <SkeletonLoader height="120px" width="32%" borderRadius="12px" />
      </div>

      {/* Charts Row */}
      <div className="skeleton-charts-row">
        <SkeletonLoader height="300px" width="65%" borderRadius="12px" />
        <SkeletonLoader height="300px" width="33%" borderRadius="12px" />
      </div>

      {/* Additional Row */}
      <div className="skeleton-bottom-row">
        <SkeletonLoader height="200px" width="100%" borderRadius="12px" />
      </div>
    </div>
  );
};
