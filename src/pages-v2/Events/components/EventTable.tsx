import React, { useState, useRef, useEffect } from "react";
import {
  AssetIcon,
  DeleteModal,
  CustomToast,
  EventDetailsModal,
  EventDetailsData,
} from "../../../components-v2";
import { EventTypeChip, EventType } from "./EventTypeChip";
import "./EventTable.css";

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
}

interface EventTableProps {
  events: EventData[];
}

type SortField = "eventName" | "organizer" | "eventDate" | "attendees";
type SortDirection = "asc" | "desc";

export const EventTable: React.FC<EventTableProps> = ({ events }) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetailsData | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleCopyStudentId = (studentId: string) => {
    navigator.clipboard.writeText(studentId);
  };

  const handleDeleteClick = (event: EventData) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteConfirm = (reason: string) => {
    if (eventToDelete) {
      console.log(
        "Deleting event:",
        eventToDelete.eventName,
        "Reason:",
        reason
      );
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
    };
    setSelectedEvent(eventDetails);
    setDetailsModalOpen(true);
    setOpenDropdownId(null);
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
        <tbody>
          {sortedEvents.map((event) => (
            <tr key={event.id}>
              <td>
                <span className="event-name">{event.eventName}</span>
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
                  <span className="organizer-name">{event.organizer.name}</span>
                </div>
              </td>
              <td>
                <div className="student-id-cell">
                  <div className="student-id-badge">
                    <span>{event.studentId}</span>
                  </div>
                  <button
                    data-testid="copy-student-id-btn"
                    className="copy-btn"
                    onClick={() => handleCopyStudentId(event.studentId)}
                    title="Copy student ID"
                  >
                    <AssetIcon name="copy-icon" size={16} color="#ACB6BA" />
                  </button>
                </div>
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
                <div className="event-dropdown-container" ref={dropdownRef}>
                  <button
                    data-testid="event-dropdown-toggle-btn"
                    className="event-dropdown-toggle"
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === event.id ? null : event.id
                      )
                    }
                  >
                    <AssetIcon
                      name="vertical-3-dots-icon"
                      size={24}
                      color="#1D1B20"
                    />
                  </button>
                  {openDropdownId === event.id && (
                    <div className="event-dropdown-menu">
                      <div
                        className="event-dropdown-item"
                        onClick={(e) => handleViewEvent(event, e)}
                      >
                        View event
                      </div>
                      <div
                        className="event-dropdown-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Edit event", event);
                        }}
                      >
                        Edit event
                      </div>
                      <div
                        className="event-dropdown-item event-dropdown-item-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(event);
                        }}
                      >
                        Delete event
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={eventToDelete?.eventName || ""}
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
