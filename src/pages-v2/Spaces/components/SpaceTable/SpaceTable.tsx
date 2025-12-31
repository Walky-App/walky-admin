import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../API";
import { usePermissions } from "../../../../hooks/usePermissions";
import { useTheme } from "../../../../hooks/useTheme";
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
  ChangeCategoryModal,
  CategoryOption,
} from "../../../../components-v2";
import { Chip } from "../../../../components-v2/Chip";
import "./SpaceTable.css";

export interface SpaceData {
  id: string;
  spaceName: string;
  owner: {
    name: string;
    avatar?: string;
    organizerName?: string;
    organizerAvatar?: string;
  };
  studentId: string;
  events: number;
  members: number;
  creationDate: string;
  creationTime: string;
  category: string;
  isFlagged?: boolean;
  flagReason?: string;
}

export type SpaceSortField =
  | "spaceName"
  | "members"
  | "events"
  | "creationDate";

interface SpaceTableProps {
  spaces: SpaceData[];
  sortBy?: SpaceSortField;
  sortOrder?: "asc" | "desc";
  onSortChange?: (field: SpaceSortField, order: "asc" | "desc") => void;
}

export const SpaceTable: React.FC<SpaceTableProps> = ({
  spaces,
  sortBy,
  sortOrder = "asc",
  onSortChange,
}) => {
  const { canUpdate, canDelete } = usePermissions();
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  // Permission checks for space actions
  const canFlagSpaces = canUpdate("spaces_manager");
  const canDeleteSpaces = canDelete("spaces_manager");
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
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [spaceToEditCategory, setSpaceToEditCategory] =
    useState<SpaceData | null>(null);

  // Fetch categories for the modal
  const { data: categoriesData } = useQuery({
    queryKey: ["spaceCategories"],
    queryFn: () => apiClient.api.adminSpaceCategoriesList(),
  });

  const categories: CategoryOption[] = React.useMemo(() => {
    const responseData = categoriesData?.data as
      | CategoryOption[]
      | { data?: CategoryOption[] }
      | undefined;
    const cats: CategoryOption[] = Array.isArray(responseData)
      ? responseData
      : Array.isArray(responseData?.data)
      ? responseData.data
      : [];
    return [...cats].sort((a, b) => a.name.localeCompare(b.name));
  }, [categoriesData]);

  const slugifyCategory = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");

  const getCategoryLabel = (value: string) => {
    if (!value) return "Uncategorized";
    const match = categories.find(
      (cat) => slugifyCategory(cat.name) === slugifyCategory(value)
    );
    return match?.name || value;
  };

  const deleteMutation = useMutation({
    mutationFn: (data: { id: string; reason?: string }) =>
      apiClient.api.adminV2SpacesDelete(data.id, { reason: data.reason }),
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

  const updateCategoryMutation = useMutation({
    mutationFn: (data: { id: string; categoryId: string }) =>
      apiClient.api.adminV2SpacesPartialUpdate(data.id, {
        category: data.categoryId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      setToastMessage("Category updated successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setCategoryModalOpen(false);
      setSpaceToEditCategory(null);
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      setToastMessage("Error updating category");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const handleSort = (field: SpaceSortField) => {
    if (!onSortChange) return;
    if (sortBy === field) {
      onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(field, "asc");
    }
  };

  const handleDeleteClick = (space: SpaceData) => {
    setSpaceToDelete(space);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (reason: string) => {
    if (spaceToDelete) {
      deleteMutation.mutate({ id: spaceToDelete.id, reason });
    }
  };

  const handleViewSpaceDetails = async (
    space: SpaceData,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      const response = await apiClient.api.adminV2SpacesDetail(space.id);
      type SpaceDetails = {
        id?: string;
        name?: string;
        owner?: { name?: string; avatar?: string; studentId?: string };
        createdAt?: string;
        category?: { name?: string };
        chapter?: string;
        contact?: string;
        about?: string;
        description?: string;
        howWeUse?: string;
        events?: Array<{
          id?: string;
          name?: string;
          date?: string;
          location?: string;
          image_url?: string;
          organizerName?: string;
          organizerAvatar?: string;
          organizerStudentId?: string;
          organizerId?: string;
          organizer?: {
            name?: string;
            avatar?: string;
            avatar_url?: string;
            studentId?: string;
            id?: string;
            _id?: string;
          };
        }>;
        members?: Array<{
          user_id?: string;
          name?: string;
          avatar_url?: string;
        }>;
        cover_image_url?: string;
        logo_url?: string;
        memberRange?: string;
        yearEstablished?: number;
        governingBody?: string;
        primaryFocus?: string;
        isFlagged?: boolean;
        flagReason?: string;
      };
      const details = response.data as SpaceDetails;
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
          ? new Date(details.createdAt).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
        creationTime: details.createdAt
          ? new Date(details.createdAt).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          : "N/A",
        category: details.category?.name || "Other",
        chapter: details.chapter || "N/A",
        contact: details.contact || "N/A",
        about:
          details.about || details.description || "No description provided.",
        howWeUse: details.howWeUse || "N/A",
        description: details.description || "",
        events: (details.events || []).map((ev) => ({
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
          organizerName: ev.organizerName || ev.organizer?.name,
          organizerAvatar:
            ev.organizerAvatar ||
            ev.organizer?.avatar ||
            ev.organizer?.avatar_url,
          organizerStudentId:
            ev.organizerStudentId ||
            ev.organizer?.studentId ||
            ev.organizerId ||
            ev.organizer?._id,
        })),
        members: (details.members || []).map((m) => ({
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

  const handleEditCategory = (space: SpaceData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpaceToEditCategory(space);
    setCategoryModalOpen(true);
  };

  const handleCategoryConfirm = (categoryId: string) => {
    if (spaceToEditCategory) {
      updateCategoryMutation.mutate({
        id: spaceToEditCategory.id,
        categoryId,
      });
    }
  };

  // Mark the first item as flagged for visual testing only.
  const decoratedSpaces = spaces;

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
                <AssetIcon
                  name="swap-arrows-icon"
                  size={24}
                  color={theme.colors.bodyColor}
                />
              </div>
            </th>
            <th>
              <span>Owner</span>
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
                <AssetIcon
                  name="swap-arrows-icon"
                  size={24}
                  color={theme.colors.bodyColor}
                />
              </div>
            </th>
            <th>
              <div
                className="space-table-header"
                onClick={() => handleSort("members")}
              >
                <span>Members</span>
                <AssetIcon
                  name="swap-arrows-icon"
                  size={24}
                  color={theme.colors.bodyColor}
                />
              </div>
            </th>
            <th>
              <div
                className="space-table-header"
                onClick={() => handleSort("creationDate")}
              >
                <span>Creation date</span>
                <AssetIcon
                  name="swap-arrows-icon"
                  size={24}
                  color={theme.colors.bodyColor}
                />
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
          {decoratedSpaces.map((space, index) => (
            <React.Fragment key={space.id}>
              <tr className={space.isFlagged ? "space-row-flagged" : ""}>
                <td>
                  {space.isFlagged && (
                    <span title={space.flagReason || "Flagged"}>
                      <AssetIcon
                        name="flag-icon"
                        size={16}
                        color="#D53425"
                        className="space-flag-icon"
                      />
                    </span>
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
                  <Chip
                    type="spaceCategory"
                    value={getCategoryLabel(space.category)}
                  />
                </td>
                <td>
                  <ActionDropdown
                    testId="space-dropdown"
                    items={[
                      {
                        label: "Space Details",
                        onClick: (e) => handleViewSpaceDetails(space, e),
                      },
                      ...(canFlagSpaces
                        ? [
                            {
                              label: "Edit Category",
                              onClick: (e: React.MouseEvent) =>
                                handleEditCategory(space, e),
                            },
                          ]
                        : []),
                      ...(canFlagSpaces || canDeleteSpaces
                        ? [
                            {
                              isDivider: true,
                              label: "",
                              onClick: () => {},
                            },
                          ]
                        : []),
                      ...(canFlagSpaces
                        ? [
                            space.isFlagged
                              ? {
                                  label: "Unflag",
                                  icon: "flag-icon" as const,
                                  variant: "danger" as const,
                                  onClick: (e: React.MouseEvent) =>
                                    handleUnflagSpace(space, e),
                                }
                              : {
                                  label: "Flag",
                                  icon: "flag-icon" as const,
                                  onClick: (e: React.MouseEvent) =>
                                    handleFlagSpace(space, e),
                                },
                          ]
                        : []),
                      ...(canDeleteSpaces
                        ? [
                            {
                              label: "Delete Space",
                              variant: "danger" as const,
                              onClick: (e: React.MouseEvent) => {
                                e.stopPropagation();
                                handleDeleteClick(space);
                              },
                            },
                          ]
                        : []),
                    ]}
                  />
                </td>
              </tr>
              {index < spaces.length - 1 && (
                <tr className="space-divider-row">
                  <td colSpan={8}>
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

      <ChangeCategoryModal
        isOpen={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setSpaceToEditCategory(null);
        }}
        onConfirm={handleCategoryConfirm}
        categories={categories}
        spaceName={spaceToEditCategory?.spaceName || ""}
        isLoading={updateCategoryMutation.isPending}
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
