import React from "react";
import { CModal, CModalBody } from "@coreui/react";
import "./EventDetailsModal.css";
import { AssetIcon, CopyableId } from "../../components-v2";
import { EventStatusChip } from "../../pages-v2/Events/components/EventStatusChip/EventStatusChip";

export interface EventAttendee {
  id: string;
  name: string;
  avatar?: string;
  status?: "confirmed" | "pending" | "declined";
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
  status: "upcoming" | "finished";
  type: "public" | "private";
  description: string;
  attendees: EventAttendee[];
  maxAttendees: number;
  isFlagged?: boolean;
  flagReason?: string;
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: EventDetailsData | null;
  onDelete?: (event: EventDetailsData) => void;
  onFlag?: (event: EventDetailsData) => void;
  onUnflag?: (event: EventDetailsData) => void;
  onCloseAll?: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  eventData,
  onDelete: _onDelete,
  onFlag: _onFlag,
  onUnflag: _onUnflag,
  onCloseAll,
}) => {
  // Log event data when modal opens
  React.useEffect(() => {
    if (isOpen && eventData) {
      console.log("Event Details Modal opened with data:", eventData);
    }
  }, [isOpen, eventData]);

  const getFirstName = (name: string) => name?.trim().split(" ")[0] || name;

  const handleBack = () => {
    onClose();
  };

  if (!eventData) return null;

  const organizerFirstName = getFirstName(eventData.organizer.name);

  const handleCloseAll = () => {
    if (onCloseAll) {
      onCloseAll();
    } else {
      onClose();
    }
  };

  return (
    <CModal
      visible={isOpen}
      onClose={handleCloseAll}
      size="xl"
      alignment="center"
      backdrop="static"
      className="event-details-modal-wrapper"
    >
      <CModalBody className="event-details-modal-body">
        <button
          data-testid="event-details-close-btn"
          className="event-details-close"
          onClick={handleCloseAll}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={16} color="#5b6168" />
        </button>

        <div className="event-details-content">
          {/* Header */}
          <div className="event-details-header">
            <button
              data-testid="event-details-back-btn"
              className="event-details-back-btn"
              onClick={handleBack}
              aria-label="Go back"
            >
              <AssetIcon
                name="arrow-large-left-icon"
                size={32}
                color="#1d1b20"
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
                        alt={organizerFirstName}
                      />
                    ) : (
                      <div className="event-organizer-avatar-placeholder">
                        {organizerFirstName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="event-organizer-info">
                    <p className="event-organizer-name">{organizerFirstName}</p>
                    <CopyableId
                      id={eventData.organizer.studentId}
                      label="Student ID"
                      testId="event-organizer-copy"
                    />
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
                    <span className="event-info-label">Status:</span>
                    <EventStatusChip status={eventData.status} />
                  </div>
                  <div className="event-info-row">
                    <span className="event-info-label">Type:</span>
                    <span className="event-info-value">
                      {eventData.type === "public" ? "Public" : "Private"}
                    </span>
                  </div>
                  <div className="event-info-description">
                    <span className="event-info-label">Description:</span>{" "}
                    <span className="event-info-value">
                      {eventData.description}
                    </span>
                  </div>
                  {eventData.isFlagged && eventData.flagReason && (
                    <div className="event-info-flag-reason">
                      <span className="event-info-label">Flag reason:</span>{" "}
                      <span className="event-info-value event-info-value-flagged">
                        {eventData.flagReason}
                      </span>
                    </div>
                  )}
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
                  {eventData.type === "public"
                    ? eventData.attendees.filter(
                        (a) => a.status === "confirmed"
                      ).length
                    : eventData.attendees.length}
                  /{eventData.maxAttendees}
                </span>
              </div>

              <div className="event-attendees-list">
                {(eventData.type === "public"
                  ? eventData.attendees.filter((a) => a.status === "confirmed")
                  : eventData.attendees
                ).map((attendee) => {
                  const attendeeFirstName = getFirstName(attendee.name);
                  return (
                    <div key={attendee.id} className="event-attendee-item">
                      <div className="event-attendee-avatar">
                        {attendee.avatar ? (
                          <img src={attendee.avatar} alt={attendee.name} />
                        ) : (
                          <div className="event-attendee-avatar-placeholder">
                            {attendeeFirstName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <p className="event-attendee-name">{attendeeFirstName}</p>
                      {eventData.type === "private" && attendee.status && (
                        <div className="event-attendee-status">
                          {attendee.status === "confirmed" && (
                            <AssetIcon name="check-icon" size={16} />
                          )}
                          {attendee.status === "declined" && (
                            <AssetIcon name="x-icon" size={16} />
                          )}
                          {attendee.status === "pending" && (
                            <div className="status-pending-dot"></div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="event-details-footer">
            <button
              data-testid="event-details-close-footer-btn"
              className="event-details-close-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};
