import React, { useState, useRef, useEffect } from "react";
import { AssetIcon, DeleteModal, CustomToast } from "../../../components-v2";
import { SpaceTypeChip, SpaceType } from "./SpaceTypeChip";
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
}

interface SpaceTableProps {
  spaces: SpaceData[];
}

type SortField = "spaceName" | "owner" | "events" | "members" | "creationDate";
type SortDirection = "asc" | "desc";

export const SpaceTable: React.FC<SpaceTableProps> = ({ spaces }) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<SpaceData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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

  const handleDeleteClick = (space: SpaceData) => {
    setSpaceToDelete(space);
    setDeleteModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteConfirm = (reason: string) => {
    if (spaceToDelete) {
      console.log(
        "Deleting space:",
        spaceToDelete.spaceName,
        "Reason:",
        reason
      );
      // TODO: Call API to delete space
      setToastMessage(
        `Space "${spaceToDelete.spaceName}" deleted successfully`
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleViewSpaceDetails = (space: SpaceData, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("View space details", space);
    // TODO: Implement view space details modal
    setOpenDropdownId(null);
  };

  const handleFlagSpace = (space: SpaceData, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Flag space", space);
    // TODO: Implement flag space functionality
    setOpenDropdownId(null);
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
        <tbody>
          {sortedSpaces.map((space) => (
            <tr key={space.id}>
              <td>
                <span className="space-name">{space.spaceName}</span>
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
                  <span className="owner-name">{space.owner.name}</span>
                </div>
              </td>
              <td>
                <div className="student-id-cell">
                  <div className="student-id-badge">
                    <span>{space.studentId}</span>
                  </div>
                  <button
                    data-testid="copy-student-id-btn"
                    className="copy-btn"
                    onClick={() => handleCopyStudentId(space.studentId)}
                    title="Copy student ID"
                  >
                    <AssetIcon name="copy-icon" size={16} color="#ACB6BA" />
                  </button>
                </div>
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
                <div className="space-dropdown-container" ref={dropdownRef}>
                  <button
                    data-testid="space-dropdown-toggle-btn"
                    className="space-dropdown-toggle"
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === space.id ? null : space.id
                      )
                    }
                  >
                    <AssetIcon
                      name="vertical-3-dots-icon"
                      size={24}
                      color="#1D1B20"
                    />
                  </button>
                  {openDropdownId === space.id && (
                    <div className="space-dropdown-menu">
                      <div
                        className="space-dropdown-item space-dropdown-title"
                        onClick={(e) => handleViewSpaceDetails(space, e)}
                      >
                        Space Details
                      </div>
                      <div
                        className="space-dropdown-item space-dropdown-item-flag"
                        onClick={(e) => handleFlagSpace(space, e)}
                      >
                        <AssetIcon name="flag-icon" size={18} color="#1D1B20" />
                        <span>Flag</span>
                      </div>
                      <div className="space-dropdown-divider" />
                      <div
                        className="space-dropdown-item space-dropdown-item-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(space);
                        }}
                      >
                        Delete Space
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
        itemName={spaceToDelete?.spaceName || ""}
        type="space"
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
