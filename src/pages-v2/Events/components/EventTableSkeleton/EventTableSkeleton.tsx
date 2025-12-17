import React from "react";
import "./EventTableSkeleton.css";

export const EventTableSkeleton: React.FC = () => {
  return (
    <div className="event-table-skeleton">
      <table className="event-table">
        <thead>
          <tr>
            <th>Event name</th>
            <th>Organizer</th>
            <th>Date</th>
            <th>Time</th>
            <th>Attendees</th>
            <th>Status</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, index) => (
            <React.Fragment key={index}>
              <tr className="skeleton-row">
                <td>
                  <div className="skeleton skeleton-text skeleton-event-name"></div>
                </td>
                <td>
                  <div className="skeleton-organizer">
                    <div className="skeleton skeleton-avatar"></div>
                    <div className="skeleton skeleton-text skeleton-organizer-name"></div>
                  </div>
                </td>
                <td>
                  <div className="skeleton skeleton-text skeleton-date"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-text skeleton-time"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-text skeleton-attendees"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-chip"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-text skeleton-type"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-dots"></div>
                </td>
              </tr>
              {index < 9 && (
                <tr className="event-divider-row">
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
