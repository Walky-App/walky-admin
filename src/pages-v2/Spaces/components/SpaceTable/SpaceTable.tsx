import React, { useState } from "react";
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
import { useMixpanel } from "../../../../hooks/useMixpanel";

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
  pageContext?: string;
}

type SortField = "spaceName" | "owner" | "events" | "members" | "creationDate";
type SortDirection = "asc" | "desc";

export const SpaceTable: React.FC<SpaceTableProps> = ({
  spaces,
  pageContext = "Spaces",
}) => {
  const { trackEvent } = useMixpanel();
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

  const handleDeleteClick = (space: SpaceData) => {
    setSpaceToDelete(space);
    setDeleteModalOpen(true);
    trackEvent(`${pageContext} - Delete Space Action`, {
      spaceId: space.id,
      spaceName: space.spaceName,
    });
  };

  const handleDeleteConfirm = (reason: string) => {
    if (spaceToDelete) {
      console.log(
        "Deleting space:",
        spaceToDelete.spaceName,
        "Reason:",
        reason
      );
      trackEvent(`${pageContext} - Delete Space Confirmed`, {
        spaceId: spaceToDelete.id,
        spaceName: spaceToDelete.spaceName,
        reason,
      });
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
    trackEvent(`${pageContext} - View Space Details Action`, {
      spaceId: space.id,
      spaceName: space.spaceName,
    });
    // Convert SpaceData to SpaceDetailsData
    const spaceDetails: SpaceDetailsData = {
      id: space.id,
      spaceName: space.spaceName,
      owner: {
        name: space.owner.name,
        avatar: space.owner.avatar,
        studentId: space.studentId,
      },
      creationDate: space.creationDate,
      creationTime: space.creationTime,
      category: space.category,
      chapter: "FIU Official",
      contact: "fiuhonduras@gmail.com",
      about:
        "Our club is a space to connect, share, and meet new people. It's all about building community, having good conversations, and enjoying time together.",
      howWeUse:
        "We post events and offer general information about how to get involved. If you are interested in joining or want to recommend someone please contact us and we'll get back to you!",
      description:
        "A vibrant community space for students to connect and share their culture.",
      events: [
        {
          id: "1",
          title: "4v4 Basketball game",
          date: "OCT 16, 2025",
          time: "2:00 PM",
          location: "S. Campus Basketball Courts",
          image:
            "https://www.figma.com/api/mcp/asset/86606deb-9b9b-4ceb-ad63-93bf44dcac72",
        },
      ],
      members: [
        {
          id: "1",
          name: "Anni",
          avatar:
            "https://www.figma.com/api/mcp/asset/a5bd2efd-d2f7-4634-9ac4-fcb1ccb6d939",
        },
        {
          id: "2",
          name: "Ben",
          avatar:
            "https://www.figma.com/api/mcp/asset/7c38d015-cf9a-408b-88a1-d8cd58c5e8a3",
        },
        {
          id: "3",
          name: "Justin",
          avatar:
            "https://www.figma.com/api/mcp/asset/65ed9095-436b-4458-84be-7878e60e56ea",
        },
        {
          id: "4",
          name: "Austin",
          avatar:
            "https://www.figma.com/api/mcp/asset/0324e47a-ecc7-439a-a8ea-513c8588e1f2",
        },
        {
          id: "5",
          name: "Nataly",
          avatar:
            "https://www.figma.com/api/mcp/asset/f283a2e1-c53a-470c-8da7-f8c85f6c8551",
        },
        { id: "6", name: "Becky", avatar: space.owner.avatar },
      ],
      spaceImage:
        "https://www.figma.com/api/mcp/asset/edc87584-5c7e-4e17-9c9c-95b0f48140f2",
      spaceLogo:
        "https://www.figma.com/api/mcp/asset/df84a020-2c75-41bf-9ec0-ab7d12ff8e15",
      memberRange: "1-10",
      yearEstablished: "2024",
      governingBody: "Interfraternity",
      primaryFocus: "Social",
      isFlagged: space.isFlagged,
      flagReason: space.flagReason,
    };
    setSelectedSpace(spaceDetails);
    setDetailsModalOpen(true);
  };

  const handleFlagSpace = (space: SpaceData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpaceToFlag(space);
    setFlagModalOpen(true);
    trackEvent(`${pageContext} - Flag Space Action`, {
      spaceId: space.id,
      spaceName: space.spaceName,
    });
  };

  const handleFlagConfirm = (reason: string) => {
    if (spaceToFlag) {
      console.log("Flagging space:", spaceToFlag.spaceName, "Reason:", reason);
      trackEvent(`${pageContext} - Flag Space Confirmed`, {
        spaceId: spaceToFlag.id,
        spaceName: spaceToFlag.spaceName,
        reason,
      });
      // TODO: Call API to flag space
      setToastMessage(`Space "${spaceToFlag.spaceName}" flagged successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleUnflagSpace = (space: SpaceData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpaceToUnflag(space);
    setUnflagModalOpen(true);
    trackEvent(`${pageContext} - Unflag Space Action`, {
      spaceId: space.id,
      spaceName: space.spaceName,
    });
  };

  const handleUnflagConfirm = () => {
    if (spaceToUnflag) {
      console.log("Unflagging space:", spaceToUnflag.spaceName);
      trackEvent(`${pageContext} - Unflag Space Confirmed`, {
        spaceId: spaceToUnflag.id,
        spaceName: spaceToUnflag.spaceName,
      });
      // TODO: Call API to unflag space
      setToastMessage(
        `Space "${spaceToUnflag.spaceName}" unflagged successfully`
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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
                    <span className="owner-name">{space.owner.name}</span>
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
        onClose={() => {
          setUnflagModalOpen(false);
          trackEvent(`${pageContext} - Unflag Space Modal Closed`);
        }}
        onConfirm={handleUnflagConfirm}
        itemName={spaceToUnflag?.spaceName || ""}
        type="space"
      />

      <FlagModal
        isOpen={flagModalOpen}
        onClose={() => {
          setFlagModalOpen(false);
          trackEvent(`${pageContext} - Flag Space Modal Closed`);
        }}
        onConfirm={handleFlagConfirm}
        itemName={spaceToFlag?.spaceName || ""}
        type="space"
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          trackEvent(`${pageContext} - Delete Space Modal Closed`);
        }}
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
