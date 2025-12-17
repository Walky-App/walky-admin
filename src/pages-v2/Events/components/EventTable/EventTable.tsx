import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../API";
import { usePermissions } from "../../../../hooks/usePermissions";
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
import { EventType } from "../EventTypeChip/EventTypeChip";
import { EventStatusChip } from "../EventStatusChip/EventStatusChip";
import { getFirstName } from "../../../../lib/utils/nameUtils";
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
  eventDateRaw?: string;
  attendees: number;
  status: "upcoming" | "finished";
  type: EventType;
  isFlagged?: boolean;
  flagReason?: string;
}

export type EventSortField = "eventName" | "eventDate" | "attendeesCount";

interface EventTableProps {
  events: EventData[];
  sortBy?: EventSortField;
  sortOrder?: "asc" | "desc";
  onSortChange?: (field: EventSortField, order: "asc" | "desc") => void;
}

export const EventTable: React.FC<EventTableProps> = ({
  events,
  sortBy,
  sortOrder = "asc",
  onSortChange,
}) => {
  const { canUpdate, canDelete } = usePermissions();
  const queryClient = useQueryClient();

  // Permission checks for event actions
  const canFlagEvents = canUpdate("events_manager");
  const canDeleteEvents = canDelete("events_manager");

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
      queryClient.invalidateQueries({ queryKey: ["events"] });
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
    },
  });

  const flagMutation = useMutation({
    mutationFn: (data: { id: string; reason: string }) =>
      apiClient.api.adminV2EventsFlagCreate(data.id, { reason: data.reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
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
    },
  });

  const unflagMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2EventsUnflagCreate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
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
    },
  });

  const handleSort = (field: EventSortField) => {
    if (!onSortChange) return;
    if (sortBy === field) {
      onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(field, "asc");
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
      const response = await apiClient.api.adminV2EventsDetail(event.id);
      type EventDetails = {
        id?: string;
        _id?: string;
        name?: string;
        image_url?: string;
        date_and_time?: string;
        eventDate?: string;
        eventTime?: string;
        event_time?: string;
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
      const details = response.data as EventDetails;

      const hasDateTime = Boolean(details.date_and_time);
      const dateObj = hasDateTime ? new Date(details.date_and_time!) : null;

      const displayDate = hasDateTime
        ? new Intl.DateTimeFormat(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(dateObj as Date)
        : details.eventDate || "";

      const displayTime = hasDateTime
        ? new Intl.DateTimeFormat(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(dateObj as Date)
        : details.eventTime || details.event_time || "";

      // Map API response to EventDetailsData
      const eventDetails: EventDetailsData = {
        id: details.id || details._id || "",
        eventName: details.name || "",
        eventImage: details.image_url,
        organizer: {
          name: details.organizer?.name || "Unknown",
          studentId:
            details.organizer?.id ||
            details.organizer?._id ||
            details.spaceId ||
            "N/A",
          avatar: details.organizer?.avatar || details.organizer?.avatar_url,
        },
        date: displayDate,
        time: displayTime,
        place: details.location || details.address || "Campus",
        status:
          details.date_and_time && new Date(details.date_and_time) < new Date()
            ? "finished"
            : "upcoming",
        type: (details.visibility as "public" | "private") || "public",
        description: details.description || "",
        attendees: (details.participants || []).map((p) => ({
          id: p.user_id || "",
          name: p.name || "Unknown",
          avatar: p.avatar_url,
          status: p.status as "pending" | "confirmed" | "declined" | undefined,
        })),
        maxAttendees: details.slots || 0,
        isFlagged: details.isFlagged,
        flagReason: details.flagReason,
        space: details.space
          ? {
              id: details.space.id || "",
              name: details.space.name || "",
              logo: details.space.logo,
              coverImage: details.space.coverImage,
              description: details.space.description,
            }
          : null,
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

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    // Close all other modals when details modal closes
    setDeleteModalOpen(false);
    setFlagModalOpen(false);
    setUnflagModalOpen(false);
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
              <span>Organizer</span>
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
                onClick={() => handleSort("attendeesCount")}
              >
                <span>Attendees</span>
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
              </div>
            </th>
            <th>
              <span>Status</span>
            </th>
            <th>
              <span>Type</span>
            </th>
            <th></th>
          </tr>
        </thead>

        <div className="content-space-divider" />

        <tbody>
          {events.map((event, index) => (
            <React.Fragment key={event.id}>
              <tr className={event.isFlagged ? "event-row-flagged" : ""}>
                <td>
                  {event.isFlagged && (
                    <span title={event.flagReason || "Flagged"}>
                      <AssetIcon
                        name="flag-icon"
                        size={16}
                        color="#D53425"
                        className="event-flag-icon"
                      />
                    </span>
                  )}
                  <div className="event-name-cell">
                    <span className="event-name" title={event.eventName}>
                      {event.eventName}
                    </span>
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
                      {getFirstName(event.organizer.name)}
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
                  <EventStatusChip status={event.status} />
                </td>
                <td>
                  <span className="event-type-text">
                    {event.type === "public" ? "Public" : "Private"}
                  </span>
                </td>
                <td>
                  <ActionDropdown
                    testId="event-dropdown"
                    title="Event details"
                    items={[
                      ...(canFlagEvents
                        ? [
                            event.isFlagged
                              ? {
                                  label: "Unflag",
                                  icon: "flag-icon" as const,
                                  variant: "danger" as const,
                                  onClick: (e: React.MouseEvent) => handleUnflagEvent(event, e),
                                }
                              : {
                                  label: "Flag",
                                  icon: "flag-icon" as const,
                                  onClick: (e: React.MouseEvent) => handleFlagEvent(event, e),
                                },
                          ]
                        : []),
                      ...(canDeleteEvents
                        ? [
                            {
                              isDivider: true,
                              label: "",
                              onClick: () => {},
                            },
                            {
                              label: "Delete Event",
                              variant: "danger" as const,
                              onClick: (e: React.MouseEvent) => {
                                e.stopPropagation();
                                handleDeleteClick(event);
                              },
                            },
                          ]
                        : []),
                    ]}
                    onDropdownClick={(e) => {
                      handleViewEvent(event, e);
                    }}
                  />
                </td>
              </tr>
              {index < events.length - 1 && (
                <tr className="event-divider-row">
                  <td colSpan={8}>
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
          onCloseAll={handleCloseDetailsModal}
          eventData={selectedEvent}
        />
      )}
    </div>
  );
};
