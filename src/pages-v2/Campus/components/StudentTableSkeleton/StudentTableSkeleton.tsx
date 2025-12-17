import React from "react";
import "./StudentTableSkeleton.css";

export const StudentTableSkeleton: React.FC = () => {
  return (
    <div className="student-table-skeleton">
      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Student ID</th>
            <th>Interests</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, index) => (
            <React.Fragment key={index}>
              <tr className="skeleton-row">
                <td>
                  <div className="skeleton-student">
                    <div className="skeleton skeleton-avatar"></div>
                    <div className="skeleton skeleton-text skeleton-student-name"></div>
                  </div>
                </td>
                <td>
                  <div className="skeleton skeleton-text skeleton-email"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-text skeleton-student-id"></div>
                </td>
                <td>
                  <div className="skeleton-interests">
                    <div className="skeleton skeleton-chip"></div>
                    <div className="skeleton skeleton-chip"></div>
                  </div>
                </td>
                <td>
                  <div className="skeleton skeleton-chip"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-dots"></div>
                </td>
              </tr>
              {index < 9 && (
                <tr className="student-divider-row">
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
