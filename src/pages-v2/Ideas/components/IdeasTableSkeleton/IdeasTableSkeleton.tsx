import React from "react";
import "./IdeasTableSkeleton.css";

export const IdeasTableSkeleton: React.FC = () => {
  return (
    <div className="ideas-table-skeleton">
      <table className="ideas-table">
        <thead>
          <tr>
            <th>Idea title</th>
            <th>Owner</th>
            <th>Collaborated</th>
            <th>Creation date</th>
            <th>Creation time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, index) => (
            <React.Fragment key={index}>
              <tr className="skeleton-row">
                <td>
                  <div className="skeleton skeleton-text skeleton-idea-title"></div>
                </td>
                <td>
                  <div className="skeleton-owner">
                    <div className="skeleton skeleton-avatar"></div>
                    <div className="skeleton skeleton-text skeleton-owner-name"></div>
                  </div>
                </td>
                <td>
                  <div className="skeleton skeleton-text skeleton-collaborated"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-text skeleton-date"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-text skeleton-time"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-dots"></div>
                </td>
              </tr>
              {index < 9 && (
                <tr className="idea-divider-row">
                  <td colSpan={6}>
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
