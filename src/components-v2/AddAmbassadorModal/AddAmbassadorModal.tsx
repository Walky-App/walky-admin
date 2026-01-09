import React, { useState, useEffect } from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
import { NoData } from "../NoData/NoData";
import { SearchInput } from "../SearchInput/SearchInput";
import "./AddAmbassadorModal.css";
import { apiClient } from "../../API";
import { CSpinner } from "@coreui/react";
import { useSchool } from "../../contexts/SchoolContext";
import { useCampus } from "../../contexts/CampusContext";

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
  schoolId?: string;
  campusId?: string;
}

export const AddAmbassadorModal: React.FC<AddAmbassadorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  schoolId,
  campusId,
}) => {
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedStudents([]);
    setHasSearched(false);
    onClose();
  };

  // Close modal on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const res = await apiClient.api.adminV2MembersList({
        search: searchQuery,
        role: "student",
        limit: 20,
        exactMatch: true, // Only return exact first name or last name matches
        schoolId: schoolId || selectedSchool?._id,
        campusId: campusId || selectedCampus?._id,
      });

      const data = res.data.data || [];
      // Extended type for API response with possible additional fields
      type ExtendedMember = {
        id?: string;
        _id?: string;
        name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        avatar?: string;
        avatar_url?: string;
      };

      const students: Student[] = (data as ExtendedMember[]).map((user) => ({
        id: user.id || user._id || "",
        name:
          user.name ||
          `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
          "Unknown",
        email: user.email || "",
        avatar:
          user.avatar_url || user.avatar || "https://via.placeholder.com/48",
      }));

      setSearchResults(students);
      setHasSearched(true);
    } catch (error) {
      console.error("Failed to search students:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
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
          <AssetIcon name="close-button" size={16} />
        </button>

        {/* Header */}
        <div className="add-ambassador-modal-header">
          <h2 className="add-ambassador-modal-title">New Ambassador</h2>
          <p className="add-ambassador-modal-subtitle">
            Search by exact full name (e.g. "John Smith") to find students.
          </p>
        </div>

        {/* Search Container */}
        <div className="add-ambassador-search-container">
          <div className="add-ambassador-search-wrapper">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Enter full name (e.g. John Smith)"
              testId="add-ambassador-search"
              className="add-emba-search-input"
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
                <NoData message="The results will appear here once you enter a name" />
              </div>
            ) : (
              // Results List
              <div className="add-ambassador-results-list">
                {isLoading ? (
                  <div className="d-flex justify-content-center p-4">
                    <CSpinner color="primary" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="add-ambassador-empty-state">
                    <NoData message="No results found. Try another name." />
                  </div>
                ) : (
                  searchResults.map((student) => (
                    <div
                      key={student.id}
                      className="add-ambassador-student-item"
                    >
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
                  ))
                )}
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
