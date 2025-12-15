import React, { useState, useEffect } from "react";
import {
  AssetIcon,
  DeleteAmbassadorModal,
  AddAmbassadorModal,
  CustomToast,
  Divider,
  Pagination,
} from "../../../components-v2";
import { CopyableId } from "../../../components-v2/CopyableId";
import "./Ambassadors.css";
import { useTheme } from "../../../hooks/useTheme";
import { apiClient } from "../../../API";
import { formatMemberSince } from "../../../lib/utils/dateUtils";

interface AmbassadorData {
  id: string;
  studentId: string;
  name: string;
  avatar: string;
  major: string;
  ambassadorSince: string;
  memberSince: string;
  status: "Active" | "Inactive";
}

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const Ambassadors: React.FC = () => {
  const { theme } = useTheme();
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

  // Ambassadors state
  const [ambassadors, setAmbassadors] = useState<AmbassadorData[]>([]);

  const fetchAmbassadors = async () => {
    setLoading(true);
    try {
      // Note: Backend doesn't support pagination, fetches all ambassadors
      const res = await apiClient.ambassadors.ambassadorsList();

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
      };

      const transformedAmbassadors: AmbassadorData[] = (data as ExtendedAmbassador[]).map((a) => {
        const formattedAmbassadorSince = formatMemberSince(a.createdAt);
        const formattedMemberSince = formatMemberSince(a.createdAt);

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
          memberSince:
            formattedMemberSince === "N/A" ? "Unknown" : formattedMemberSince,
          status: (a.is_active ? "Active" : "Inactive") as "Active" | "Inactive",
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
          apiClient.ambassadors.ambassadorsCreate({
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
        await apiClient.ambassadors.ambassadorsDelete(ambassadorToDelete.id);
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
        <h1 className="page-title">Ambassador directory</h1>
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
          <button
            data-testid="add-ambassador-btn"
            className="add-button"
            onClick={handleAddAmbassador}
          >
            <span>+ Add a new Ambassador</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="ambassadors-table-wrapper">
          <table className="ambassadors-table">
            <thead>
              <tr className="table-header-row">
                <th>
                  <span>Student ID</span>
                </th>
                <th>
                  <div className="ambassador-header">
                    <span>Ambassador</span>
                    <AssetIcon name="swap-arrows-icon" size={24} />
                  </div>
                </th>
                <th>
                  <span>Major</span>
                </th>
                <th>
                  <div className="ambassador-header">
                    <span>Ambassador since</span>
                    <AssetIcon name="swap-arrows-icon" size={24} />
                  </div>
                </th>
                <th>
                  <div className="ambassador-header">
                    <span>Member since</span>
                    <AssetIcon name="swap-arrows-icon" size={24} />
                  </div>
                </th>
                <th>
                  <div className="ambassador-header">
                    <span>Status</span>
                    <AssetIcon name="swap-arrows-icon" size={24} />
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                renderSkeletonRows()
              ) : ambassadors.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No ambassadors found
                  </td>
                </tr>
              ) : (
                ambassadors.map((ambassador, index) => (
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
                        <span
                          className={`status-badge ${ambassador.status.toLowerCase()}`}
                        >
                          {ambassador.status}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="ambassador-actions">
                        <button
                          data-testid="delete-ambassador-btn"
                          className="delete-button"
                          onClick={() => handleDeleteAmbassador(ambassador.id)}
                          title="Delete ambassador"
                        >
                          <AssetIcon name="delete-icon" size={24} />
                        </button>
                      </td>
                    </tr>
                    {index < ambassadors.length - 1 && (
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
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(ambassadors.length / 10)}
          totalEntries={ambassadors.length}
          entriesPerPage={10}
          onPageChange={setCurrentPage}
        />
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
