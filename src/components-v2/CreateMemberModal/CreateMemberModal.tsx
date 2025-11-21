import React, { useState } from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
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
        <button className="create-member-close" onClick={onClose}>
          <AssetIcon name="x-icon" size={16} />
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
                type="email"
                className="create-member-input"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            {/* Role Dropdown */}
            <div className="create-member-field">
              <label className="create-member-label">Role</label>
              <div className="create-member-dropdown-wrapper">
                <button
                  className="create-member-select"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                >
                  <span className={formData.role ? "" : "placeholder"}>
                    {formData.role || "Role"}
                  </span>
                  <span className="create-member-arrow">▼</span>
                </button>
                {isRoleDropdownOpen && (
                  <div className="create-member-dropdown">
                    {roleOptions.map((role) => (
                      <button
                        key={role}
                        className="create-member-option"
                        onClick={() => handleRoleSelect(role)}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* School and Campus Row */}
            <div className="create-member-row">
              <div className="create-member-field">
                <label className="create-member-label">School</label>
                <div className="create-member-dropdown-wrapper">
                  <button
                    className="create-member-select"
                    onClick={() =>
                      setIsSchoolDropdownOpen(!isSchoolDropdownOpen)
                    }
                  >
                    <span className={formData.school ? "" : "placeholder"}>
                      {formData.school || "Select School"}
                    </span>
                    <span className="create-member-arrow">▼</span>
                  </button>
                  {isSchoolDropdownOpen && (
                    <div className="create-member-dropdown">
                      <button
                        className="create-member-option"
                        onClick={() => {
                          handleInputChange("school", "School 1");
                          setIsSchoolDropdownOpen(false);
                        }}
                      >
                        School 1
                      </button>
                      <button
                        className="create-member-option"
                        onClick={() => {
                          handleInputChange("school", "School 2");
                          setIsSchoolDropdownOpen(false);
                        }}
                      >
                        School 2
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="create-member-field">
                <label className="create-member-label">Campus</label>
                <div className="create-member-dropdown-wrapper">
                  <button
                    className="create-member-select"
                    onClick={() =>
                      setIsCampusDropdownOpen(!isCampusDropdownOpen)
                    }
                  >
                    <span className={formData.campus ? "" : "placeholder"}>
                      {formData.campus || "Select Campus"}
                    </span>
                    <span className="create-member-arrow">▼</span>
                  </button>
                  {isCampusDropdownOpen && (
                    <div className="create-member-dropdown">
                      <button
                        className="create-member-option"
                        onClick={() => {
                          handleInputChange("campus", "Campus 1");
                          setIsCampusDropdownOpen(false);
                        }}
                      >
                        Campus 1
                      </button>
                      <button
                        className="create-member-option"
                        onClick={() => {
                          handleInputChange("campus", "Campus 2");
                          setIsCampusDropdownOpen(false);
                        }}
                      >
                        Campus 2
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="create-member-buttons">
            <button className="create-member-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="create-member-confirm" onClick={handleCreate}>
              Create new member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMemberModal;
