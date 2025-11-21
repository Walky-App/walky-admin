import React, { useState } from "react";
import { CModal, CModalBody } from "@coreui/react";
import "./ScheduledEventsModal.css";
import { AssetIcon } from "../../components-v2";

export interface ScheduledEventItem {
  id: string;
  eventName: string;
  eventImage?: string;
  date: string;
  time: string;
  location: string;
}

interface ScheduledEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string; // e.g., "October 16"
  events: ScheduledEventItem[];
  onEventClick: (eventId: string) => void;
}

export const ScheduledEventsModal: React.FC<ScheduledEventsModalProps> = ({
  isOpen,
  onClose,
  date,
  events,
  onEventClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CModal
      visible={isOpen}
      onClose={onClose}
      className="scheduled-events-modal-wrapper"
      alignment="center"
      backdrop="static"
    >
      <CModalBody className="scheduled-events-modal-body">
        <button
          onClick={onClose}
          className="scheduled-events-close"
          aria-label="Close"
        >
          <AssetIcon name="x-icon" size={16} color="#5B6168" />
        </button>

        <div className="scheduled-events-content">
          {/* Header */}
          <div className="scheduled-events-header">
            <h2 className="scheduled-events-title">Scheduled Events</h2>
            <p className="scheduled-events-subtitle">
              List of events scheduled for{" "}
              <span className="date-bold">{date}</span>
            </p>
          </div>

          {/* Event List Container */}
          <div className="scheduled-events-list-container">
            {/* Search Input */}
            <div className="scheduled-events-search-wrapper">
              <div className="scheduled-events-search">
                <div className="search-input-container">
                  <AssetIcon name="search-icon" size={12} color="#676D70" />
                  <input
                    type="text"
                    placeholder="Search Event"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
            </div>

            {/* Event Cards */}
            <div className="scheduled-events-cards">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="scheduled-event-card"
                    onClick={() => onEventClick(event.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        onEventClick(event.id);
                      }
                    }}
                  >
                    <div className="scheduled-event-card-content">
                      {/* Event Image */}
                      <div className="scheduled-event-image">
                        {event.eventImage ? (
                          <img src={event.eventImage} alt={event.eventName} />
                        ) : (
                          <div className="scheduled-event-image-placeholder">
                            <AssetIcon
                              name="calendar-icon"
                              size={40}
                              color="#A9ABAC"
                            />
                          </div>
                        )}
                      </div>

                      {/* Event Information */}
                      <div className="scheduled-event-info">
                        <p className="scheduled-event-datetime">
                          {event.date} | {event.time}
                        </p>
                        <h3 className="scheduled-event-name">
                          {event.eventName}
                        </h3>
                        <div className="scheduled-event-location">
                          <AssetIcon
                            name="location-icon"
                            size={20}
                            color="#1D1B20"
                          />
                          <span className="location-text">
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Chevron Arrow */}
                    <div className="scheduled-event-arrow">
                      <AssetIcon name="arrow-down" size={16} color="#1D1B20" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="scheduled-events-empty">
                  <p>No events found</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="scheduled-events-footer">
            <button onClick={onClose} className="scheduled-events-close-btn">
              Close
            </button>
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};
