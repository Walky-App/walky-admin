import React from "react";
import { CModal, CModalBody } from "@coreui/react";
import "./EventDetailsModal.css";
import { AssetIcon } from "../../components-v2";
import { EventTypeChip } from "../../pages-v2/Events/components/EventTypeChip";

export interface EventAttendee {
  id: string;
  name: string;
  avatar?: string;
}

export interface EventDetailsData {
  id: string;
  eventName: string;
  eventImage?: string;
  organizer: {
    name: string;
    studentId: string;
    avatar?: string;
  };
  date: string;
  time: string;
  place: string;
  type: "public" | "private";
  description: string;
  attendees: EventAttendee[];
  maxAttendees: number;
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: EventDetailsData | null;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  eventData,
}) => {
  if (!eventData) return null;

  const handleCopyStudentId = (studentId: string) => {
    navigator.clipboard.writeText(studentId);
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <CModal
      visible={isOpen}
      onClose={onClose}
      size="xl"
      alignment="center"
      backdrop="static"
      className="event-details-modal-wrapper"
    >
      <CModalBody className="event-details-modal-body">
        <button className="event-details-close" onClick={onClose}>
          <AssetIcon name="x-icon" size={16} color="#5b6168" />
        </button>

        <div className="event-details-content">
          {/* Header */}
          <div className="event-details-header">
            <button className="event-details-back-btn" onClick={handleBack}>
              <AssetIcon
                name="arrow-down"
                size={32}
                color="#1d1b20"
                style={{ transform: "rotate(90deg)" }}
              />
            </button>
            <h2 className="event-details-title">Event details</h2>
          </div>

          {/* Main Content */}
          <div className="event-details-main">
            {/* Left Column */}
            <div className="event-details-left">
              {/* Event Picture */}
              <div className="event-details-section">
                <h3 className="event-details-section-title">Event picture</h3>
                <div className="event-details-image">
                  {eventData.eventImage ? (
                    <img src={eventData.eventImage} alt={eventData.eventName} />
                  ) : (
                    <div className="event-details-image-placeholder">
                      <AssetIcon
                        name="calendar-icon"
                        size={64}
                        color="#d2d2d3"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Event Organizer */}
              <div className="event-details-section">
                <h3 className="event-details-section-title">Event organizer</h3>
                <div className="event-details-organizer">
                  <div className="event-organizer-avatar">
                    {eventData.organizer.avatar ? (
                      <img
                        src={eventData.organizer.avatar}
                        alt={eventData.organizer.name}
                      />
                    ) : (
                      <div className="event-organizer-avatar-placeholder">
                        {eventData.organizer.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="event-organizer-info">
                    <p className="event-organizer-name">
                      {eventData.organizer.name}
                    </p>
                    <div className="event-organizer-id-container">
                      <div className="event-organizer-id-badge">
                        {eventData.organizer.studentId}
                      </div>
                      <button
                        className="event-organizer-copy-btn"
                        onClick={() =>
                          handleCopyStudentId(eventData.organizer.studentId)
                        }
                      >
                        <AssetIcon name="copy-icon" size={16} color="#ACB6BA" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="event-details-section">
                <h3 className="event-details-section-title">Information</h3>
                <div className="event-details-info-box">
                  <div className="event-info-row">
                    <span className="event-info-label">Name:</span>
                    <span className="event-info-value">
                      {eventData.eventName}
                    </span>
                  </div>
                  <div className="event-info-row">
                    <span className="event-info-label">Date & hour:</span>
                    <span className="event-info-value">
                      {eventData.date} | {eventData.time}
                    </span>
                  </div>
                  <div className="event-info-row">
                    <span className="event-info-label">Place:</span>
                    <span className="event-info-value">{eventData.place}</span>
                  </div>
                  <div className="event-info-row">
                    <span className="event-info-label">Type:</span>
                    <EventTypeChip type={eventData.type} />
                  </div>
                  <div className="event-info-description">
                    <span className="event-info-label">Description:</span>{" "}
                    <span className="event-info-value">
                      {eventData.description}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="event-details-divider"></div>

            {/* Right Column - Attendees */}
            <div className="event-details-right">
              <div className="event-attendees-header">
                <span className="event-attendees-label">
                  Number of attendees
                </span>
                <span className="event-attendees-count">
                  {eventData.attendees.length}/{eventData.maxAttendees}
                </span>
              </div>

              <div className="event-attendees-list">
                {eventData.attendees.map((attendee) => (
                  <div key={attendee.id} className="event-attendee-item">
                    <div className="event-attendee-avatar">
                      {attendee.avatar ? (
                        <img src={attendee.avatar} alt={attendee.name} />
                      ) : (
                        <div className="event-attendee-avatar-placeholder">
                          {attendee.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <p className="event-attendee-name">{attendee.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="event-details-footer">
            <button className="event-details-close-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};
