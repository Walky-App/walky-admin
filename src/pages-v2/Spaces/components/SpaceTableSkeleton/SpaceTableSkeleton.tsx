import React from "react";
import "./SpaceTableSkeleton.css";

export const SpaceTableSkeleton: React.FC = () => {
  return (
    <div className="space-table-skeleton">
      <table className="space-table">
        <thead>
          <tr>
            <th style={{ lineHeight: "normal" }}>Space name</th>
            <th>Owner</th>
            <th>Events</th>
            <th>Members</th>
            <th>Creation date</th>
            <th>Creation time</th>
            <th>Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, index) => (
            <React.Fragment key={index}>
              <tr className="skeleton-row">
                <td>
                  <div className="skeleton skeleton-text skeleton-space-name"></div>
                </td>
                <td>
                  <div className="skeleton-owner">
                    <div className="skeleton skeleton-avatar"></div>
                    <div className="skeleton skeleton-text skeleton-owner-name"></div>
                  </div>
                </td>
                <td>
                  <div className="skeleton skeleton-text skeleton-events"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-text skeleton-members"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-text skeleton-date"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-text skeleton-time"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-chip"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-dots"></div>
                </td>
              </tr>
              {index < 9 && (
                <tr className="space-divider-row">
                  <td colSpan={8}>
                    <div className="skeleton-divider"></div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
