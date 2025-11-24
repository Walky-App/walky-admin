import React, { useState } from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
import { SearchInput } from "../SearchInput/SearchInput";
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
        <button
          data-testid="add-ambassador-modal-close"
          className="add-ambassador-modal-close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={24} />
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
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search"
              testId="add-ambassador-search"
            />
            <button
              className="add-ambassador-search-button"
              onClick={handleSearch}
              data-testid="add-ambassador-search-button"
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
                  <AssetIcon name="double-users-icon" size={48} />
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
                      data-testid="add-ambassador-student-checkbox"
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
            data-testid="add-ambassador-cancel-btn"
            className="add-ambassador-cancel-button"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            data-testid="add-ambassador-confirm-btn"
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
