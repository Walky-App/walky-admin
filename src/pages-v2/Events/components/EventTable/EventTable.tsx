import React, { useState } from "react";
import {
  DeleteModal,
  CustomToast,
  EventDetailsModal,
  EventDetailsData,
  CopyableId,
  ActionDropdown,
  AssetIcon,
  FlagModal,
  UnflagModal,
  Divider,
} from "../../../../components-v2";
import { EventTypeChip, EventType } from "../EventTypeChip/EventTypeChip";
import "./EventTable.css";
import { useMixpanel } from "../../../../hooks/useMixpanel";

export interface EventData {
  id: string;
  eventName: string;
  organizer: {
    name: string;
    avatar?: string;
  };
  studentId: string;
  eventDate: string;
  eventTime: string;
  attendees: number;
  type: EventType;
  isFlagged?: boolean;
  flagReason?: string;
}

interface EventTableProps {
  events: EventData[];
  pageContext?: string;
}

type SortField = "eventName" | "organizer" | "eventDate" | "attendees";
type SortDirection = "asc" | "desc";

export const EventTable: React.FC<EventTableProps> = ({
  events,
  pageContext = "Events",
}) => {
  const { trackEvent } = useMixpanel();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventData | null>(null);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [eventToFlag, setEventToFlag] = useState<EventData | null>(null);
  const [unflagModalOpen, setUnflagModalOpen] = useState(false);
  const [eventToUnflag, setEventToUnflag] = useState<EventData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetailsData | null>(
    null
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      trackEvent(`${pageContext} - Table Sorted`, {
        sortField: field,
        sortDirection: sortDirection === "asc" ? "desc" : "asc",
      });
    } else {
      setSortField(field);
      setSortDirection("asc");
      trackEvent(`${pageContext} - Table Sorted`, {
        sortField: field,
        sortDirection: "asc",
      });
    }
  };

  const handleDeleteClick = (event: EventData) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
    trackEvent(`${pageContext} - Delete Event Action`, {
      eventId: event.id,
      eventName: event.eventName,
    });
  };

  const handleDeleteConfirm = (reason: string) => {
    if (eventToDelete) {
      console.log(
        "Deleting event:",
        eventToDelete.eventName,
        "Reason:",
        reason
      );
      trackEvent(`${pageContext} - Delete Event Confirmed`, {
        eventId: eventToDelete.id,
        eventName: eventToDelete.eventName,
        reason,
      });
      // TODO: Call API to delete event
      setToastMessage(
        `Event "${eventToDelete.eventName}" deleted successfully`
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleViewEvent = (event: EventData, e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent(`${pageContext} - View Event Action`, {
      eventId: event.id,
      eventName: event.eventName,
    });
    // Convert EventData to EventDetailsData
    const eventDetails: EventDetailsData = {
      id: event.id,
      eventName: event.eventName,
      organizer: {
        name: event.organizer.name,
        avatar: event.organizer.avatar,
        studentId: event.studentId,
      },
      date: event.eventDate,
      time: event.eventTime,
      place: "S. Campus Basketball Courts", // Mock data
      type: event.type,
      description:
        "A fun 4v4 basketball game for students. Bring your A-game and let's have some competitive fun on the courts!", // Mock data
      attendees: [
        { id: "1", name: event.organizer.name, avatar: event.organizer.avatar },
        { id: "2", name: "Ben Thompson", avatar: undefined },
        { id: "3", name: "Leo Martinez", avatar: undefined },
        { id: "4", name: "Mariana Silva", avatar: undefined },
        { id: "5", name: "Anni Schmidt", avatar: undefined },
        { id: "6", name: "Justin Park", avatar: undefined },
      ],
      maxAttendees: 8,
      eventImage: undefined, // Mock data - no image
      isFlagged: event.isFlagged,
      flagReason: event.flagReason,
    };
    setSelectedEvent(eventDetails);
    setDetailsModalOpen(true);
  };

  const handleFlagEvent = (event: EventData, e: React.MouseEvent) => {
    e.stopPropagation();
    setEventToFlag(event);
    setFlagModalOpen(true);
    trackEvent(`${pageContext} - Flag Event Action`, {
      eventId: event.id,
      eventName: event.eventName,
    });
  };

  const handleFlagConfirm = (reason: string) => {
    if (eventToFlag) {
      console.log("Flagging event:", eventToFlag.eventName, "Reason:", reason);
      trackEvent(`${pageContext} - Flag Event Confirmed`, {
        eventId: eventToFlag.id,
        eventName: eventToFlag.eventName,
        reason,
      });
      // TODO: Call API to flag event
      setToastMessage(`Event "${eventToFlag.eventName}" flagged successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleUnflagEvent = (event: EventData, e: React.MouseEvent) => {
    e.stopPropagation();
    setEventToUnflag(event);
    setUnflagModalOpen(true);
    trackEvent(`${pageContext} - Unflag Event Action`, {
      eventId: event.id,
      eventName: event.eventName,
    });
  };

  const handleUnflagConfirm = () => {
    if (eventToUnflag) {
      console.log("Unflagging event:", eventToUnflag.eventName);
      trackEvent(`${pageContext} - Unflag Event Confirmed`, {
        eventId: eventToUnflag.id,
        eventName: eventToUnflag.eventName,
      });
      // TODO: Call API to unflag event
      setToastMessage(
        `Event "${eventToUnflag.eventName}" unflagged successfully`
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (!sortField) return 0;

    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "eventName":
        aValue = a.eventName.toLowerCase();
        bValue = b.eventName.toLowerCase();
        break;
      case "organizer":
        aValue = a.organizer.name.toLowerCase();
        bValue = b.organizer.name.toLowerCase();
        break;
      case "eventDate":
        aValue = new Date(a.eventDate).getTime();
        bValue = new Date(b.eventDate).getTime();
        break;
      case "attendees":
        aValue = a.attendees;
        bValue = b.attendees;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="event-table-wrapper">
      <table className="event-table">
        <thead>
          <tr>
            <th>
              <div
                className="event-table-header"
                onClick={() => handleSort("eventName")}
              >
                <span>Event name</span>
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
              </div>
            </th>
            <th>
              <div
                className="event-table-header"
                onClick={() => handleSort("organizer")}
              >
                <span>Organizer</span>
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
              </div>
            </th>
            <th>
              <span>Student ID</span>
            </th>
            <th>
              <div
                className="event-table-header"
                onClick={() => handleSort("eventDate")}
              >
                <span>Event date</span>
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
              </div>
            </th>
            <th>
              <div
                className="event-table-header"
                onClick={() => handleSort("attendees")}
              >
                <span>Attendees</span>
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
              </div>
            </th>
            <th>
              <span>Type</span>
            </th>
            <th></th>
          </tr>
        </thead>
        <div className="content-space-divider" />

        <tbody>
          {sortedEvents.map((event, index) => (
            <React.Fragment key={event.id}>
              <tr className={event.isFlagged ? "event-row-flagged" : ""}>
                <td>
                  {event.isFlagged && (
                    <AssetIcon
                      name="flag-icon"
                      size={16}
                      color="#D53425"
                      className="event-flag-icon"
                    />
                  )}
                  <div className="event-name-cell">
                    <span className="event-name">{event.eventName}</span>
                  </div>
                </td>
                <td>
                  <div className="organizer-cell">
                    <div className="organizer-avatar">
                      {event.organizer.avatar ? (
                        <img
                          src={event.organizer.avatar}
                          alt={event.organizer.name}
                        />
                      ) : (
                        <div className="organizer-avatar-placeholder">
                          {event.organizer.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="organizer-name">
                      {event.organizer.name}
                    </span>
                  </div>
                </td>
                <td>
                  <CopyableId
                    id={event.studentId}
                    label="Student ID"
                    testId="copy-student-id"
                  />
                </td>
                <td>
                  <div className="event-date-cell">
                    <span className="event-date">{event.eventDate}</span>
                    <span className="event-time">{event.eventTime}</span>
                  </div>
                </td>
                <td>
                  <div className="attendees-badge">
                    <span>{event.attendees}</span>
                  </div>
                </td>
                <td>
                  <EventTypeChip type={event.type} />
                </td>
                <td>
                  <ActionDropdown
                    testId="event-dropdown"
                    items={[
                      {
                        label: "View event",
                        onClick: (e) => handleViewEvent(event, e),
                      },
                      {
                        isDivider: true,
                        label: "",
                        onClick: () => {},
                      },
                      event.isFlagged
                        ? {
                            label: "Unflag",
                            icon: "flag-icon",
                            variant: "danger",
                            onClick: (e) => handleUnflagEvent(event, e),
                          }
                        : {
                            label: "Flag event",
                            icon: "flag-icon",
                            onClick: (e) => handleFlagEvent(event, e),
                          },
                      {
                        label: "Delete event",
                        variant: "danger",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleDeleteClick(event);
                        },
                      },
                    ]}
                  />
                </td>
              </tr>
              {index < sortedEvents.length - 1 && !event.isFlagged && (
                <tr className="event-divider-row">
                  <td colSpan={7}>
                    <Divider />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          trackEvent(`${pageContext} - Delete Event Modal Closed`);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={eventToDelete?.eventName || ""}
        type="event"
      />

      <UnflagModal
        isOpen={unflagModalOpen}
        onClose={() => {
          setUnflagModalOpen(false);
          trackEvent(`${pageContext} - Unflag Event Modal Closed`);
        }}
        onConfirm={handleUnflagConfirm}
        itemName={eventToUnflag?.eventName || ""}
        type="event"
      />

      <FlagModal
        isOpen={flagModalOpen}
        onClose={() => {
          setFlagModalOpen(false);
          trackEvent(`${pageContext} - Flag Event Modal Closed`);
        }}
        onConfirm={handleFlagConfirm}
        itemName={eventToFlag?.eventName || ""}
        type="event"
      />

      {showToast && (
        <CustomToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}

      {selectedEvent && (
        <EventDetailsModal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          eventData={selectedEvent}
        />
      )}
    </div>
  );
};
