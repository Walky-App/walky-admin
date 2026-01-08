import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import AssetIcon from "../AssetIcon/AssetIcon";
import { usePermissions } from "../../hooks/usePermissions";
import { getAssignableRoleDisplayNames } from "../../lib/permissions";
import "./ChangeRoleModal.css";

type RoleType = "Walky Admin" | "Walky Internal" | "School Admin" | "Campus Admin" | "Moderator";

interface ChangeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newRole: RoleType) => void;
  currentRole: RoleType;
}

const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentRole,
}) => {
  const { userRole } = usePermissions();
  const [selectedRole, setSelectedRole] = useState<RoleType>(currentRole);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get available roles based on the current user's role hierarchy
  const roleOptions = useMemo(() => {
    const assignableRoles = getAssignableRoleDisplayNames(userRole);
    // Cast to RoleType array - the assignable roles will be valid RoleType values
    return assignableRoles as RoleType[];
  }, [userRole]);

  const roleButtonRef = useRef<HTMLButtonElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const [roleMenuPosition, setRoleMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (isDropdownOpen && roleButtonRef.current) {
      const rect = roleButtonRef.current.getBoundingClientRect();
      setRoleMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node) &&
        roleButtonRef.current &&
        !roleButtonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

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
        <button
          data-testid="change-role-close-btn"
          className="change-role-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={16} />
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
                ref={roleButtonRef}
                data-testid="change-role-dropdown-btn"
                className="change-role-select"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{selectedRole}</span>
                <AssetIcon name="arrow-down" size={16} />
              </button>
              {isDropdownOpen &&
                createPortal(
                  <div
                    ref={roleDropdownRef}
                    className="change-role-dropdown"
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
                          data-testid="change-role-option-btn"
                          key={role}
                          className={`change-role-option ${
                            role === selectedRole ? "selected" : ""
                          }`}
                          onClick={() => handleRoleSelect(role)}
                        >
                          {role}
                        </button>
                      ))
                    ) : (
                      <button
                        data-testid="change-role-option-empty"
                        className="change-role-option"
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

          <div className="change-role-buttons">
            <button
              data-testid="change-role-cancel-btn"
              className="change-role-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              data-testid="change-role-confirm-btn"
              className="change-role-confirm"
              onClick={handleSave}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoleModal;
