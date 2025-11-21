import React, { useState } from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./AddAmbassadorModal.css";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AddAmbassadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedStudents: Student[]) => void;
}

export const AddAmbassadorModal: React.FC<AddAmbassadorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = () => {
    // TODO: Replace with real API call
    const mockResults: Student[] = [
      {
        id: "1",
        name: "Anni Campbell",
        email: "AnniC@FIU.edu.co",
        avatar: "https://via.placeholder.com/48",
      },
      {
        id: "2",
        name: "Anni Smith",
        email: "AnniS@FIU.edu.co",
        avatar: "https://via.placeholder.com/48",
      },
      {
        id: "3",
        name: "Anni Thompson",
        email: "AnniT@FIU.edu.co",
        avatar: "https://via.placeholder.com/48",
      },
      {
        id: "4",
        name: "Anni Jones",
        email: "AnniJ@FIU.edu.co",
        avatar: "https://via.placeholder.com/48",
      },
    ];

    setSearchResults(mockResults);
    setHasSearched(true);
  };

  const handleCheckboxChange = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleConfirm = () => {
    const selected = searchResults.filter((student) =>
      selectedStudents.includes(student.id)
    );
    onConfirm(selected);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedStudents([]);
    setHasSearched(false);
    onClose();
  };

  return (
    <div className="add-ambassador-modal-overlay" onClick={handleClose}>
      <div
        className="add-ambassador-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="add-ambassador-modal-close" onClick={handleClose}>
          <AssetIcon name="x-icon" size={16} />
        </button>

        {/* Header */}
        <div className="add-ambassador-modal-header">
          <h2 className="add-ambassador-modal-title">New Ambassador</h2>
          <p className="add-ambassador-modal-subtitle">
            Select the students you want to make ambassadors from your list.
          </p>
        </div>

        {/* Search Container */}
        <div className="add-ambassador-search-container">
          <div className="add-ambassador-search-wrapper">
            <div className="add-ambassador-search-input-wrapper">
              <AssetIcon name="search-icon" size={12} />
              <input
                type="text"
                className="add-ambassador-search-input"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              className="add-ambassador-search-button"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {/* Results Area */}
          <div className="add-ambassador-results-area">
            {!hasSearched ? (
              // Empty State
              <div className="add-ambassador-empty-state">
                <div className="add-ambassador-empty-icon">
                  <svg width="32" height="33" viewBox="0 0 32 33" fill="none">
                    <path
                      d="M11.6667 8.66667C11.6667 10.5076 13.1591 12 15 12C16.8409 12 18.3333 10.5076 18.3333 8.66667C18.3333 6.82572 16.8409 5.33334 15 5.33334C13.1591 5.33334 11.6667 6.82572 11.6667 8.66667Z"
                      stroke="#8280FF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 17.6667C8 15.8257 9.49238 14.3333 11.3333 14.3333H18.6667C20.5076 14.3333 22 15.8257 22 17.6667V20.6667H8V17.6667Z"
                      stroke="#8280FF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M23.3333 8.66667C23.3333 10.5076 24.8257 12 26.6667 12C28.5076 12 30 10.5076 30 8.66667C30 6.82572 28.5076 5.33334 26.6667 5.33334C24.8257 5.33334 23.3333 6.82572 23.3333 8.66667Z"
                      stroke="#8280FF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M23.3333 20.6667V17.6667C23.3333 15.8257 24.8257 14.3333 26.6667 14.3333C28.5076 14.3333 30 15.8257 30 17.6667V20.6667"
                      stroke="#8280FF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="add-ambassador-empty-text">
                  The results will appear here once you enter a name
                </p>
              </div>
            ) : (
              // Results List
              <div className="add-ambassador-results-list">
                {searchResults.map((student) => (
                  <div key={student.id} className="add-ambassador-student-item">
                    <input
                      type="checkbox"
                      className="add-ambassador-checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleCheckboxChange(student.id)}
                    />
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="add-ambassador-student-avatar"
                    />
                    <div className="add-ambassador-student-info">
                      <p className="add-ambassador-student-name">
                        {student.name}
                      </p>
                      <p className="add-ambassador-student-email">
                        {student.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="add-ambassador-modal-actions">
          <button
            className="add-ambassador-cancel-button"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className={`add-ambassador-confirm-button ${
              selectedStudents.length === 0 ? "disabled" : ""
            }`}
            onClick={handleConfirm}
            disabled={selectedStudents.length === 0}
          >
            Add Ambassadors
          </button>
        </div>
      </div>
    </div>
  );
};
