import React, { useState } from "react";
import {
  AssetIcon,
  DeleteAmbassadorModal,
  AddAmbassadorModal,
  CustomToast,
} from "../../../components-v2";
import "./Ambassadors.css";

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
      avatar: "https://via.placeholder.com/48",
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
      avatar: "https://via.placeholder.com/48",
      major: "Biology",
      ambassadorSince: "Oct 7, 2025",
      memberSince: "Nov 10, 2024",
      status: "Active",
    },
  ];

  const handleCopyStudentId = (studentId: string) => {
    navigator.clipboard.writeText(studentId);
  };

  const handleAddAmbassador = () => {
    setAddModalOpen(true);
  };

  const confirmAddAmbassadors = (selectedStudents: Student[]) => {
    // TODO: Implement actual add API call
    console.log("Adding ambassadors:", selectedStudents);
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
    }
  };

  const confirmDeleteAmbassador = () => {
    if (ambassadorToDelete) {
      // TODO: Implement actual delete API call
      console.log("Deleting ambassador:", ambassadorToDelete.id);
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
    <div className="ambassadors-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Ambassador Management</h1>
        <p className="page-subtitle">
          Manage campus ambassadors and student representatives
        </p>
      </div>

      {/* Main Content Container */}
      <div className="ambassadors-container">
        {/* Directory Header */}
        <div className="directory-header">
          <div className="directory-info">
            <h2 className="directory-title">Ambassador directory</h2>
            <p className="directory-count">
              {activeAmbassadors} ambassadors active
            </p>
          </div>
          <button className="add-button" onClick={handleAddAmbassador}>
            <span>+ Add a new Ambassador</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="ambassadors-table-wrapper">
          <table className="ambassadors-table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header student-id-header">
                  <span>Student ID</span>
                </th>
                <th className="table-header ambassador-header">
                  <span>Ambassador</span>
                  <AssetIcon name="swap-arrows-icon" size={24} />
                </th>
                <th className="table-header major-header">
                  <span>Major</span>
                </th>
                <th className="table-header ambassador-since-header">
                  <span>Ambassador since</span>
                  <AssetIcon name="swap-arrows-icon" size={24} />
                </th>
                <th className="table-header member-since-header">
                  <span>Member since</span>
                  <AssetIcon name="swap-arrows-icon" size={24} />
                </th>
                <th className="table-header status-header">
                  <span>Status</span>
                  <AssetIcon name="swap-arrows-icon" size={24} />
                </th>
                <th className="table-header actions-header"></th>
              </tr>
            </thead>
            <tbody>
              {mockAmbassadors.map((ambassador) => (
                <tr key={ambassador.id} className="ambassador-row">
                  {/* Student ID Column */}
                  <td className="ambassador-student-id">
                    <div className="student-id-wrapper">
                      <span className="student-id">{ambassador.studentId}</span>
                      <button
                        className="copy-button"
                        onClick={() =>
                          handleCopyStudentId(ambassador.studentId)
                        }
                        title="Copy ID"
                      >
                        <AssetIcon name="copy-icon" size={16} />
                      </button>
                    </div>
                  </td>

                  {/* Ambassador Column */}
                  <td className="ambassador-name-cell">
                    <div className="ambassador-info">
                      <img
                        src={ambassador.avatar}
                        alt={ambassador.name}
                        className="ambassador-avatar"
                      />
                      <span className="ambassador-name">{ambassador.name}</span>
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
                      className="delete-button"
                      onClick={() => handleDeleteAmbassador(ambassador.id)}
                      title="Delete ambassador"
                    >
                      <span className="delete-icon">🗑️</span>
                    </button>
                  </td>
                </tr>
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
            <button className="pagination-button" disabled>
              Previous
            </button>
            <div className="page-number active">{currentPage}</div>
            <button className="pagination-button" disabled>
              Next
            </button>
          </div>
        </div>
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
    </div>
  );
};
