import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../API";
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
}

type SortField = "eventName" | "organizer" | "eventDate" | "attendees";
type SortDirection = "asc" | "desc";

export const EventTable: React.FC<EventTableProps> = ({ events }) => {
  const queryClient = useQueryClient();
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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2EventsDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setToastMessage(`Event deleted successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDeleteModalOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
      setToastMessage("Error deleting event");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  });

  const flagMutation = useMutation({
    mutationFn: (data: { id: string; reason: string }) => apiClient.api.adminV2EventsFlagCreate(data.id, { reason: data.reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setToastMessage(`Event flagged successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setFlagModalOpen(false);
    },
    onError: (error) => {
      console.error("Error flagging event:", error);
      setToastMessage("Error flagging event");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  });

  const unflagMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2EventsUnflagCreate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setToastMessage(`Event unflagged successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setUnflagModalOpen(false);
    },
    onError: (error) => {
      console.error("Error unflagging event:", error);
      setToastMessage("Error unflagging event");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteClick = (event: EventData) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (_reason: string) => {
    if (eventToDelete) {
      deleteMutation.mutate(eventToDelete.id);
    }
  };

  const handleViewEvent = async (event: EventData, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await apiClient.api.adminV2EventsDetail(event.id) as any;
      const details = response.data;

      // Map API response to EventDetailsData
      const eventDetails: EventDetailsData = {
        id: details.id,
        eventName: details.name,
        eventImage: details.image_url,
        organizer: {
          name: details.owner?.name || 'Unknown',
          studentId: details.owner?.studentId || 'N/A', // Assuming backend returns this structure or similar
          avatar: details.owner?.avatar,
        },
        date: new Date(details.date_and_time).toLocaleDateString(),
        time: new Date(details.date_and_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        place: details.location,
        type: details.visibility as "public" | "private",
        description: details.description,
        attendees: (details.participants || []).map((p: any) => ({
          id: p.user_id,
          name: p.name || 'Unknown', // Backend needs to populate this
          avatar: p.avatar_url
        })),
        maxAttendees: details.slots,
        isFlagged: details.isFlagged, // Placeholder from backend
        flagReason: details.flagReason, // Placeholder from backend
      };

      setSelectedEvent(eventDetails);
      setDetailsModalOpen(true);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setToastMessage("Error fetching event details");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleFlagEvent = (event: EventData, e: React.MouseEvent) => {
    e.stopPropagation();
    setEventToFlag(event);
    setFlagModalOpen(true);
  };

  const handleFlagConfirm = (reason: string) => {
    if (eventToFlag) {
      flagMutation.mutate({ id: eventToFlag.id, reason });
    }
  };

  const handleUnflagEvent = (event: EventData, e: React.MouseEvent) => {
    e.stopPropagation();
    setEventToUnflag(event);
    setUnflagModalOpen(true);
  };

  const handleUnflagConfirm = () => {
    if (eventToUnflag) {
      unflagMutation.mutate(eventToUnflag.id);
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
                        onClick: () => { },
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
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={eventToDelete?.eventName || ""}
        type="event"
      />

      <UnflagModal
        isOpen={unflagModalOpen}
        onClose={() => setUnflagModalOpen(false)}
        onConfirm={handleUnflagConfirm}
        itemName={eventToUnflag?.eventName || ""}
        type="event"
      />

      <FlagModal
        isOpen={flagModalOpen}
        onClose={() => setFlagModalOpen(false)}
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
