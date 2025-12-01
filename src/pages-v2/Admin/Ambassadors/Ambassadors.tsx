import React, { useState } from "react";
import {
  AssetIcon,
  DeleteAmbassadorModal,
  AddAmbassadorModal,
  CustomToast,
  Divider,
} from "../../../components-v2";
import "./Ambassadors.css";
import { useTheme } from "../../../hooks/useTheme";
import { useMixpanel } from "../../../hooks/useMixpanel";

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
  const { trackEvent } = useMixpanel();
  const [currentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ambassadorToDelete, setAmbassadorToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Mock data - replace with real data from API
  const mockAmbassadors: AmbassadorData[] = [
    {
      id: "1",
      studentId: "166g...fjhsgt",
      name: "Anni",
      avatar: "",
      major: "Biology",
      ambassadorSince: "Oct 7, 2025",
      memberSince: "Nov 10, 2024",
      status: "Active",
    },
    {
      id: "2",
      studentId: "166g...fjhsgt",
      name: "Ben",
      avatar: "https://via.placeholder.com/48",
      major: "Biology",
      ambassadorSince: "Oct 7, 2025",
      memberSince: "Nov 10, 2024",
      status: "Active",
    },
    {
      id: "3",
      studentId: "166g...fjhsgt",
      name: "Austin",
      avatar: "",
      major: "Biology",
      ambassadorSince: "Oct 7, 2025",
      memberSince: "Nov 10, 2024",
      status: "Active",
    },
  ];

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
    trackEvent("Ambassadors - Add Ambassador Button Clicked");
  };

  const confirmAddAmbassadors = (selectedStudents: Student[]) => {
    // TODO: Implement actual add API call
    console.log("Adding ambassadors:", selectedStudents);
    trackEvent("Ambassadors - Ambassadors Added", {
      count: selectedStudents.length,
    });
    setToastMessage(
      `${selectedStudents.length} ambassador${
        selectedStudents.length > 1 ? "s" : ""
      } added successfully`
    );
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteAmbassador = (id: string) => {
    const ambassador = mockAmbassadors.find((a) => a.id === id);
    if (ambassador) {
      setAmbassadorToDelete({ id: ambassador.id, name: ambassador.name });
      setDeleteModalOpen(true);
      trackEvent("Ambassadors - Delete Ambassador Button Clicked", {
        ambassadorId: id,
        ambassadorName: ambassador.name,
      });
    }
  };

  const confirmDeleteAmbassador = () => {
    if (ambassadorToDelete) {
      // TODO: Implement actual delete API call
      console.log("Deleting ambassador:", ambassadorToDelete.id);
      trackEvent("Ambassadors - Ambassador Deleted", {
        ambassadorId: ambassadorToDelete.id,
        ambassadorName: ambassadorToDelete.name,
      });
      setToastMessage("Ambassador deleted successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const totalAmbassadors = mockAmbassadors.length;
  const activeAmbassadors = mockAmbassadors.filter(
    (a) => a.status === "Active"
  ).length;

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
              {mockAmbassadors.map((ambassador, index) => (
                <React.Fragment key={ambassador.id}>
                  <tr className="ambassador-row">
                    {/* Student ID Column */}
                    <td className="ambassador-student-id">
                      <div className="student-id-wrapper">
                        <div className="student-id">{ambassador.studentId}</div>
                        <button
                          className="copy-button"
                          data-testid="copy-ambassador-id-btn"
                          title="Copy Student ID"
                          onClick={() => {
                            navigator.clipboard.writeText(ambassador.studentId);
                            trackEvent("Ambassadors - Student ID Copied", {
                              ambassadorId: ambassador.id,
                            });
                            setToastMessage("Student ID copied to clipboard");
                            setShowToast(true);
                            setTimeout(() => setShowToast(false), 3000);
                          }}
                        >
                          <AssetIcon name="copy-icon" size={16} />
                        </button>
                      </div>
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
                  {index < mockAmbassadors.length - 1 && (
                    <tr className="ambassador-divider-row">
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

        {/* Pagination */}
        <div className="pagination-container">
          <p className="pagination-info">
            Showing {mockAmbassadors.length} of {totalAmbassadors} entries
          </p>
          <div className="pagination-controls">
            <button
              data-testid="pagination-prev-btn"
              className="pagination-button"
              disabled
            >
              Previous
            </button>
            <div className="page-number active">{currentPage}</div>
            <button
              data-testid="pagination-next-btn"
              className="pagination-button"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Ambassador Modal */}
      <AddAmbassadorModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          trackEvent("Ambassadors - Add Ambassador Modal Closed");
        }}
        onConfirm={confirmAddAmbassadors}
      />

      {/* Delete Confirmation Modal */}
      <DeleteAmbassadorModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          trackEvent("Ambassadors - Delete Ambassador Modal Closed");
        }}
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
