import React, { useState, useEffect, useRef } from "react";
import { apiClient } from "../../../API";
import { useNavigate } from "react-router-dom";
import AssetIcon from "../../../components-v2/AssetIcon/AssetIcon";
import {
  UnsavedChangesModal,
  DeleteAccountModal,
  LogoutAllDevicesModal,
} from "../../../components-v2";
import { useAuth } from "../../../hooks/useAuth";
import { useTheme } from "../../../hooks/useTheme";
import toast from "react-hot-toast";
import "./AdministratorSettings.css";

type TabType = "personal" | "security" | "notifications" | "danger";

// Extended user profile type with additional fields from API
interface UserProfile {
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  avatar_url?: string;
  position?: string;
  createdAt?: string;
  lastLogin?: string;
  emailNotifications?: boolean;
  securityAlerts?: boolean;
  twoFactorEnabled?: boolean;
}

export const AdministratorSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    string | number | null
  >(null);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Modal states
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);

  // Fetch profile data on mount only
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await apiClient.api.adminProfileList();
        const data = response.data as unknown as UserProfile;
        setProfileData(data);
        // Update form data with fetched profile
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          position: data.position || "",
          email: data.email || "",
        });
        // Update notification settings from profile
        // setNotificationData({
        //   emailNotifications: data.emailNotifications ?? false,
        //   securityAlerts: data.securityAlerts ?? false,
        // });
        // Update security settings
        setSecurityData((prev) => ({
          ...prev,
          twoFactorEnabled: data.twoFactorEnabled ?? false,
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Fall back to user from auth context
        setFormData({
          firstName: user?.first_name || "",
          lastName: user?.last_name || "",
          position: "",
          email: user?.email || "",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("AdministratorSettings component loaded", {
    user,
    profileData,
    activeTab,
  });

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
  // const [notificationData, setNotificationData] = useState({
  //   emailNotifications: false,
  //   securityAlerts: false,
  // });

  // Danger zone state
  const [deleteReason, setDeleteReason] = useState("");
  const [deletionStatus, setDeletionStatus] = useState<{
    hasPendingRequest: boolean;
    request: {
      id: string;
      status: string;
      reason: string;
      createdAt: string;
    } | null;
  } | null>(null);
  const [isLoadingDeletionStatus, setIsLoadingDeletionStatus] = useState(false);
  const [isCancellingRequest, setIsCancellingRequest] = useState(false);

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [initialFormData] = useState(formData);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, initialFormData]);

  // Fetch deletion request status
  const fetchDeletionStatus = async () => {
    try {
      setIsLoadingDeletionStatus(true);
      const response =
        await apiClient.api.adminV2SettingsDeleteAccountStatusList();
      setDeletionStatus(response.data);
    } catch (error) {
      console.error("Error fetching deletion status:", error);
    } finally {
      setIsLoadingDeletionStatus(false);
    }
  };

  useEffect(() => {
    fetchDeletionStatus();
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const response = await apiClient.api.adminProfileAvatarCreate({
        avatar: file,
      });

      // API types are incomplete - cast through unknown
      const data = (response as unknown as { data: { avatar_url?: string } })
        .data;
      const updatedAvatarUrl = data.avatar_url;

      // Update profile data with new avatar URL
      setProfileData((prev) =>
        prev ? { ...prev, avatar_url: updatedAvatarUrl } : null
      );

      // Keep auth user in sync so components (e.g., topbar) update instantly
      if (updatedAvatarUrl) {
        if (user) {
          updateUser({ ...user, avatar_url: updatedAvatarUrl });
        } else if (profileData) {
          updateUser({
            _id: profileData._id || "",
            email: profileData.email || "",
            first_name: profileData.first_name || "",
            last_name: profileData.last_name || "",
            role: profileData.role || "",
            avatar_url: updatedAvatarUrl,
          });
        }
      }

      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSecurityChange = async (
    field: keyof typeof securityData,
    value: string | boolean
  ) => {
    // Handle 2FA toggle with API call
    if (field === "twoFactorEnabled" && typeof value === "boolean") {
      const previousState = securityData.twoFactorEnabled;

      // Optimistically update UI
      setSecurityData((prev) => ({ ...prev, twoFactorEnabled: value }));

      try {
        if (value) {
          await apiClient.api.adminProfile2FaEnableCreate();
        } else {
          await apiClient.api.adminProfile2FaDisableCreate();
        }

        // Update profileData to keep in sync
        setProfileData((prev) =>
          prev ? { ...prev, twoFactorEnabled: value } : null
        );
        toast.success(
          value
            ? "Two-factor authentication enabled"
            : "Two-factor authentication disabled"
        );
      } catch (error) {
        console.error("Error updating 2FA setting:", error);
        // Revert on error
        setSecurityData((prev) => ({
          ...prev,
          twoFactorEnabled: previousState,
        }));
        toast.error("Failed to update two-factor authentication");
      }
    } else {
      setSecurityData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // const handleNotificationChange = async (
  //   field: keyof typeof notificationData,
  //   value: boolean
  // ) => {
  //   // Store previous state for potential rollback
  //   const previousState = { ...notificationData };

  //   // Optimistically update local state
  //   const newState = { ...notificationData, [field]: value };
  //   setNotificationData(newState);

  //   try {
  //     // Save to API using the new values
  //     await apiClient.api.adminProfileNotificationsUpdate({
  //       emailNotifications: newState.emailNotifications,
  //       pushNotifications: newState.securityAlerts,
  //     });

  //     // Update profileData to keep everything in sync
  //     setProfileData((prev) =>
  //       prev
  //         ? {
  //             ...prev,
  //             emailNotifications: newState.emailNotifications,
  //             securityAlerts: newState.securityAlerts,
  //           }
  //         : null
  //     );

  //     toast.success("Notification settings saved");
  //   } catch (error) {
  //     console.error("Error saving notification settings:", error);
  //     // Revert on error
  //     setNotificationData(previousState);
  //     toast.error("Failed to save notification settings");
  //   }
  // };

  // ... (imports)

  const handleSaveChanges = async () => {
    try {
      await apiClient.api.adminV2SettingsProfileUpdate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        position: formData.position,
      });
      setHasUnsavedChanges(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    try {
      await apiClient.api.adminV2SettingsPasswordUpdate({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });
      toast.success("Password updated successfully");
      setSecurityData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to update password");
    }
  };

  // const handleLogoutAllDevices = () => {
  //   setShowLogoutAllModal(true);
  // };

  const handleConfirmLogoutAll = async () => {
    try {
      const response = await apiClient.api.adminV2SettingsLogoutAllCreate();

      // Update tokens for current session to stay logged in
      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      setShowLogoutAllModal(false);
      toast.success("Logged out from all other devices");
    } catch (error) {
      console.error("Error logging out all devices:", error);
      toast.error("Failed to logout all devices");
    }
  };

  const handleSubmitDeleteRequest = () => {
    setShowDeleteAccountModal(true);
  };

  const handleConfirmDeleteAccount = async () => {
    try {
      await apiClient.api.adminV2SettingsDeleteAccountCreate({
        reason: deleteReason,
      });
      setShowDeleteAccountModal(false);
      setDeleteReason("");
      toast.success("Account deletion requested");
      // Refresh deletion status
      fetchDeletionStatus();
    } catch (error: any) {
      console.error("Error requesting account deletion:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to request account deletion";
      toast.error(errorMessage);
    }
  };

  const handleCancelDeletionRequest = async () => {
    try {
      setIsCancellingRequest(true);
      await apiClient.api.adminV2SettingsDeleteAccountCancelCreate({});
      toast.success("Deletion request cancelled");
      // Refresh deletion status
      fetchDeletionStatus();
    } catch (error) {
      console.error("Error cancelling deletion request:", error);
      toast.error("Failed to cancel deletion request");
    } finally {
      setIsCancellingRequest(false);
    }
  };

  const handleBackToPanel = () => {
    // Modal disabled - always navigate without confirmation
    navigate(-1);
  };

  const handleLeaveWithoutSaving = () => {
    setShowUnsavedModal(false);
    setHasUnsavedChanges(false);
    if (pendingNavigation) {
      if (pendingNavigation === "/logout") {
        window.location.href = "/logout";
      } else if (typeof pendingNavigation === "number") {
        navigate(pendingNavigation);
      } else {
        navigate(pendingNavigation);
      }
      setPendingNavigation(null);
    }
  };

  // Use profileData for dates if available, fall back to user
  const accountCreatedDate = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString()
    : "N/A";
  const lastLoginDate = profileData?.lastLogin
    ? new Date(profileData.lastLogin).toLocaleString()
    : "N/A";

  // Get role display name
  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case "super_admin":
        return "Walky Admin";
      case "school_admin":
        return "School Admin";
      case "campus_admin":
        return "Campus Admin";
      case "moderator":
        return "Moderator";
      default:
        return role || "Admin";
    }
  };
  const roleDisplayName = getRoleDisplayName(profileData?.role || user?.role);

  console.log("Rendering AdministratorSettings", {
    activeTab,
    hasUnsavedChanges,
  });

  return (
    <main
      className={`administrator-settings-page ${
        theme.isDark ? "dark-mode" : ""
      }`}
    >
      {/* Header */}
      <div className="settings-header">
        <div className="settings-header-content">
          <button
            className="settings-back-btn"
            onClick={handleBackToPanel}
            data-testid="settings-back-btn"
            aria-label="Back to admin panel"
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
        {/* Notification Preferences Tab - Hidden */}
        {/* <button
          data-testid="tab-notifications"
          className={`settings-tab ${
            activeTab === "notifications" ? "active" : ""
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notification Preferences
        </button> */}
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
                <span className="info-value">{roleDisplayName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account created:</span>
                <span className="info-value">
                  {isLoadingProfile ? "Loading..." : accountCreatedDate}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Last login:</span>
                <span className="info-value">
                  {isLoadingProfile ? "Loading..." : lastLoginDate}
                </span>
              </div>
            </div>

            <div className="content-divider" />

            {/* Form */}
            <div className="settings-form">
              {/* Profile Picture */}
              <div className="profile-picture-container">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  style={{ display: "none" }}
                  data-testid="avatar-file-input"
                />
                <div
                  className={`profile-picture ${
                    isUploadingAvatar ? "uploading" : ""
                  }`}
                >
                  <img
                    src={
                      profileData?.avatar_url ||
                      user?.avatar_url ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(
                          (profileData?.first_name || user?.first_name || "") +
                            " " +
                            (profileData?.last_name || user?.last_name || "")
                        ) +
                        "&background=546fd9&color=fff"
                    }
                    alt="Profile"
                  />
                  {isUploadingAvatar && (
                    <div className="avatar-upload-overlay">
                      <div className="avatar-spinner"></div>
                    </div>
                  )}
                  <button
                    className={`profile-picture-edit ${
                      isUploadingAvatar ? "uploading" : ""
                    }`}
                    data-testid="profile-picture-edit-btn"
                    aria-label="Edit profile picture"
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? (
                      <div className="avatar-button-spinner"></div>
                    ) : (
                      <AssetIcon
                        name="camera-icon"
                        size={22}
                        className="profile-picture-edit-icon"
                        aria-hidden="true"
                      />
                    )}
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

            {/* Two-Factor Authentication - Hidden */}
            {/* <div className="security-option">
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
            </div> */}

            {/* Logout All Devices - Hidden */}
            {/* <div className="security-option danger">
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
            </div> */}
          </div>
        )}

        {/* Notification Preferences Content - Hidden */}
        {/* {activeTab === "notifications" && (
          <div className="settings-content">
            <h2 className="content-section-title">Notification preferences</h2>
            <div className="content-divider" />

            {/* Email Notifications */}
        {/* <div className="security-option">
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
            </div> */}

        {/* Security Alerts */}
        {/* <div className="security-option">
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
        )} */}

        {activeTab === "danger" && (
          <div className="settings-content">
            <h2 className="content-section-title">Danger zone</h2>
            <div className="content-divider" />

            {/* Delete Account Section */}
            <div className="danger-zone-section">
              <h3 className="danger-title">Request to delete account</h3>

              {isLoadingDeletionStatus ? (
                <p className="danger-description">Loading...</p>
              ) : deletionStatus?.hasPendingRequest && deletionStatus.request ? (
                <>
                  <div className="pending-request-notice">
                    <div className="pending-request-header">
                      <span className="pending-request-badge">
                        Request Pending
                      </span>
                      <span className="pending-request-date">
                        Submitted on{" "}
                        {new Date(
                          deletionStatus.request.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="pending-request-message">
                      Your account deletion request has been submitted and is
                      awaiting review by a Walky Admin.
                    </p>
                    {deletionStatus.request.reason && (
                      <p className="pending-request-reason">
                        <strong>Reason:</strong> {deletionStatus.request.reason}
                      </p>
                    )}
                  </div>

                  <div className="danger-alert">
                    <p>
                      You can cancel this request if you've changed your mind.
                      Once approved by an admin, the deletion cannot be undone.
                    </p>
                  </div>

                  <button
                    className="cancel-delete-btn"
                    onClick={handleCancelDeletionRequest}
                    disabled={isCancellingRequest}
                    data-testid="cancel-delete-btn"
                  >
                    {isCancellingRequest
                      ? "Cancelling..."
                      : "Cancel deletion request"}
                  </button>
                </>
              ) : (
                <>
                  <p className="danger-description">
                    You're about to request the deletion of your account. Once
                    submitted, this request will be reviewed by a Walky Admin
                    before your account is permanently removed.
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
                </>
              )}
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
    </main>
  );
};
