import React from "react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./DeactivatedUserModal.css";

interface DeactivatedUserModalProps {
  isOpen: boolean;
  onLogout: () => void;
}

const DeactivatedUserModal: React.FC<DeactivatedUserModalProps> = ({
  isOpen,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="deactivated-user-overlay">
      <div className="deactivated-user-modal">
        <div className="deactivated-user-icon">
          <AssetIcon name="lock-icon" size={64} />
        </div>

        <h2 className="deactivated-user-title">Account Deactivated</h2>

        <p className="deactivated-user-message">
          Your account has been deactivated by an administrator. You no longer have access to the admin panel.
        </p>

        <p className="deactivated-user-submessage">
          If you believe this is a mistake, please contact your system administrator.
        </p>

        <button
          className="deactivated-user-logout-btn"
          onClick={onLogout}
          data-testid="deactivated-logout-btn"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default DeactivatedUserModal;
