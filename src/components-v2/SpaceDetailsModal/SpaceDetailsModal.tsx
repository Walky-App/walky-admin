import React, { useState } from "react";
import { CModal, CModalBody } from "@coreui/react";
import "./SpaceDetailsModal.css";
import {
  AssetIcon,
  CopyableId,
  SearchInput,
  EventDetailsModal,
} from "../../components-v2";
import { SpaceTypeChip } from "../../pages-v2/Spaces/components/SpaceTypeChip/SpaceTypeChip";
import type { EventDetailsData } from "../../components-v2/EventDetailsModal/EventDetailsModal";
import { getFirstName } from "../../lib/utils/nameUtils";

export interface SpaceMember {
  id: string;
  name: string;
  avatar?: string;
}

export interface SpaceEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image?: string;
}

export interface SpaceDetailsData {
  id: string;
  spaceName: string;
  spaceImage?: string;
  spaceLogo?: string;
  owner: {
    name: string;
    studentId: string;
    avatar?: string;
  };
  creationDate: string;
  creationTime: string;
  category: string;
  chapter: string;
  contact: string;
  about: string;
  howWeUse: string;
  description: string;
  members: SpaceMember[];
  events: SpaceEvent[];
  yearEstablished?: string;
  governingBody?: string;
  primaryFocus?: string;
  memberRange?: string;
  isFlagged?: boolean;
  flagReason?: string;
}

type TabType = "members" | "events" | "details";

interface SpaceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceData: SpaceDetailsData | null;
}

export const SpaceDetailsModal: React.FC<SpaceDetailsModalProps> = ({
  isOpen,
  onClose,
  spaceData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetailsData | null>(
    null
  );

  if (!spaceData) return null;

  const filteredMembers = spaceData.members.filter((member) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const firstName = getFirstName(member.name).toLowerCase();
    return (
      firstName.includes(query) || member.name.toLowerCase().includes(query)
    );
  });

  const handleEventClick = (event: SpaceEvent) => {
    // Convert SpaceEvent to EventDetailsData
    const eventDetails: EventDetailsData = {
      id: event.id,
      eventName: event.title,
      eventImage: event.image,
      organizer: {
        name: spaceData.owner.name,
        studentId: spaceData.owner.studentId,
        avatar: spaceData.owner.avatar,
      },
      date: event.date,
      time: event.time,
      place: event.location,
      status: "upcoming",
      type: "public",
      description: `Join us for ${event.title} at ${event.location}`,
      attendees: [],
      maxAttendees: 50,
      isFlagged: false,
    };
    setSelectedEvent(eventDetails);
    setEventDetailsModalOpen(true);
  };

  return (
    <CModal
      visible={isOpen}
      onClose={onClose}
      size="xl"
      alignment="center"
      backdrop="static"
      className={`space-details-modal-wrapper ${
        eventDetailsModalOpen ? "space-details-hidden" : ""
      }`}
    >
      <CModalBody className="space-details-modal-body">
        <button
          data-testid="space-details-close-btn"
          className="space-details-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={16} color="#5b6168" />
        </button>

        <div className="space-details-content">
          {/* Header */}
          <div className="space-details-header">
            <h2 className="space-details-title">Space details</h2>
          </div>

          {/* Main Content */}
          <div className="space-details-main">
            {/* Left Column */}
            <div className="space-details-left">
              {/* Space Picture & Logo */}
              <div className="space-details-section with-logo">
                <h3 className="space-details-section-title">
                  Space picture & logo
                </h3>
                <div className="space-picture-container">
                  <div className="space-details-image">
                    {spaceData.spaceImage ? (
                      <img
                        src={spaceData.spaceImage}
                        alt={spaceData.spaceName}
                      />
                    ) : (
                      <div className="space-details-image-placeholder">
                        <AssetIcon
                          name="calendar-icon"
                          size={64}
                          color="#d2d2d3"
                        />
                      </div>
                    )}
                  </div>
                  {spaceData.spaceLogo && (
                    <div className="space-logo-overlay">
                      <img src={spaceData.spaceLogo} alt="Space logo" />
                    </div>
                  )}
                </div>
              </div>

              {/* Space Owner */}
              <div className="space-details-section">
                <h3 className="space-details-section-title">Space owner</h3>
                <div className="space-details-owner">
                  <div className="space-owner-avatar">
                    {spaceData.owner.avatar ? (
                      <img
                        src={spaceData.owner.avatar}
                        alt={spaceData.owner.name}
                      />
                    ) : (
                      <div className="space-owner-avatar-placeholder">
                        {spaceData.owner.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="space-owner-info">
                    <p className="space-owner-name">{spaceData.owner.name}</p>
                    <CopyableId
                      id={spaceData.owner.studentId}
                      label="Student ID"
                      testId="space-owner-copy"
                    />
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="space-details-section">
                <h3 className="space-details-section-title">Information</h3>
                <div className="space-details-info-box">
                  <div className="space-info-row">
                    <span className="space-info-label">Category:</span>
                    <SpaceTypeChip type={spaceData.category} />
                  </div>
                  <div className="space-info-row">
                    <span className="space-info-label">Name:</span>
                    <span className="space-info-value">
                      {spaceData.spaceName}
                    </span>
                  </div>
                  <div className="space-info-row">
                    <span className="space-info-label">Chapter:</span>
                    <span className="space-info-value">
                      {spaceData.chapter}
                    </span>
                  </div>
                  <div className="space-info-row">
                    <span className="space-info-label">Contact:</span>
                    <span className="space-info-value">
                      {spaceData.contact}
                    </span>
                  </div>
                  <div className="space-info-description">
                    <span className="space-info-label">About:</span>{" "}
                    <span className="space-info-value">{spaceData.about}</span>
                  </div>
                  <div className="space-info-description">
                    <span className="space-info-label">
                      How we use this space:
                    </span>{" "}
                    <span className="space-info-value">
                      {spaceData.howWeUse}
                    </span>
                  </div>
                  {spaceData.isFlagged && spaceData.flagReason && (
                    <div className="space-info-flag-reason">
                      <span className="space-info-label">Reason for flag:</span>{" "}
                      <span className="space-info-value-flagged">
                        {spaceData.flagReason}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="space-details-divider"></div>

            {/* Right Column - Tabs */}
            <div className="space-details-right">
              {/* Tab Navigation */}
              <div className="space-tabs-navigation">
                <button
                  data-testid="space-tab-members-btn"
                  className={`space-tab-button ${
                    activeTab === "members" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("members")}
                >
                  Members
                </button>
                <button
                  data-testid="space-tab-events-btn"
                  className={`space-tab-button ${
                    activeTab === "events" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("events")}
                >
                  Events
                </button>
                <button
                  data-testid="space-tab-details-btn"
                  className={`space-tab-button ${
                    activeTab === "details" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  More details
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-tab-content">
                {/* Members Tab */}
                {activeTab === "members" && (
                  <div className="space-tab-panel">
                    {/* Search */}
                    <div className="space-search-container">
                      <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search"
                        variant="primary"
                      />
                    </div>
                    {/* Members List */}
                    <div className="space-members-list">
                      {filteredMembers.map((member) => (
                        <div key={member.id} className="space-member-item">
                          <div className="space-member-avatar">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} />
                            ) : (
                              <div className="space-member-avatar-placeholder">
                                {getFirstName(member.name).charAt(0)}
                              </div>
                            )}
                          </div>
                          <p className="space-member-name">
                            {getFirstName(member.name)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Events Tab */}
                {activeTab === "events" && (
                  <div className="space-tab-panel space-events-tab">
                    <div className="space-events-list">
                      {Array.isArray(spaceData.events) &&
                      spaceData.events.length > 0 ? (
                        spaceData.events.map((event) => (
                          <div
                            key={event.id}
                            className="space-event-card"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="space-event-content">
                              {event.image && (
                                <div className="space-event-image">
                                  <img src={event.image} alt={event.title} />
                                </div>
                              )}
                              <div className="space-event-info">
                                <p className="space-event-date">
                                  {event.date} | {event.time}
                                </p>
                                <h4 className="space-event-title">
                                  {event.title}
                                </h4>
                                <div className="space-event-location">
                                  <AssetIcon
                                    name="location-icon"
                                    size={20}
                                    color="#1d1b20"
                                  />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              data-testid="space-event-chevron-btn"
                              className="space-event-chevron"
                              aria-label="View event details"
                            >
                              <AssetIcon
                                name="right-arrow-icon"
                                size={16}
                                color="#546FD9"
                                className="space-event-chevron-icon"
                              />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="space-no-events">No events available</p>
                      )}
                    </div>
                  </div>
                )}

                {/* More Details Tab */}
                {activeTab === "details" && (
                  <div className="space-tab-panel space-details-tab">
                    <div className="space-details-info-box">
                      <div className="space-info-row">
                        <span className="space-info-label">Members:</span>
                        <span className="space-info-value">
                          {spaceData.memberRange ||
                            `1-${spaceData.members.length}`}
                        </span>
                      </div>
                      <div className="space-info-row">
                        <span className="space-info-label">
                          Year established:
                        </span>
                        <span className="space-info-value">
                          {spaceData.yearEstablished || "N/A"}
                        </span>
                      </div>
                      <div className="space-info-row">
                        <span className="space-info-label">
                          Governing body:
                        </span>
                        <span className="space-info-value">
                          {spaceData.governingBody || "N/A"}
                        </span>
                      </div>
                      <div className="space-info-row">
                        <span className="space-info-label">Primary focus:</span>
                        <span className="space-info-value">
                          {spaceData.primaryFocus || "N/A"}
                        </span>
                      </div>
                      <div className="space-info-row">
                        <span className="space-info-label">Contact:</span>
                        <span className="space-info-value">
                          {spaceData.contact}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="space-details-footer">
            <button
              data-testid="space-details-close-footer-btn"
              className="space-details-close-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </CModalBody>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={eventDetailsModalOpen}
        onClose={() => {
          setEventDetailsModalOpen(false);
          setSelectedEvent(null);
        }}
        onCloseAll={() => {
          setEventDetailsModalOpen(false);
          setSelectedEvent(null);
          onClose();
        }}
        eventData={selectedEvent}
      />
    </CModal>
  );
};
