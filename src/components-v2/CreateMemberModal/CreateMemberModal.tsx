import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import AssetIcon from "../AssetIcon/AssetIcon";
import { useSchool, School } from "../../contexts/SchoolContext";
import { useCampus, Campus } from "../../contexts/CampusContext";
import "./CreateMemberModal.css";

type RoleType = "Walky Admin" | "School Admin" | "Campus Admin" | "Moderator";

export interface MemberFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: RoleType | "";
  school: string;
  campus: string;
}

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (memberData: MemberFormData) => void;
}

const roleOptions: RoleType[] = [
  "Walky Admin",
  "School Admin",
  "Campus Admin",
  "Moderator",
];

const CreateMemberModal: React.FC<CreateMemberModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { availableSchools, selectedSchool } = useSchool();
  const { availableCampuses, selectedCampus } = useCampus();

  const [formData, setFormData] = useState<MemberFormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    school: "",
    campus: "",
  });

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const [isCampusDropdownOpen, setIsCampusDropdownOpen] = useState(false);

  const roleButtonRef = useRef<HTMLButtonElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const schoolButtonRef = useRef<HTMLButtonElement>(null);
  const schoolDropdownRef = useRef<HTMLDivElement>(null);
  const campusButtonRef = useRef<HTMLButtonElement>(null);
  const campusDropdownRef = useRef<HTMLDivElement>(null);

  const [roleMenuPosition, setRoleMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [schoolMenuPosition, setSchoolMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [campusMenuPosition, setCampusMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (!isOpen) return;

    setFormData((prev) => ({
      ...prev,
      school: prev.school || selectedSchool?.school_name || "",
      campus: prev.campus || selectedCampus?.campus_name || "",
    }));
  }, [isOpen, selectedSchool, selectedCampus]);

  useEffect(() => {
    if (isRoleDropdownOpen && roleButtonRef.current) {
      const rect = roleButtonRef.current.getBoundingClientRect();
      setRoleMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isRoleDropdownOpen]);

  useEffect(() => {
    if (isSchoolDropdownOpen && schoolButtonRef.current) {
      const rect = schoolButtonRef.current.getBoundingClientRect();
      setSchoolMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isSchoolDropdownOpen]);

  useEffect(() => {
    if (isCampusDropdownOpen && campusButtonRef.current) {
      const rect = campusButtonRef.current.getBoundingClientRect();
      setCampusMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isCampusDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node) &&
        roleButtonRef.current &&
        !roleButtonRef.current.contains(event.target as Node)
      ) {
        setIsRoleDropdownOpen(false);
      }
      if (
        schoolDropdownRef.current &&
        !schoolDropdownRef.current.contains(event.target as Node) &&
        schoolButtonRef.current &&
        !schoolButtonRef.current.contains(event.target as Node)
      ) {
        setIsSchoolDropdownOpen(false);
      }
      if (
        campusDropdownRef.current &&
        !campusDropdownRef.current.contains(event.target as Node) &&
        campusButtonRef.current &&
        !campusButtonRef.current.contains(event.target as Node)
      ) {
        setIsCampusDropdownOpen(false);
      }
    };

    if (isRoleDropdownOpen || isSchoolDropdownOpen || isCampusDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isRoleDropdownOpen, isSchoolDropdownOpen, isCampusDropdownOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleInputChange = (field: keyof MemberFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleSelect = (role: RoleType) => {
    setFormData((prev) => ({ ...prev, role }));
    setIsRoleDropdownOpen(false);
  };

  const handleSchoolSelect = (school: School) => {
    setFormData((prev) => ({
      ...prev,
      school: school.school_name || school.name || "",
      campus: "",
    }));
    setIsSchoolDropdownOpen(false);
  };

  const handleCampusSelect = (campus: Campus) => {
    setFormData((prev) => ({
      ...prev,
      campus: campus.campus_name || campus.name || "",
    }));
    setIsCampusDropdownOpen(false);
  };

  const handleCreate = () => {
    // Validation could be added here
    onConfirm(formData);
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      school: "",
      campus: "",
    });
  };

  return (
    <div className="create-member-overlay" onClick={handleOverlayClick}>
      <div className="create-member-content" onClick={handleContentClick}>
        <button
          data-testid="create-member-close-btn"
          className="create-member-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={16} />
        </button>

        <div className="create-member-body">
          <div className="create-member-header">
            <h2 className="create-member-title">Create new member</h2>
            <p className="create-member-subtitle">
              Create a new administrator by filling in the required information
              below. They'll receive an email with access instructions once
              their account is created.
            </p>
          </div>

          <div className="create-member-form">
            {/* First and Last Name Row */}
            <div className="create-member-row">
              <div className="create-member-field">
                <label className="create-member-label">First name</label>
                <input
                  data-testid="create-member-firstname-input"
                  type="text"
                  className="create-member-input"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              </div>
              <div className="create-member-field">
                <label className="create-member-label">Last name</label>
                <input
                  data-testid="create-member-lastname-input"
                  type="text"
                  className="create-member-input"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="create-member-field">
              <label className="create-member-label">Email</label>
              <input
                data-testid="create-member-email-input"
                type="email"
                className="create-member-input"
                placeholder="john.doe@university.edu"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            {/* Role Dropdown */}
            <div className="create-member-field">
              <label className="create-member-label">Role</label>
              <div className="create-member-dropdown-wrapper">
                <button
                  ref={roleButtonRef}
                  data-testid="create-member-role-dropdown-btn"
                  className="create-member-select"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                >
                  <span className={formData.role ? "" : "placeholder"}>
                    {formData.role || "Select a role"}
                  </span>
                  <AssetIcon name="arrow-down" size={16} />
                </button>
                {isRoleDropdownOpen &&
                  createPortal(
                    <div
                      ref={roleDropdownRef}
                      className="create-member-dropdown"
                      style={{
                        position: "absolute",
                        top: `${roleMenuPosition.top}px`,
                        left: `${roleMenuPosition.left}px`,
                        minWidth: `${roleMenuPosition.width}px`,
                      }}
                    >
                      {roleOptions.map((role) => (
                        <button
                          data-testid="create-member-role-option-btn"
                          key={role}
                          className="create-member-option"
                          onClick={() => handleRoleSelect(role)}
                        >
                          {role}
                        </button>
                      ))}
                    </div>,
                    document.body
                  )}
              </div>
            </div>

            {/* School and Campus Row */}
            <div className="create-member-row">
              <div className="create-member-field">
                <label className="create-member-label">School</label>
                <div className="create-member-dropdown-wrapper">
                  <button
                    ref={schoolButtonRef}
                    data-testid="create-member-school-dropdown-btn"
                    className="create-member-select"
                    onClick={() =>
                      setIsSchoolDropdownOpen(!isSchoolDropdownOpen)
                    }
                  >
                    <span className={formData.school ? "" : "placeholder"}>
                      {formData.school || "Select a school"}
                    </span>
                    <AssetIcon name="arrow-down" size={16} />
                  </button>
                  {isSchoolDropdownOpen &&
                    createPortal(
                      <div
                        ref={schoolDropdownRef}
                        className="create-member-dropdown"
                        style={{
                          position: "absolute",
                          top: `${schoolMenuPosition.top}px`,
                          left: `${schoolMenuPosition.left}px`,
                          minWidth: `${schoolMenuPosition.width}px`,
                        }}
                      >
                        {availableSchools.map((school) => (
                          <button
                            data-testid="create-member-school-option-btn"
                            key={school._id || school.id}
                            className="create-member-option"
                            onClick={() => handleSchoolSelect(school)}
                          >
                            {school.school_name || school.name || "School"}
                          </button>
                        ))}
                        {availableSchools.length === 0 && (
                          <button
                            data-testid="create-member-school-option-empty"
                            className="create-member-option"
                            disabled
                          >
                            No schools available
                          </button>
                        )}
                      </div>,
                      document.body
                    )}
                </div>
              </div>
              <div className="create-member-field">
                <label className="create-member-label">Campus</label>
                <div className="create-member-dropdown-wrapper">
                  <button
                    ref={campusButtonRef}
                    data-testid="create-member-campus-dropdown-btn"
                    className="create-member-select"
                    onClick={() =>
                      setIsCampusDropdownOpen(!isCampusDropdownOpen)
                    }
                  >
                    <span className={formData.campus ? "" : "placeholder"}>
                      {formData.campus || "Select a campus"}
                    </span>
                    <AssetIcon name="arrow-down" size={16} />
                  </button>
                  {isCampusDropdownOpen &&
                    createPortal(
                      <div
                        ref={campusDropdownRef}
                        className="create-member-dropdown"
                        style={{
                          position: "absolute",
                          top: `${campusMenuPosition.top}px`,
                          left: `${campusMenuPosition.left}px`,
                          minWidth: `${campusMenuPosition.width}px`,
                        }}
                      >
                        {availableCampuses.map((campus) => (
                          <button
                            data-testid="create-member-campus-option-btn"
                            key={campus._id || campus.id}
                            className="create-member-option"
                            onClick={() => handleCampusSelect(campus)}
                          >
                            {campus.campus_name || campus.name || "Campus"}
                          </button>
                        ))}
                        {availableCampuses.length === 0 && (
                          <button
                            data-testid="create-member-campus-option-empty"
                            className="create-member-option"
                            disabled
                          >
                            No campuses available
                          </button>
                        )}
                      </div>,
                      document.body
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="create-member-buttons">
            <button
              data-testid="create-member-cancel-btn"
              className="create-member-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              data-testid="create-member-confirm-btn"
              className="create-member-confirm"
              onClick={handleCreate}
            >
              Create new member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMemberModal;
