import React, { useState } from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./ChangeRoleModal.css";

type RoleType = "Walky Admin" | "School Admin" | "Campus Admin" | "Moderator";

interface ChangeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newRole: RoleType) => void;
  currentRole: RoleType;
}

const roleOptions: RoleType[] = [
  "Walky Admin",
  "School Admin",
  "Campus Admin",
  "Moderator",
];

const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentRole,
}) => {
  const [selectedRole, setSelectedRole] = useState<RoleType>(currentRole);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    onConfirm(selectedRole);
  };

  return (
    <div className="change-role-overlay" onClick={handleOverlayClick}>
      <div className="change-role-content" onClick={handleContentClick}>
        <button className="change-role-close" onClick={onClose}>
          <AssetIcon name="x-icon" size={16} />
        </button>

        <div className="change-role-body">
          <h2 className="change-role-title">Change role</h2>

          <p className="change-role-description">
            You're about to update this user's role. The new role will determine
            their permissions and access within the platform.
          </p>

          <div className="change-role-select-container">
            <label className="change-role-label">Select a role</label>
            <div className="change-role-dropdown-wrapper">
              <button
                className="change-role-select"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{selectedRole}</span>
                <span className="change-role-arrow">▼</span>
              </button>
              {isDropdownOpen && (
                <div className="change-role-dropdown">
                  {roleOptions.map((role) => (
                    <button
                      key={role}
                      className={`change-role-option ${
                        role === selectedRole ? "selected" : ""
                      }`}
                      onClick={() => handleRoleSelect(role)}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="change-role-buttons">
            <button className="change-role-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="change-role-confirm" onClick={handleSave}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoleModal;
