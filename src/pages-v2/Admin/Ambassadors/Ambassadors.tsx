import React, { useState, useEffect, useMemo } from "react";
import {
  AssetIcon,
  DeleteAmbassadorModal,
  AddAmbassadorModal,
  CustomToast,
  Divider,
  Pagination,
  NoData,
} from "../../../components-v2";
import { CopyableId } from "../../../components-v2/CopyableId";
import { getStatusChipStyle } from "../../../components-v2/utils/chipStyles";
import "./Ambassadors.css";
import { useTheme } from "../../../hooks/useTheme";
import { usePermissions } from "../../../hooks/usePermissions";
import { apiClient } from "../../../API";
import { formatMemberSince } from "../../../lib/utils/dateUtils";

interface AmbassadorData {
  id: string;
  studentId: string;
  name: string;
  avatar: string;
  major: string;
  ambassadorSince: string;
  ambassadorSinceRaw: string; // Raw date for sorting
  memberSince: string;
  memberSinceRaw: string; // Raw date for sorting
  status: "Active" | "Inactive" | "Deactivated";
}

type SortField = "name" | "ambassadorSince" | "memberSince" | "status";
type SortDirection = "asc" | "desc";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const Ambassadors: React.FC = () => {
  const { theme } = useTheme();
  const { canCreate, canDelete } = usePermissions();

  // Permission checks for actions
  const canAddAmbassador = canCreate("ambassadors");
  const canDeleteAmbassador = canDelete("ambassadors");

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ambassadorToDelete, setAmbassadorToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Sorting state
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Ambassadors state
  const [ambassadors, setAmbassadors] = useState<AmbassadorData[]>([]);

  const fetchAmbassadors = async () => {
    setLoading(true);
    try {
      // Note: Backend doesn't support pagination, fetches all ambassadors
      const res = await apiClient.api.adminAmbassadorsList();

      const data = res.data.data || [];

      // Extended type for API response with possible additional fields
      type ExtendedAmbassador = {
        _id?: string;
        name?: string;
        avatar_url?: string;
        avatar?: string;
        major?: string;
        createdAt?: string;
        is_active?: boolean;
        user_is_active?: boolean; // User's active status (deactivated student)
      };

      const transformedAmbassadors: AmbassadorData[] = (
        data as ExtendedAmbassador[]
      ).map((a) => {
        const formattedAmbassadorSince = formatMemberSince(a.createdAt);
        const formattedMemberSince = formatMemberSince(a.createdAt);

        // Determine status: if user is deactivated, show "Deactivated", otherwise use ambassador's is_active
        let status: "Active" | "Inactive" | "Deactivated" = "Active";
        if (a.user_is_active === false) {
          status = "Deactivated";
        } else if (a.is_active === false) {
          status = "Inactive";
        }

        return {
          id: a._id || "",
          studentId: a._id || "Unknown",
          name: a.name || "Unknown",
          avatar: a.avatar_url || a.avatar || "",
          major: a.major || "Unknown",
          ambassadorSince:
            formattedAmbassadorSince === "N/A"
              ? "Unknown"
              : formattedAmbassadorSince,
          ambassadorSinceRaw: a.createdAt || "",
          memberSince:
            formattedMemberSince === "N/A" ? "Unknown" : formattedMemberSince,
          memberSinceRaw: a.createdAt || "",
          status,
        };
      });

      setAmbassadors(transformedAmbassadors);
    } catch (error) {
      console.error("Failed to fetch ambassadors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbassadors();
  }, [currentPage]);

  // Get initials from name
  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleAddAmbassador = () => {
    setAddModalOpen(true);
  };

  const confirmAddAmbassadors = async (selectedStudents: Student[]) => {
    try {
      // Add each selected student as ambassador
      await Promise.all(
        selectedStudents.map((student) =>
          apiClient.api.adminAmbassadorsCreate({
            name: student.name || "",
            email: student.email || "",
            user_id: student.id,
          })
        )
      );

      console.log("Adding ambassadors:", selectedStudents);
      setToastMessage(
        `${selectedStudents.length} ambassador${
          selectedStudents.length > 1 ? "s" : ""
        } added successfully`
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Refresh list
      fetchAmbassadors();
    } catch (error) {
      console.error("Failed to add ambassadors:", error);
      setToastMessage("Failed to add ambassadors");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleDeleteAmbassador = (id: string) => {
    const ambassador = ambassadors.find((a) => a.id === id);
    if (ambassador) {
      setAmbassadorToDelete({ id: ambassador.id, name: ambassador.name });
      setDeleteModalOpen(true);
    }
  };

  const confirmDeleteAmbassador = async () => {
    if (ambassadorToDelete) {
      try {
        await apiClient.api.adminAmbassadorsDelete(ambassadorToDelete.id);
        console.log("Deleting ambassador:", ambassadorToDelete.id);
        setToastMessage("Ambassador deleted successfully");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Refresh list
        fetchAmbassadors();
      } catch (error) {
        console.error("Failed to delete ambassador:", error);
        setToastMessage("Failed to delete ambassador");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } finally {
        setDeleteModalOpen(false);
        setAmbassadorToDelete(null);
      }
    }
  };

  const activeAmbassadors = ambassadors.filter(
    (a) => a.status === "Active"
  ).length;

  // Handle sort column click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  const sortedAmbassadors = useMemo(() => {
    if (!sortField) return ambassadors;

    return [...ambassadors].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "ambassadorSince":
          comparison = a.ambassadorSinceRaw.localeCompare(b.ambassadorSinceRaw);
          break;
        case "memberSince":
          comparison = a.memberSinceRaw.localeCompare(b.memberSinceRaw);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          return 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [ambassadors, sortField, sortDirection]);

  const renderSkeletonRows = () =>
    Array.from({ length: 6 }).map((_, index) => (
      <React.Fragment key={`ambassador-skeleton-${index}`}>
        <tr className="ambassador-row skeleton-row">
          <td className="ambassador-student-id">
            <div className="skeleton-block skeleton-pill" />
          </td>
          <td className="ambassador-name-cell">
            <div className="ambassador-info">
              <div className="skeleton-block skeleton-avatar" />
              <div className="skeleton-stack">
                <div className="skeleton-block skeleton-line" />
                <div className="skeleton-block skeleton-line short" />
              </div>
            </div>
          </td>
          <td>
            <div className="skeleton-block skeleton-line" />
          </td>
          <td>
            <div className="skeleton-block skeleton-line" />
          </td>
          <td>
            <div className="skeleton-block skeleton-line" />
          </td>
          <td>
            <div className="skeleton-block skeleton-badge" />
          </td>
          <td className="ambassador-actions">
            <div className="skeleton-block skeleton-action" />
          </td>
        </tr>
        {index < 5 && (
          <tr className="ambassador-divider-row">
            <td colSpan={7}>
              <Divider />
            </td>
          </tr>
        )}
      </React.Fragment>
    ));

  return (
    <main className="ambassadors-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Ambassador Management</h1>
        <p className="page-subtitle">
          Manage campus ambassadors and student representatives
        </p>
      </div>

      {/* Main Content Container */}
      <div
        className={`ambassadors-container ${theme.isDark ? "dark-mode" : ""}`}
      >
        {/* Directory Header */}
        <div className="directory-header">
          <div className="directory-info">
            <p className="directory-count">
              {activeAmbassadors} ambassadors active
            </p>
          </div>
          {canAddAmbassador && (
            <button
              data-testid="add-ambassador-btn"
              className="add-button"
              onClick={handleAddAmbassador}
            >
              <span>+ Add a new Ambassador</span>
            </button>
          )}
        </div>

        {/* Table Container */}
        <div className="ambassadors-table-wrapper">
          <table className="ambassadors-table">
            <thead>
              <tr
                className={`table-header-row${
                  !loading && sortedAmbassadors.length === 0
                    ? " table-header-row--muted"
                    : ""
                }`}
              >
                <th>
                  <span>Student ID</span>
                </th>
                <th
                  onClick={() => handleSort("name")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="ambassador-header">
                    <span>Ambassador</span>
                    <AssetIcon name="swap-arrows-icon" size={24} />
                  </div>
                </th>
                <th>
                  <span>Major</span>
                </th>
                <th
                  onClick={() => handleSort("ambassadorSince")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="ambassador-header">
                    <span>Ambassador since</span>
                    <AssetIcon name="swap-arrows-icon" size={24} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("memberSince")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="ambassador-header">
                    <span>Member since</span>
                    <AssetIcon name="swap-arrows-icon" size={24} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("status")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="ambassador-header">
                    <span>Status</span>
                    <AssetIcon name="swap-arrows-icon" size={24} />
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <div className="content-space-divider" />
            <tbody>
              {loading ? (
                renderSkeletonRows()
              ) : sortedAmbassadors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state-cell">
                    <NoData
                      message="No ambassadors found"
                      iconName="double-users-icon"
                    />
                  </td>
                </tr>
              ) : (
                sortedAmbassadors.map((ambassador, index) => (
                  <React.Fragment key={ambassador.id}>
                    <tr className="ambassador-row">
                      {/* Student ID Column */}
                      <td className="ambassador-student-id">
                        <CopyableId
                          id={ambassador.studentId}
                          label="Student ID"
                          testId="copy-ambassador-id"
                        />
                      </td>

                      {/* Ambassador Column */}
                      <td className="ambassador-name-cell">
                        <div className="ambassador-info">
                          {ambassador.avatar ? (
                            <img
                              src={ambassador.avatar}
                              alt={ambassador.name}
                              className="ambassador-avatar"
                            />
                          ) : (
                            <div className="ambassador-avatar-placeholder">
                              {getInitials(ambassador.name)}
                            </div>
                          )}
                          <span className="ambassador-name">
                            {ambassador.name}
                          </span>
                        </div>
                      </td>

                      {/* Major Column */}
                      <td className="ambassador-major">{ambassador.major}</td>

                      {/* Ambassador Since Column */}
                      <td className="ambassador-since">
                        {ambassador.ambassadorSince}
                      </td>

                      {/* Member Since Column */}
                      <td className="member-since">{ambassador.memberSince}</td>

                      {/* Status Column */}
                      <td className="ambassador-status">
                        {(() => {
                          const statusStyle = getStatusChipStyle(
                            ambassador.status
                          );
                          const sizeClass =
                            statusStyle.size === "compact"
                              ? "status-chip-compact"
                              : "status-chip-regular";

                          return (
                            <span
                              className={`status-chip ${sizeClass}`}
                              style={{
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.text,
                                padding: statusStyle.padding,
                              }}
                            >
                              {statusStyle.label}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Actions Column */}
                      <td className="ambassador-actions">
                        {canDeleteAmbassador && (
                          <button
                            data-testid="delete-ambassador-btn"
                            className="delete-button"
                            onClick={() => handleDeleteAmbassador(ambassador.id)}
                            title="Delete ambassador"
                          >
                            <AssetIcon name="delete-icon" size={24} />
                          </button>
                        )}
                      </td>
                    </tr>
                    {index < sortedAmbassadors.length - 1 && (
                      <tr className="ambassador-divider-row">
                        <td colSpan={7}>
                          <Divider />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && sortedAmbassadors.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(sortedAmbassadors.length / 10)}
            totalEntries={sortedAmbassadors.length}
            entriesPerPage={10}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Add Ambassador Modal */}
      <AddAmbassadorModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={confirmAddAmbassadors}
      />

      {/* Delete Confirmation Modal */}
      <DeleteAmbassadorModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteAmbassador}
        ambassadorName={ambassadorToDelete?.name || ""}
      />

      {/* Success Toast */}
      {showToast && (
        <CustomToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </main>
  );
};
