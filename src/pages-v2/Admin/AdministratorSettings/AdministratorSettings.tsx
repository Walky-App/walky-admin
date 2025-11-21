import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AssetIcon from "../../../components-v2/AssetIcon/AssetIcon";
import {
  UnsavedChangesModal,
  DeleteAccountModal,
  LogoutAllDevicesModal,
} from "../../../components-v2";
import { useAuth } from "../../../hooks/useAuth";
import "./AdministratorSettings.css";

type TabType = "personal" | "security" | "notifications" | "danger";

export const AdministratorSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  // Modal states
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);

  console.log("AdministratorSettings component loaded", { user, activeTab });

  // Form state - Personal Info
  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    position: "",
    email: user?.email || "",
  });

  // Security settings state
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  // Notification settings state
  const [notificationData, setNotificationData] = useState({
    emailNotifications: false,
    securityAlerts: false,
  });

  // Danger zone state
  const [deleteReason, setDeleteReason] = useState("");

  const [initialFormData] = useState(formData);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, initialFormData]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (
    field: keyof typeof securityData,
    value: string | boolean
  ) => {
    setSecurityData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (
    field: keyof typeof notificationData,
    value: boolean
  ) => {
    setNotificationData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    console.log("Save changes:", formData);
    // TODO: API call to save changes
    setHasUnsavedChanges(false);
  };

  const handleChangePassword = () => {
    console.log("Change password:", securityData);
    // TODO: API call to change password
    // Show toast after success
  };

  const handleLogoutAllDevices = () => {
    setShowLogoutAllModal(true);
  };

  const handleConfirmLogoutAll = () => {
    console.log("Logout all devices");
    // TODO: API call to logout all devices
    setShowLogoutAllModal(false);
    // Show toast after success
  };

  const handleSubmitDeleteRequest = () => {
    setShowDeleteAccountModal(true);
  };

  const handleConfirmDeleteAccount = () => {
    console.log("Delete account request:", deleteReason);
    // TODO: API call to submit deletion request
    setShowDeleteAccountModal(false);
    // Show toast after success
  };

  const handleBackToPanel = () => {
    if (hasUnsavedChanges) {
      setPendingNavigation("/");
      setShowUnsavedModal(true);
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    if (hasUnsavedChanges) {
      setPendingNavigation("/logout");
      setShowUnsavedModal(true);
    } else {
      window.location.href = "/logout";
    }
  };

  const handleLeaveWithoutSaving = () => {
    setShowUnsavedModal(false);
    setHasUnsavedChanges(false);
    if (pendingNavigation) {
      if (pendingNavigation === "/logout") {
        window.location.href = "/logout";
      } else {
        navigate(pendingNavigation);
      }
      setPendingNavigation(null);
    }
  };

  const accountCreatedDate = "20/5/2025"; // TODO: Get from user data
  const lastLoginDate = "20/10/2025 | 21:00:03"; // TODO: Get from user data

  console.log("Rendering AdministratorSettings", {
    activeTab,
    hasUnsavedChanges,
  });

  return (
    <div className="administrator-settings-page">
      {/* Header */}
      <div className="settings-header">
        <div className="settings-header-content">
          <button
            className="settings-back-btn"
            onClick={handleBackToPanel}
            data-testid="settings-back-btn"
          >
            <AssetIcon name="arrow-down" size={32} />
          </button>
          <div className="settings-header-text">
            <h1 className="settings-title">Administrator Settings</h1>
            <p className="settings-subtitle">
              Manage your account settings, security, and preferences
            </p>
          </div>
        </div>

        {/* Sidebar Menu */}
        <div className="settings-sidebar-menu">
          <button
            className="sidebar-menu-item"
            onClick={handleBackToPanel}
            data-testid="sidebar-back-btn"
          >
            <span>Back to Admin panel</span>
            <AssetIcon name="arrow-down" size={24} />
          </button>
          <div className="sidebar-divider" />
          <button
            className="sidebar-menu-item logout"
            onClick={handleLogout}
            data-testid="sidebar-logout-btn"
          >
            <span>Logout</span>
            <AssetIcon name="lock-icon" size={24} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        <button
          data-testid="tab-personal"
          className={`settings-tab ${activeTab === "personal" ? "active" : ""}`}
          onClick={() => setActiveTab("personal")}
        >
          Personal Information
        </button>
        <button
          data-testid="tab-security"
          className={`settings-tab ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          Security Settings
        </button>
        <button
          data-testid="tab-notifications"
          className={`settings-tab ${
            activeTab === "notifications" ? "active" : ""
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notification Preferences
        </button>
        <button
          data-testid="tab-danger"
          className={`settings-tab ${activeTab === "danger" ? "active" : ""}`}
          onClick={() => setActiveTab("danger")}
        >
          Danger Zone
        </button>
      </div>

      {/* Content Container */}
      <div className="settings-content-container">
        {activeTab === "personal" && (
          <div className="settings-content">
            <h2 className="content-section-title">Personal information</h2>
            <div className="content-divider" />

            {/* Account Info */}
            <div className="account-info">
              <div className="info-row">
                <span className="info-label">Role:</span>
                <span className="info-value">Walky Admin</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account created:</span>
                <span className="info-value">{accountCreatedDate}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Last login:</span>
                <span className="info-value">{lastLoginDate}</span>
              </div>
            </div>

            <div className="content-divider" />

            {/* Form */}
            <div className="settings-form">
              {/* Profile Picture */}
              <div className="profile-picture-container">
                <div className="profile-picture">
                  <img
                    src={
                      user?.avatar_url ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(
                          user?.first_name + " " + user?.last_name
                        ) +
                        "&background=546fd9&color=fff"
                    }
                    alt="Profile"
                  />
                  <button
                    className="profile-picture-edit"
                    data-testid="profile-picture-edit-btn"
                  >
                    <AssetIcon name="copy-icon" size={24} />
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="form-row">
                <div className="form-field disabled">
                  <label>First name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    data-testid="input-firstname"
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    disabled
                  />
                </div>
                <div className="form-field disabled">
                  <label>Last name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    data-testid="input-lastname"
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    disabled
                  />
                </div>
              </div>

              {/* Position Field */}
              <div className="form-field">
                <label>Position</label>
                <input
                  type="text"
                  value={formData.position}
                  data-testid="input-position"
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                  placeholder="CPO"
                />
              </div>

              {/* Email Field */}
              <div className="form-field disabled">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  data-testid="input-email"
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled
                />
              </div>

              {/* Save Button */}
              <button
                className="save-changes-btn"
                onClick={handleSaveChanges}
                disabled={!hasUnsavedChanges}
                data-testid="save-changes-btn"
              >
                Save changes
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="settings-content">
            <h2 className="content-section-title">Security settings</h2>
            <div className="content-divider" />

            {/* Change Password Section */}
            <div className="security-section">
              <h3 className="section-subtitle">Change password</h3>

              <div className="password-fields">
                <div className="form-field">
                  <label>Current password</label>
                  <div className="password-input-wrapper">
                    <input
                      type="password"
                      value={securityData.currentPassword}
                      data-testid="input-current-password"
                      onChange={(e) =>
                        handleSecurityChange("currentPassword", e.target.value)
                      }
                      placeholder="Current password"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>New password</label>
                    <div className="password-input-wrapper">
                      <input
                        type="password"
                        value={securityData.newPassword}
                        data-testid="input-new-password"
                        onChange={(e) =>
                          handleSecurityChange("newPassword", e.target.value)
                        }
                        placeholder="New password"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Confirm new password</label>
                    <div className="password-input-wrapper">
                      <input
                        type="password"
                        value={securityData.confirmPassword}
                        data-testid="input-confirm-password"
                        onChange={(e) =>
                          handleSecurityChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="change-password-btn"
                  onClick={handleChangePassword}
                  data-testid="change-password-btn"
                >
                  Change password
                </button>
              </div>
            </div>

            <div className="content-divider" />

            {/* Two-Factor Authentication */}
            <div className="security-option">
              <div className="option-header">
                <h3 className="option-title">Two-factor authentication</h3>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={securityData.twoFactorEnabled}
                    data-testid="toggle-two-factor"
                    onChange={(e) =>
                      handleSecurityChange("twoFactorEnabled", e.target.checked)
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <p className="option-description">
                Add an extra layer of security to your account
              </p>
            </div>

            {/* Logout All Devices */}
            <div className="security-option danger">
              <div className="option-header">
                <h3 className="option-title">Logout all devices</h3>
                <button
                  className="logout-all-btn"
                  onClick={handleLogoutAllDevices}
                  data-testid="logout-all-btn"
                >
                  Logout all
                </button>
              </div>
              <p className="option-description">
                Log out of all devices except this one
              </p>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="settings-content">
            <h2 className="content-section-title">Notification preferences</h2>
            <div className="content-divider" />

            {/* Email Notifications */}
            <div className="security-option">
              <div className="option-header">
                <h3 className="option-title">Email notifications</h3>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notificationData.emailNotifications}
                    data-testid="toggle-email-notifications"
                    onChange={(e) =>
                      handleNotificationChange(
                        "emailNotifications",
                        e.target.checked
                      )
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <p className="option-description">
                Receive email about important updates
              </p>
            </div>

            {/* Security Alerts */}
            <div className="security-option">
              <div className="option-header">
                <h3 className="option-title">Security alerts</h3>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notificationData.securityAlerts}
                    data-testid="toggle-security-alerts"
                    onChange={(e) =>
                      handleNotificationChange(
                        "securityAlerts",
                        e.target.checked
                      )
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <p className="option-description">
                Get notified about security issues and account activity
              </p>
            </div>
          </div>
        )}

        {activeTab === "danger" && (
          <div className="settings-content">
            <h2 className="content-section-title">Danger zone</h2>
            <div className="content-divider" />

            {/* Delete Account Section */}
            <div className="danger-zone-section">
              <h3 className="danger-title">Request to delete account</h3>
              <p className="danger-description">
                You're about to request the deletion of your account. Once
                submitted, this request will be reviewed by a Walky Admin before
                your account is permanently removed.
              </p>

              <div className="form-field">
                <label>Reason for account deletion (optional)</label>
                <textarea
                  className="delete-reason-textarea"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Write a explanation"
                  rows={4}
                />
              </div>

              <div className="danger-alert">
                <p>
                  Deleting your account will remove your access to all admin
                  tools and data. This action can't be undone once approved.
                </p>
              </div>

              <button
                className="submit-delete-btn"
                onClick={handleSubmitDeleteRequest}
                data-testid="submit-delete-btn"
              >
                Submit request
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => {
          setShowUnsavedModal(false);
          setPendingNavigation(null);
        }}
        onLeave={handleLeaveWithoutSaving}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        onConfirm={handleConfirmDeleteAccount}
      />

      {/* Logout All Devices Modal */}
      <LogoutAllDevicesModal
        isOpen={showLogoutAllModal}
        onClose={() => setShowLogoutAllModal(false)}
        onConfirm={handleConfirmLogoutAll}
      />
    </div>
  );
};
