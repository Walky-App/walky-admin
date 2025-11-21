import React, { useState, useRef, useEffect } from "react";
import "./IdeasTable.css";
import { AssetIcon, IdeaDetailsModal } from "../../../components-v2";
import { DeleteModal } from "../../../components-v2/DeleteModal/DeleteModal";
import { CustomToast } from "../../../components-v2/CustomToast/CustomToast";

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
  description?: string;
  lookingFor?: string;
  collaborators?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

interface IdeasTableProps {
  ideas: IdeaData[];
}

type SortField = "ideaTitle" | "owner" | "collaborated" | "creationDate";
type SortDirection = "asc" | "desc";

export const IdeasTable: React.FC<IdeasTableProps> = ({ ideas }) => {
  const [sortField, setSortField] = useState<SortField>("creationDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState<IdeaData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<IdeaData | null>(null);
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

    if (openDropdownId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedIdeas = [...ideas].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "ideaTitle":
        aValue = a.ideaTitle;
        bValue = b.ideaTitle;
        break;
      case "owner":
        aValue = a.owner.name;
        bValue = b.owner.name;
        break;
      case "collaborated":
        aValue = a.collaborated;
        bValue = b.collaborated;
        break;
      case "creationDate":
        aValue = new Date(`${a.creationDate} ${a.creationTime}`).getTime();
        bValue = new Date(`${b.creationDate} ${b.creationTime}`).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleCopyStudentId = (studentId: string) => {
    navigator.clipboard.writeText(studentId);
    setToastMessage("Student ID copied to clipboard");
    setShowToast(true);
  };

  const handleViewIdeaDetails = (idea: IdeaData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIdea(idea);
    setDetailsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleFlagIdea = (idea: IdeaData, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Flag idea", idea);
    // TODO: Implement flag idea functionality
    setOpenDropdownId(null);
  };

  const handleDeleteClick = (idea: IdeaData) => {
    setIdeaToDelete(idea);
    setDeleteModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteConfirm = (reason: string) => {
    if (ideaToDelete) {
      console.log("Deleting idea:", ideaToDelete, "Reason:", reason);
      // TODO: Implement actual delete API call
      setToastMessage(`"${ideaToDelete.ideaTitle}" has been deleted`);
      setShowToast(true);
      setDeleteModalOpen(false);
      setIdeaToDelete(null);
    }
  };

  return (
    <>
      <table className="ideas-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("ideaTitle")}>
              <div className="ideas-table-header-cell">
                <span>Idea title</span>
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
              </div>
            </th>
            <th onClick={() => handleSort("owner")}>
              <div className="ideas-table-header-cell">
                <span>Owner</span>
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
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
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
              </div>
            </th>
            <th onClick={() => handleSort("creationDate")}>
              <div className="ideas-table-header-cell">
                <span>Creation date</span>
                <AssetIcon name="swap-arrows-icon" size={24} color="#1D1B20" />
              </div>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedIdeas.map((idea) => (
            <tr key={idea.id}>
              <td>
                <span className="ideas-table-idea-title">{idea.ideaTitle}</span>
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
                    {idea.owner.name}
                  </span>
                </div>
              </td>
              <td>
                <div className="ideas-table-student-id">
                  <div className="ideas-table-student-id-box">
                    {idea.studentId}
                  </div>
                  <button
                    className="ideas-table-copy-button"
                    onClick={() => handleCopyStudentId(idea.studentId)}
                    aria-label="Copy student ID"
                  >
                    <AssetIcon name="copy-icon" size={16} color="#ACB6BA" />
                  </button>
                </div>
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
                <div className="idea-dropdown-container" ref={dropdownRef}>
                  <button
                    className="idea-dropdown-toggle"
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === idea.id ? null : idea.id
                      )
                    }
                    aria-label="More options"
                  >
                    <AssetIcon
                      name="vertical-3-dots-icon"
                      size={24}
                      color="#1D1B20"
                    />
                  </button>
                  {openDropdownId === idea.id && (
                    <div className="idea-dropdown-menu">
                      <div
                        className="idea-dropdown-item idea-dropdown-title"
                        onClick={(e) => handleViewIdeaDetails(idea, e)}
                      >
                        Idea Details
                      </div>
                      <div
                        className="idea-dropdown-item idea-dropdown-item-flag"
                        onClick={(e) => handleFlagIdea(idea, e)}
                      >
                        <AssetIcon name="flag-icon" size={18} color="#1D1B20" />
                        <span>Flag</span>
                      </div>
                      <div className="idea-dropdown-divider" />
                      <div
                        className="idea-dropdown-item idea-dropdown-item-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(idea);
                        }}
                      >
                        Delete Idea
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
                  selectedIdea.description ||
                  "This idea is built around kids games to help kids improve their vocab. I'm looking for 3 people to join my team, and possibly a fourth. I'm a programmer.",
                lookingFor:
                  selectedIdea.lookingFor ||
                  "Marketing Junior year, Design students, and all business majors interested in a new app",
                collaborators: selectedIdea.collaborators || [
                  {
                    id: "1",
                    name: "Ben",
                    avatar:
                      "https://www.figma.com/api/mcp/asset/2eb15d6f-b35b-4b33-92d6-9a3598f9b948",
                  },
                  {
                    id: "2",
                    name: "Leo",
                    avatar:
                      "https://www.figma.com/api/mcp/asset/9b3a5b2a-9bbe-4e92-9b64-5955454b1e9b",
                  },
                  {
                    id: "3",
                    name: "Mariana",
                    avatar:
                      "https://www.figma.com/api/mcp/asset/9fa58bd8-6b2c-48e5-910f-6322680cb6af",
                  },
                  {
                    id: "4",
                    name: "Anni",
                    avatar:
                      "https://www.figma.com/api/mcp/asset/ef015d1a-dbcd-47c5-b159-04c06a37a7d1",
                  },
                  {
                    id: "5",
                    name: "Justin",
                    avatar:
                      "https://www.figma.com/api/mcp/asset/720d3983-b06d-4bcb-9fd8-03d3510897d8",
                  },
                ],
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
