import React, { useState } from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./RolePermissionsModal.css";

type RoleType = "Walky Admin" | "School Admin" | "Campus Admin" | "Moderator";

interface Permission {
  name: string;
  actions: string;
}

interface RoleData {
  title: string;
  description: string;
  permissions: Permission[];
}

interface RolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleType: RoleType;
}

const rolePermissionsData: Record<RoleType, RoleData> = {
  "Walky Admin": {
    title: "Walky Admin",
    description: "Full system access across all campuses and schools",
    permissions: [
      { name: "Engagement:", actions: "Read, Export." },
      { name: "Popular Features:", actions: "Read, Export." },
      { name: "User Interactions:", actions: "Read, Export." },
      { name: "Community:", actions: "Read, Export." },
      { name: "Student Safety:", actions: "Read, Export." },
      { name: "Student Behavior:", actions: "Read, Export." },
      { name: "Active Students:", actions: "Read, Update, Export." },
      { name: "Banned Students:", actions: "Read, Update, Export." },
      { name: "Inactive Students:", actions: "Read, Update, Export." },
      { name: "Disengaged Students:", actions: "Read, Export." },
      { name: "Reported Content:", actions: "Read, Update, Export." },
      { name: "Events Manager:", actions: "Read, Update, Export." },
      { name: "Events Insights:", actions: "Read, Export." },
      { name: "Spaces Manager:", actions: "Read, Update, Export." },
      { name: "Spaces Insights:", actions: "Read, Export." },
      { name: "Ideas Manager:", actions: "Read, Update, Export." },
      { name: "Ideas Insights:", actions: "Read, Export." },
      { name: "Campuses:", actions: "Read, Update." },
      { name: "Ambassadors:", actions: "Create, Read, Delete." },
      { name: "Profile:", actions: "Read, Update + Manage." },
      { name: "Security:", actions: "Read, Update + Manage." },
      { name: "Notifications:", actions: "Read, Update + Manage." },
      { name: "Danger Zone:", actions: "Read, Update." },
      {
        name: "Role Management:",
        actions: "Create, Read, Update, Delete + Manage.",
      },
    ],
  },
  "School Admin": {
    title: "School Admin",
    description:
      "Administrator with full access to manage all campuses and users within a specific school.",
    permissions: [
      { name: "Engagement:", actions: "Read, Export." },
      { name: "Popular Features:", actions: "Read, Export." },
      { name: "User Interactions:", actions: "Read, Export." },
      { name: "Community:", actions: "Read, Export." },
      { name: "Student Safety:", actions: "Read, Export." },
      { name: "Student Behavior:", actions: "Read, Export." },
      { name: "Active Students:", actions: "Read, Update, Export." },
      { name: "Banned Students:", actions: "Read, Update, Export." },
      { name: "Inactive Students:", actions: "Read, Update, Export." },
      { name: "Disengaged Students:", actions: "Read, Export." },
      { name: "Reported Content:", actions: "Read, Update, Export." },
      { name: "Events Manager:", actions: "Read, Update, Export." },
      { name: "Events Insights:", actions: "Read, Export." },
      { name: "Spaces Manager:", actions: "Read, Update, Export." },
      { name: "Spaces Insights:", actions: "Read, Export." },
      { name: "Ideas Manager:", actions: "Read, Update, Export." },
      { name: "Ideas Insights:", actions: "Read, Export." },
      { name: "Campuses:", actions: "Read, Update." },
      { name: "Ambassadors:", actions: "Create, Read, Delete." },
      { name: "Profile:", actions: "Read, Update + Manage." },
      { name: "Security:", actions: "Read, Update + Manage." },
      { name: "Notifications:", actions: "Read, Update + Manage." },
      { name: "Danger Zone:", actions: "Read, Update." },
      {
        name: "Role Management:",
        actions: "Create, Read, Update, Delete + Manage.",
      },
    ],
  },
  "Campus Admin": {
    title: "Campus Admin",
    description: "Full access within assigned campus",
    permissions: [
      { name: "Engagement:", actions: "Read, Export." },
      { name: "Popular Features:", actions: "Read, Export." },
      { name: "User Interactions:", actions: "Read, Export." },
      { name: "Community:", actions: "Read, Export." },
      { name: "Student Safety:", actions: "Read, Export." },
      { name: "Student Behavior:", actions: "Read, Export." },
      { name: "Active Students:", actions: "Read, Update, Export." },
      { name: "Banned Students:", actions: "Read, Update, Export." },
      { name: "Inactive Students:", actions: "Read, Update, Export." },
      { name: "Disengaged Students:", actions: "Read, Export." },
      { name: "Reported Content:", actions: "Read, Update, Export." },
      { name: "Events Manager:", actions: "Read, Update, Export." },
      { name: "Events Insights:", actions: "Read, Export." },
      { name: "Spaces Manager:", actions: "Read, Update, Export." },
      { name: "Spaces Insights:", actions: "Read, Export." },
      { name: "Ideas Manager:", actions: "Read, Update, Export." },
      { name: "Ideas Insights:", actions: "Read, Export." },
      { name: "Campuses:", actions: "Read, Update." },
      { name: "Ambassadors:", actions: "Create, Read, Delete." },
      { name: "Profile:", actions: "Read, Update + Manage." },
      { name: "Security:", actions: "Read, Update + Manage." },
      { name: "Notifications:", actions: "Read, Update + Manage." },
      { name: "Danger Zone:", actions: "Read, Update." },
      {
        name: "Role Management:",
        actions: "Create, Read, Update, Delete + Manage.",
      },
    ],
  },
  Moderator: {
    title: "Moderator",
    description: "Can read and delete resources within campus",
    permissions: [],
  },
};

const RolePermissionsModal: React.FC<RolePermissionsModalProps> = ({
  isOpen,
  onClose,
  roleType,
}) => {
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(true);

  if (!isOpen) return null;

  const roleData = rolePermissionsData[roleType];

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const togglePermissions = () => {
    setIsPermissionsOpen(!isPermissionsOpen);
  };

  return (
    <div className="role-permissions-overlay" onClick={handleOverlayClick}>
      <div className="role-permissions-content" onClick={handleContentClick}>
        <button className="role-permissions-close" onClick={onClose}>
          <AssetIcon name="x-icon" size={16} />
        </button>

        <div className="role-permissions-body">
          <h2 className="role-permissions-title">{roleData.title}</h2>

          <p className="role-permissions-description">{roleData.description}</p>

          {roleData.permissions.length > 0 && (
            <div className="role-permissions-section">
              <button
                className="role-permissions-section-header"
                onClick={togglePermissions}
              >
                <span className="role-permissions-section-title">
                  Permissions in the Admin Portal
                </span>
                <span
                  className={`role-permissions-chevron ${
                    isPermissionsOpen ? "open" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isPermissionsOpen && (
                <ul className="role-permissions-list">
                  {roleData.permissions.map((permission, index) => (
                    <li key={index} className="role-permissions-item">
                      <span className="role-permissions-item-name">
                        {permission.name}
                      </span>{" "}
                      <span className="role-permissions-item-actions">
                        {permission.actions}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="role-permissions-button-container">
            <button className="role-permissions-close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsModal;
