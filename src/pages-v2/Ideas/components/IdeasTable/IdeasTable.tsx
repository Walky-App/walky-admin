import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../API";
import { getFirstName } from "../../../../lib/utils/nameUtils";
import "./IdeasTable.css";
import {
  AssetIcon,
  IdeaDetailsModal,
  DeleteModal,
  CustomToast,
  ActionDropdown,
  CopyableId,
  FlagModal,
  UnflagModal,
  Divider,
} from "../../../../components-v2";

export interface IdeaData {
  id: string;
  ideaTitle: string;
  owner: {
    name: string;
    avatar?: string;
  };
  studentId: string;
  collaborated: number;
  creationDate: string;
  creationTime: string;
  createdAt?: string;
  description?: string;
  lookingFor?: string;
  collaborators?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  isFlagged?: boolean;
  flagReason?: string;
}

export type IdeaSortField = "ideaTitle" | "collaborated" | "creationDate";

interface IdeasTableProps {
  ideas: IdeaData[];
  sortBy?: IdeaSortField;
  sortOrder?: "asc" | "desc";
  onSortChange?: (field: IdeaSortField, order: "asc" | "desc") => void;
}

export const IdeasTable: React.FC<IdeasTableProps> = ({
  ideas,
  sortBy,
  sortOrder = "asc",
  onSortChange,
}) => {
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState<IdeaData | null>(null);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [ideaToFlag, setIdeaToFlag] = useState<IdeaData | null>(null);
  const [unflagModalOpen, setUnflagModalOpen] = useState(false);
  const [ideaToUnflag, setIdeaToUnflag] = useState<IdeaData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<IdeaData | null>(null);


  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2IdeasDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      setToastMessage(`Idea deleted successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDeleteModalOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting idea:", error);
      setToastMessage("Error deleting idea");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const flagMutation = useMutation({
    mutationFn: (data: { id: string; reason: string }) =>
      apiClient.api.adminV2IdeasFlagCreate(data.id, { reason: data.reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      setToastMessage(`Idea flagged successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setFlagModalOpen(false);
    },
    onError: (error) => {
      console.error("Error flagging idea:", error);
      setToastMessage("Error flagging idea");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const unflagMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2IdeasUnflagCreate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      setToastMessage(`Idea unflagged successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setUnflagModalOpen(false);
    },
    onError: (error) => {
      console.error("Error unflagging idea:", error);
      setToastMessage("Error unflagging idea");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const handleSort = (field: IdeaSortField) => {
    if (!onSortChange) return;
    if (sortBy === field) {
      onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(field, "asc");
    }
  };

  const handleViewIdeaDetails = async (idea: IdeaData, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await apiClient.api.adminV2IdeasDetail(idea.id);
      type IdeaDetails = {
        id?: string;
        title?: string;
        createdAt?: string;
        creator?: { name?: string; avatar?: string; studentId?: string };
        description?: string;
        lookingFor?: string;
        collaborators?: Array<{ user_id?: string; name?: string; avatar_url?: string }>;
        isFlagged?: boolean;
        flagReason?: string;
      };
      const details = response.data as IdeaDetails;

      const hasCreatedAt = Boolean(details.createdAt);
      const created = hasCreatedAt ? new Date(details.createdAt!) : new Date();
      const creationDate = created.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
      const creationTime = created.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      });
      const ownerName = getFirstName(details.creator?.name || "Unknown");

      // Map API response to IdeaData structure for the modal
      const ideaDetails: IdeaData = {
        id: details.id || "",
        ideaTitle: details.title || "",
        owner: {
          name: ownerName,
          avatar: details.creator?.avatar,
        },
        studentId: details.creator?.studentId || "N/A",
        collaborated: details.collaborators?.length || 0,
        creationDate,
        creationTime,
        description: details.description,
        lookingFor: details.lookingFor || "N/A", // Assuming backend might return this
        collaborators: (details.collaborators || []).map((c) => ({
          id: c.user_id || "",
          name: c.name || "Unknown",
          avatar: c.avatar_url,
        })),
        isFlagged: details.isFlagged,
        flagReason: details.flagReason,
      };

      setSelectedIdea(ideaDetails);
      setDetailsModalOpen(true);
    } catch (error) {
      console.error("Error fetching idea details:", error);
      setToastMessage("Error fetching idea details");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleFlagIdea = (idea: IdeaData, e: React.MouseEvent) => {
    e.stopPropagation();
    setIdeaToFlag(idea);
    setFlagModalOpen(true);
  };

  const handleFlagConfirm = (reason: string) => {
    if (ideaToFlag) {
      flagMutation.mutate({ id: ideaToFlag.id, reason });
    }
  };

  const handleUnflagIdea = (idea: IdeaData, e: React.MouseEvent) => {
    e.stopPropagation();
    setIdeaToUnflag(idea);
    setUnflagModalOpen(true);
  };

  const handleUnflagConfirm = () => {
    if (ideaToUnflag) {
      unflagMutation.mutate(ideaToUnflag.id);
    }
  };

  const handleDeleteClick = (idea: IdeaData, e: React.MouseEvent) => {
    e.stopPropagation();
    setIdeaToDelete(idea);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (_reason: string) => {
    if (ideaToDelete) {
      deleteMutation.mutate(ideaToDelete.id);
    }
  };

  return (
    <>
      <div className="ideas-table-wrapper">
        <table className="ideas-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("ideaTitle")}>
                <div className="ideas-table-header-cell">
                  <span>Idea title</span>
                  <AssetIcon
                    name="swap-arrows-icon"
                    size={24}
                    color="#1D1B20"
                  />
                </div>
              </th>
              <th>
                <div className="ideas-table-header-cell">
                  <span>Owner</span>
                </div>
              </th>
              <th>
                <div className="ideas-table-header-cell">
                  <span>Student ID</span>
                </div>
              </th>
              <th onClick={() => handleSort("collaborated")}>
                <div className="ideas-table-header-cell">
                  <span>Collaborated</span>
                  <AssetIcon
                    name="swap-arrows-icon"
                    size={24}
                    color="#1D1B20"
                  />
                </div>
              </th>
              <th onClick={() => handleSort("creationDate")}>
                <div className="ideas-table-header-cell">
                  <span>Creation date</span>
                  <AssetIcon
                    name="swap-arrows-icon"
                    size={24}
                    color="#1D1B20"
                  />
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <div className="content-space-divider" />

          <tbody>
            {ideas.map((idea, index) => (
              <React.Fragment key={idea.id}>
                <tr className={idea.isFlagged ? "idea-row-flagged" : ""}>
                  <td>
                    {idea.isFlagged && (
                      <span title={idea.flagReason || "Flagged"}>
                        <AssetIcon
                          name="flag-icon"
                          size={16}
                          color="#D53425"
                          className="idea-flag-icon"
                        />
                      </span>
                    )}
                    <div className="idea-title-cell">
                      <span className="ideas-table-idea-title">
                        {idea.ideaTitle}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="ideas-table-owner">
                      <div className="ideas-table-owner-avatar">
                        {idea.owner.avatar ? (
                          <img src={idea.owner.avatar} alt={idea.owner.name} />
                        ) : (
                          <div className="ideas-table-owner-avatar-placeholder">
                            {idea.owner.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="ideas-table-owner-name">
                        {getFirstName(idea.owner.name)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <CopyableId
                      id={idea.studentId}
                      label="Student ID"
                      testId="copy-student-id"
                    />
                  </td>
                  <td>
                    <div className="ideas-table-collaborated-badge">
                      {idea.collaborated}
                    </div>
                  </td>
                  <td>
                    <div className="ideas-table-date">
                      <span className="ideas-table-date-main">
                        {idea.creationDate}
                      </span>
                      <span className="ideas-table-date-time">
                        {idea.creationTime}
                      </span>
                    </div>
                  </td>
                  <td>
                    <ActionDropdown
                      testId="idea-dropdown"
                      items={[
                        {
                          label: "Idea Details",
                          onClick: (e) => handleViewIdeaDetails(idea, e),
                        },
                        {
                          isDivider: true,
                          label: "",
                          onClick: () => {},
                        },
                        idea.isFlagged
                          ? {
                              label: "Unflag",
                              icon: "flag-icon",
                              variant: "danger",
                              onClick: (e) => handleUnflagIdea(idea, e),
                            }
                          : {
                              label: "Flag",
                              icon: "flag-icon",
                              onClick: (e) => handleFlagIdea(idea, e),
                            },
                        {
                          label: "Delete Idea",
                          variant: "danger",
                          onClick: (e) => handleDeleteClick(idea, e),
                        },
                      ]}
                    />
                  </td>
                </tr>
                {index < ideas.length - 1 && !idea.isFlagged && (
                  <tr className="idea-divider-row">
                    <td colSpan={7}>
                      <Divider />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <UnflagModal
        isOpen={unflagModalOpen}
        onClose={() => setUnflagModalOpen(false)}
        onConfirm={handleUnflagConfirm}
        itemName={ideaToUnflag?.ideaTitle || ""}
        type="idea"
      />

      <FlagModal
        isOpen={flagModalOpen}
        onClose={() => setFlagModalOpen(false)}
        onConfirm={handleFlagConfirm}
        itemName={ideaToFlag?.ideaTitle || ""}
        type="idea"
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={ideaToDelete?.ideaTitle || ""}
        type="idea"
      />

      <IdeaDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedIdea(null);
        }}
        ideaData={
          selectedIdea
            ? {
                id: selectedIdea.id,
                title: selectedIdea.ideaTitle,
                owner: {
                  name: selectedIdea.owner.name,
                  studentId: selectedIdea.studentId,
                  avatar: selectedIdea.owner.avatar,
                },
                creationDate: selectedIdea.creationDate,
                creationTime: selectedIdea.creationTime,
                description:
                  selectedIdea.description || "No description provided",
                lookingFor: selectedIdea.lookingFor || "N/A",
                collaborators: selectedIdea.collaborators || [],
                isFlagged: selectedIdea.isFlagged,
                flagReason: selectedIdea.flagReason,
              }
            : null
        }
      />

      {showToast && (
        <CustomToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};
