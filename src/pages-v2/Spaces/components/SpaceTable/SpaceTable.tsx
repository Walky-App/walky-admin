import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../API";
import { getFirstName } from "../../../../lib/utils/nameUtils";
import {
  DeleteModal,
  CustomToast,
  CopyableId,
  ActionDropdown,
  AssetIcon,
  FlagModal,
  SpaceDetailsModal,
  SpaceDetailsData,
  UnflagModal,
  Divider,
} from "../../../../components-v2";
import { SpaceTypeChip, SpaceType } from "../SpaceTypeChip/SpaceTypeChip";
import "./SpaceTable.css";

export interface SpaceData {
  id: string;
  spaceName: string;
  owner: {
    name: string;
    avatar?: string;
  };
  studentId: string;
  events: number;
  members: number;
  creationDate: string;
  creationTime: string;
  category: SpaceType;
  isFlagged?: boolean;
  flagReason?: string;
}

interface SpaceTableProps {
  spaces: SpaceData[];
}

type SortField = "spaceName" | "owner" | "events" | "members" | "creationDate";
type SortDirection = "asc" | "desc";

export const SpaceTable: React.FC<SpaceTableProps> = ({ spaces }) => {
  const queryClient = useQueryClient();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<SpaceData | null>(null);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [spaceToFlag, setSpaceToFlag] = useState<SpaceData | null>(null);
  const [unflagModalOpen, setUnflagModalOpen] = useState(false);
  const [spaceToUnflag, setSpaceToUnflag] = useState<SpaceData | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<SpaceDetailsData | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2SpacesDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      setToastMessage(`Space deleted successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDeleteModalOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting space:", error);
      setToastMessage("Error deleting space");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const flagMutation = useMutation({
    mutationFn: (data: { id: string; reason: string }) =>
      apiClient.api.adminV2SpacesFlagCreate(data.id, { reason: data.reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      setToastMessage(`Space flagged successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setFlagModalOpen(false);
    },
    onError: (error) => {
      console.error("Error flagging space:", error);
      setToastMessage("Error flagging space");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const unflagMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2SpacesUnflagCreate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      setToastMessage(`Space unflagged successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setUnflagModalOpen(false);
    },
    onError: (error) => {
      console.error("Error unflagging space:", error);
      setToastMessage("Error unflagging space");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteClick = (space: SpaceData) => {
    setSpaceToDelete(space);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (_reason: string) => {
    if (spaceToDelete) {
      deleteMutation.mutate(spaceToDelete.id);
    }
  };

  const handleViewSpaceDetails = async (
    space: SpaceData,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      const response = await apiClient.api.adminV2SpacesDetail(space.id);
      const details = response.data as any;
      console.log("API Space Details Response:", details);

      // Map API response to SpaceDetailsData
      const spaceDetails: SpaceDetailsData = {
        id: details.id || "",
        spaceName: details.name || "Unknown Space",
        owner: {
          name: details.owner?.name || "Unknown",
          avatar: details.owner?.avatar,
          studentId: details.owner?.studentId || "N/A",
        },
        creationDate: details.createdAt
          ? new Date(details.createdAt).toLocaleDateString()
          : "N/A",
        creationTime: details.createdAt
          ? new Date(details.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
        category: details.category?.name || "Other",
        chapter: details.chapter || "N/A",
        contact: details.contact || "N/A",
        about:
          details.about || details.description || "No description provided.",
        howWeUse: details.howWeUse || "N/A",
        description: details.description || "",
        events: (details.events || []).map((ev: any) => ({
          id: ev.id || "",
          title: ev.name || "Untitled Event",
          date: ev.date ? new Date(ev.date).toLocaleDateString() : "TBD",
          time: ev.date
            ? new Date(ev.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "TBD",
          location: ev.location || "TBD",
          image: ev.image_url,
        })),
        members: (details.members || []).map((m: any) => ({
          id: m.user_id || "",
          name: m.name || "Unknown",
          avatar: m.avatar_url,
        })),
        spaceImage: details.cover_image_url,
        spaceLogo: details.logo_url,
        memberRange: details.memberRange || "1-10",
        yearEstablished: details.yearEstablished
          ? details.yearEstablished.toString()
          : details.createdAt
          ? new Date(details.createdAt).getFullYear().toString()
          : "N/A",
        governingBody: details.governingBody || "N/A",
        primaryFocus: details.primaryFocus || "N/A",
        isFlagged: details.isFlagged,
        flagReason: details.flagReason,
      };

      setSelectedSpace(spaceDetails);
      setDetailsModalOpen(true);
    } catch (error) {
      console.error("Error fetching space details:", error);
      setToastMessage("Error fetching space details");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleFlagSpace = (space: SpaceData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpaceToFlag(space);
    setFlagModalOpen(true);
  };

  const handleFlagConfirm = (reason: string) => {
    if (spaceToFlag) {
      flagMutation.mutate({ id: spaceToFlag.id, reason });
    }
  };

  const handleUnflagSpace = (space: SpaceData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpaceToUnflag(space);
    setUnflagModalOpen(true);
  };

  const handleUnflagConfirm = () => {
    if (spaceToUnflag) {
      unflagMutation.mutate(spaceToUnflag.id);
    }
  };

  const sortedSpaces = [...spaces].sort((a, b) => {
    if (!sortField) return 0;

    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "spaceName":
        aValue = a.spaceName.toLowerCase();
        bValue = b.spaceName.toLowerCase();
        break;
      case "owner":
        aValue = a.owner.name.toLowerCase();
        bValue = b.owner.name.toLowerCase();
        break;
      case "events":
        aValue = a.events;
        bValue = b.events;
        break;
      case "members":
        aValue = a.members;
        bValue = b.members;
        break;
      case "creationDate":
        aValue = new Date(a.creationDate).getTime();
        bValue = new Date(b.creationDate).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-table-wrapper">
      <table className="space-table">
        <thead>
          <tr>
            <th>
              <div
                className="space-table-header"
                onClick={() => handleSort("spaceName")}
              >
                <span>Space name</span>
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
              </div>
            </th>
            <th>
              <div
                className="space-table-header"
                onClick={() => handleSort("owner")}
              >
                <span>Owner</span>
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
              </div>
            </th>
            <th>
              <span>Student ID</span>
            </th>
            <th>
              <div
                className="space-table-header"
                onClick={() => handleSort("events")}
              >
                <span>Events</span>
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
              </div>
            </th>
            <th>
              <div
                className="space-table-header"
                onClick={() => handleSort("members")}
              >
                <span>Members</span>
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
              </div>
            </th>
            <th>
              <div
                className="space-table-header"
                onClick={() => handleSort("creationDate")}
              >
                <span>Creation date</span>
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
              </div>
            </th>
            <th>
              <span>Category</span>
            </th>
            <th></th>
          </tr>
        </thead>
        <div className="content-space-divider" />

        <tbody>
          {sortedSpaces.map((space, index) => (
            <React.Fragment key={space.id}>
              <tr className={space.isFlagged ? "space-row-flagged" : ""}>
                <td>
                  {space.isFlagged && (
                    <AssetIcon
                      name="flag-icon"
                      size={16}
                      color="#D53425"
                      className="space-flag-icon"
                    />
                  )}
                  <div className="space-name-cell">
                    <span className="space-name">{space.spaceName}</span>
                  </div>
                </td>
                <td>
                  <div className="owner-cell">
                    <div className="owner-avatar">
                      {space.owner.avatar ? (
                        <img src={space.owner.avatar} alt={space.owner.name} />
                      ) : (
                        <div className="owner-avatar-placeholder">
                          {space.owner.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="owner-name">
                      {getFirstName(space.owner.name)}
                    </span>
                  </div>
                </td>
                <td>
                  <CopyableId
                    id={space.studentId}
                    label="Student ID"
                    testId="copy-student-id"
                  />
                </td>
                <td>
                  <div className="count-badge events-badge">
                    <span>{space.events}</span>
                  </div>
                </td>
                <td>
                  <div className="count-badge members-badge">
                    <span>{space.members}</span>
                  </div>
                </td>
                <td>
                  <div className="creation-date-cell">
                    <span className="creation-date">{space.creationDate}</span>
                    <span className="creation-time">{space.creationTime}</span>
                  </div>
                </td>
                <td>
                  <SpaceTypeChip type={space.category} />
                </td>
                <td>
                  <ActionDropdown
                    testId="space-dropdown"
                    items={[
                      {
                        label: "Space Details",
                        onClick: (e) => handleViewSpaceDetails(space, e),
                      },
                      {
                        isDivider: true,
                        label: "",
                        onClick: () => {},
                      },
                      space.isFlagged
                        ? {
                            label: "Unflag",
                            icon: "flag-icon",
                            variant: "danger",
                            onClick: (e) => handleUnflagSpace(space, e),
                          }
                        : {
                            label: "Flag",
                            icon: "flag-icon",
                            onClick: (e) => handleFlagSpace(space, e),
                          },
                      {
                        label: "Delete Space",
                        variant: "danger",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleDeleteClick(space);
                        },
                      },
                    ]}
                  />
                </td>
              </tr>
              {index < sortedSpaces.length - 1 && !space.isFlagged && (
                <tr className="space-divider-row">
                  <td colSpan={7}>
                    <Divider />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <UnflagModal
        isOpen={unflagModalOpen}
        onClose={() => setUnflagModalOpen(false)}
        onConfirm={handleUnflagConfirm}
        itemName={spaceToUnflag?.spaceName || ""}
        type="space"
      />

      <FlagModal
        isOpen={flagModalOpen}
        onClose={() => setFlagModalOpen(false)}
        onConfirm={handleFlagConfirm}
        itemName={spaceToFlag?.spaceName || ""}
        type="space"
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={spaceToDelete?.spaceName || ""}
        type="space"
      />

      <SpaceDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedSpace(null);
        }}
        spaceData={selectedSpace}
      />

      {showToast && (
        <CustomToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
