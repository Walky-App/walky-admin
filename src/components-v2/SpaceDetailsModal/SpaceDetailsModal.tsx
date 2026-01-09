import React, { useState } from "react";
import { CModal, CModalBody } from "@coreui/react";
import "./SpaceDetailsModal.css";
import {
  AssetIcon,
  CopyableId,
  SearchInput,
  EventDetailsModal,
} from "../../components-v2";
import { Chip } from "../../components-v2/Chip";
import type { EventDetailsData } from "../../components-v2/EventDetailsModal/EventDetailsModal";
import { getFirstName } from "../../lib/utils/nameUtils";
import { apiClient } from "../../API";

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
  organizerName?: string;
  organizerAvatar?: string;
  organizerStudentId?: string;
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

type TabType = "details" | "members" | "events";

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
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [searchQuery, setSearchQuery] = useState("");
  const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetailsData | null>(
    null
  );

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab("details");
    }
  }, [isOpen, spaceData]);

  if (!spaceData) return null;

  const eventsCount = Array.isArray(spaceData.events)
    ? spaceData.events.length
    : 0;
  const membersCount = Array.isArray(spaceData.members)
    ? spaceData.members.length
    : 0;

  const filteredMembers = spaceData.members.filter((member) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const firstName = getFirstName(member.name).toLowerCase();
    return (
      firstName.includes(query) || member.name.toLowerCase().includes(query)
    );
  });

  const handleEventClick = async (event: SpaceEvent) => {
    try {
      const res = await apiClient.api.adminV2EventsDetail(event.id);

      type EventDetailsApi = {
        id?: string;
        _id?: string;
        name?: string;
        image_url?: string;
        date_and_time?: string;
        location?: string;
        address?: string;
        visibility?: string;
        description?: string;
        slots?: number;
        spaceId?: string;
        organizer?: {
          name?: string;
          id?: string;
          _id?: string;
          avatar?: string;
          avatar_url?: string;
        };
        participants?: Array<{
          user_id?: string;
          _id?: string;
          name?: string;
          avatar_url?: string;
          status?: string;
        }>;
        isFlagged?: boolean;
        flagReason?: string;
        space?: {
          id?: string;
          name?: string;
          logo?: string;
          coverImage?: string;
          description?: string;
        } | null;
      };

      const apiEvent = res.data as EventDetailsApi;
      const hasDateTime = Boolean(apiEvent.date_and_time);
      const dateObj = hasDateTime ? new Date(apiEvent.date_and_time!) : null;

      const mappedEvent: EventDetailsData = {
        id: apiEvent.id || apiEvent._id || event.id,
        eventName: apiEvent.name || event.title,
        eventImage: apiEvent.image_url || event.image,
        organizer: {
          name:
            apiEvent.organizer?.name ||
            event.organizerName ||
            spaceData.owner.name,
          studentId:
            apiEvent.organizer?.id ||
            apiEvent.organizer?._id ||
            apiEvent.spaceId ||
            event.organizerStudentId ||
            spaceData.owner.studentId,
          avatar:
            apiEvent.organizer?.avatar ||
            apiEvent.organizer?.avatar_url ||
            event.organizerAvatar ||
            spaceData.owner.avatar,
        },
        date: dateObj ? dateObj.toLocaleDateString() : event.date,
        time: dateObj
          ? dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : event.time,
        place: apiEvent.location || apiEvent.address || event.location,
        status: dateObj && dateObj < new Date() ? "finished" : "upcoming",
        type: (apiEvent.visibility as "public" | "private") || "public",
        description: apiEvent.description || event.title,
        attendees: (apiEvent.participants || []).map((p) => ({
          id: p.user_id || p._id || "",
          name: p.name || "Unknown",
          avatar: p.avatar_url,
          status: p.status as "pending" | "confirmed" | "declined" | undefined,
        })),
        maxAttendees: apiEvent.slots ?? 0,
        isFlagged: apiEvent.isFlagged || false,
        flagReason: apiEvent.flagReason,
        space: apiEvent.space
          ? {
              id: apiEvent.space.id || "",
              name: apiEvent.space.name || spaceData.spaceName,
              logo: apiEvent.space.logo,
              coverImage: apiEvent.space.coverImage,
              description: apiEvent.space.description,
            }
          : null,
      };

      setSelectedEvent(mappedEvent);
      setEventDetailsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch event details for space event:", error);
      // Fallback to minimal data if API fails
      const fallback: EventDetailsData = {
        id: event.id,
        eventName: event.title,
        eventImage: event.image,
        organizer: {
          name: event.organizerName || spaceData.owner.name,
          studentId: event.organizerStudentId || spaceData.owner.studentId,
          avatar: event.organizerAvatar || spaceData.owner.avatar,
        },
        date: event.date,
        time: event.time,
        place: event.location,
        status: "upcoming",
        type: "public",
        description: `Join us for ${event.title} at ${event.location}`,
        attendees: [],
        maxAttendees: 0,
        isFlagged: false,
        space: {
          id: spaceData.id,
          name: spaceData.spaceName,
          logo: spaceData.spaceLogo,
          coverImage: spaceData.spaceImage,
          description: spaceData.description,
        },
      };
      setSelectedEvent(fallback);
      setEventDetailsModalOpen(true);
    }
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
                    <Chip type="spaceCategory" value={spaceData.category} />
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
                  data-testid="space-tab-details-btn"
                  className={`space-tab-button ${
                    activeTab === "details" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  More details
                </button>
                <button
                  data-testid="space-tab-members-btn"
                  className={`space-tab-button ${
                    activeTab === "members" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("members")}
                >
                  Members ({membersCount})
                </button>
                <button
                  data-testid="space-tab-events-btn"
                  className={`space-tab-button ${
                    activeTab === "events" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("events")}
                >
                  Events ({eventsCount})
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-tab-content">
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

                {/* Members Tab */}
                {activeTab === "members" && (
                  <div className="space-tab-panel">
                    <div className="space-search-container">
                      <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search"
                        variant="primary"
                      />
                    </div>
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
