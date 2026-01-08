import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import AssetIcon from "../AssetIcon/AssetIcon";
import { useSchool } from "../../contexts/SchoolContext";
import { useCampus } from "../../contexts/CampusContext";
import { usePermissions } from "../../hooks/usePermissions";
import { getAssignableRoleDisplayNames } from "../../lib/permissions";
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

const CreateMemberModal: React.FC<CreateMemberModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const { userRole } = usePermissions();

  // Get available roles based on the current user's role hierarchy
  const roleOptions = useMemo(() => {
    const assignableRoles = getAssignableRoleDisplayNames(userRole);
    // Filter to only include RoleType values (excluding "Walky Internal")
    return assignableRoles.filter(
      (role): role is RoleType =>
        role === "Walky Admin" ||
        role === "School Admin" ||
        role === "Campus Admin" ||
        role === "Moderator"
    );
  }, [userRole]);

  const [formData, setFormData] = useState<MemberFormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    school: "",
    campus: "",
  });

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roleButtonRef = useRef<HTMLButtonElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const [roleMenuPosition, setRoleMenuPosition] = useState({
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

  // Close modal on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node) &&
        roleButtonRef.current &&
        !roleButtonRef.current.contains(event.target as Node)
      ) {
        setIsRoleDropdownOpen(false);
      }
    };

    if (isRoleDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isRoleDropdownOpen]);

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
                      {roleOptions.length > 0 ? (
                        roleOptions.map((role) => (
                          <button
                            data-testid="create-member-role-option-btn"
                            key={role}
                            className="create-member-option"
                            onClick={() => handleRoleSelect(role)}
                          >
                            {role}
                          </button>
                        ))
                      ) : (
                        <button
                          data-testid="create-member-role-option-empty"
                          className="create-member-option"
                          disabled
                        >
                          No roles available
                        </button>
                      )}
                    </div>,
                    document.body
                  )}
              </div>
            </div>

            {/* School and Campus Row - Display only (uses current selection) */}
            <div className="create-member-row">
              <div className="create-member-field">
                <label className="create-member-label">School</label>
                <div className="create-member-dropdown-wrapper">
                  <button
                    data-testid="create-member-school-dropdown-btn"
                    className="create-member-select disabled"
                    disabled
                  >
                    <span>
                      {selectedSchool?.school_name || selectedSchool?.name || "No school selected"}
                    </span>
                    <AssetIcon name="arrow-down" size={16} />
                  </button>
                </div>
              </div>
              <div className="create-member-field">
                <label className="create-member-label">Campus</label>
                <div className="create-member-dropdown-wrapper">
                  <button
                    data-testid="create-member-campus-dropdown-btn"
                    className="create-member-select disabled"
                    disabled
                  >
                    <span>
                      {selectedCampus?.campus_name || selectedCampus?.name || "No campus selected"}
                    </span>
                    <AssetIcon name="arrow-down" size={16} />
                  </button>
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
