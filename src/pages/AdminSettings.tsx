/**
 * Administrator Settings Page
 * Purpose: Manage admin account settings, security, and preferences
 */

import { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CFormLabel,
  CFormSwitch,
  CRow,
  CCol,
  CSpinner,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilUser,
  cilLockLocked,
  cilBell,
  cilTrash,
  cilCheckCircle,
  cilWarning,
  cilShieldAlt,
  cilSettings,
} from "@coreui/icons";
// import { useTheme } from '../hooks/useTheme' // Not currently used
import { apiClient } from '../API'

interface AdminProfile {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  school: {
    _id: string;
    name: string;
  };
  campuses: Array<{
    _id: string;
    name: string;
  }>;
  createdAt: Date;
  lastLogin?: Date;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  securityAlerts: boolean;
}

type ActiveTab = "profile" | "security" | "notifications" | "danger";

const AdminSettings = () => {
  // Theme is available via useTheme() if needed for styling

  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Profile fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Security fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // Modals
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await apiClient.api.adminProfileList() as any
      const profileData = response.data

      setProfile(profileData)
      setFirstName(profileData.first_name)
      setLastName(profileData.last_name)
      setEmail(profileData.email)
      setTwoFactorEnabled(profileData.twoFactorEnabled)
      setEmailNotifications(profileData.emailNotifications)
      setSecurityAlerts(profileData.securityAlerts)
    } catch (error) {
      console.error("Failed to fetch profile:", error);

      // Mock data for development
      const mockProfile: AdminProfile = {
        _id: "admin-1",
        first_name: "Admin",
        last_name: "User",
        email: "admin@university.edu",
        role: "admin",
        school: {
          _id: "school-1",
          name: "University of Example",
        },
        campuses: [
          { _id: "campus-1", name: "Main Campus" },
          { _id: "campus-2", name: "North Campus" },
        ],
        createdAt: new Date("2024-01-01"),
        lastLogin: new Date(),
        twoFactorEnabled: false,
        emailNotifications: true,
        securityAlerts: true,
      };

      setProfile(mockProfile);
      setFirstName(mockProfile.first_name);
      setLastName(mockProfile.last_name);
      setEmail(mockProfile.email);
      setTwoFactorEnabled(mockProfile.twoFactorEnabled);
      setEmailNotifications(mockProfile.emailNotifications);
      setSecurityAlerts(mockProfile.securityAlerts);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await apiClient.api.adminProfileUpdate({
        first_name: firstName,
        last_name: lastName,
        email,
      });

      setSuccessMessage("Profile updated successfully");
      await fetchProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await apiClient.api.adminProfileChangePasswordCreate({
        currentPassword,
        newPassword,
      });

      setSuccessMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);
      setErrorMessage(
        "Failed to change password. Please check your current password."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      if (!twoFactorEnabled) {
        // Enable 2FA
        await apiClient.api.adminProfile2FaEnableCreate()
        setTwoFactorEnabled(true)
        setSuccessMessage('Two-factor authentication enabled')
      } else {
        // Disable 2FA
        await apiClient.api.adminProfile2FaDisableCreate()
        setTwoFactorEnabled(false)
        setSuccessMessage('Two-factor authentication disabled')
      }
    } catch (error) {
      console.error("Failed to toggle 2FA:", error);
      setErrorMessage("Failed to update two-factor authentication");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateNotifications = async () => {
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await apiClient.api.adminProfileNotificationsUpdate({
        emailNotifications,
        securityAlerts,
      } as any)

      setSuccessMessage("Notification settings updated");
    } catch (error) {
      console.error("Failed to update notifications:", error);
      setErrorMessage("Failed to update notification settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    setSaving(true);
    try {
      await apiClient.api.adminProfileLogoutAllCreate()
      setSuccessMessage('Logged out of all devices successfully')
      setShowLogoutAllModal(false)
    } catch (error) {
      console.error("Failed to logout all devices:", error);
      setErrorMessage("Failed to logout all devices");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      setErrorMessage("Please type DELETE to confirm");
      return;
    }

    setSaving(true);
    try {
      await apiClient.api.adminProfileDeleteDelete({ password: "" })
      // Redirect to login or home page after deletion
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to delete account:", error);
      setErrorMessage("Failed to delete account");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <div className="text-center py-5">
          <CSpinner color="primary" />
          <p className="mt-3">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div className="mb-4">
        <h2 style={{ fontWeight: "700", marginBottom: "0.5rem" }}>
          <CIcon icon={cilSettings} className="me-2" />
          Administrator Settings
        </h2>
        <p style={{ color: "#6B7280", marginBottom: 0 }}>
          Manage your account settings, security, and preferences
        </p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <CAlert
          color="success"
          dismissible
          onClose={() => setSuccessMessage(null)}
        >
          <CIcon icon={cilCheckCircle} className="me-2" />
          {successMessage}
        </CAlert>
      )}
      {errorMessage && (
        <CAlert
          color="danger"
          dismissible
          onClose={() => setErrorMessage(null)}
        >
          <CIcon icon={cilWarning} className="me-2" />
          {errorMessage}
        </CAlert>
      )}

      {/* Settings Tabs */}
      <CCard>
        <CCardHeader style={{ padding: 0 }}>
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
                style={{ cursor: "pointer" }}
              >
                <CIcon icon={cilUser} className="me-2" />
                Profile
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === "security"}
                onClick={() => setActiveTab("security")}
                style={{ cursor: "pointer" }}
              >
                <CIcon icon={cilLockLocked} className="me-2" />
                Security
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === "notifications"}
                onClick={() => setActiveTab("notifications")}
                style={{ cursor: "pointer" }}
              >
                <CIcon icon={cilBell} className="me-2" />
                Notifications
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === "danger"}
                onClick={() => setActiveTab("danger")}
                style={{ cursor: "pointer", color: "#FF3B30" }}
              >
                <CIcon icon={cilWarning} className="me-2" />
                Danger Zone
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>

        <CCardBody>
          <CTabContent>
            {/* Profile Tab */}
            <CTabPane visible={activeTab === "profile"}>
              <h5 className="mb-4" style={{ fontWeight: "600" }}>
                Personal Information
              </h5>

              {/* Account Info Display */}
              <CRow className="mb-4">
                <CCol xs={12}>
                  <div className="mb-3">
                    <strong>School:</strong> {profile?.school.name}
                  </div>
                  <div className="mb-3">
                    <strong>Role:</strong>{" "}
                    <CBadge color="primary">
                      {profile?.role.toUpperCase()}
                    </CBadge>
                  </div>
                  <div className="mb-3">
                    <strong>Campuses:</strong>{" "}
                    {profile?.campuses.map((campus) => (
                      <CBadge key={campus._id} color="info" className="me-2">
                        {campus.name}
                      </CBadge>
                    ))}
                  </div>
                  <div className="mb-3">
                    <strong>Account Created:</strong>{" "}
                    {profile?.createdAt &&
                      new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                  <div className="mb-3">
                    <strong>Last Login:</strong>{" "}
                    {profile?.lastLogin
                      ? new Date(profile.lastLogin).toLocaleString()
                      : "Never"}
                  </div>
                </CCol>
              </CRow>

              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel>First Name</CFormLabel>
                  <CFormInput
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Last Name</CFormLabel>
                  <CFormInput
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </CCol>
                <CCol xs={12}>
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@university.edu"
                  />
                </CCol>
              </CRow>

              <div className="mt-4">
                <CButton
                  color="primary"
                  onClick={handleUpdateProfile}
                  disabled={saving}
                >
                  {saving ? <CSpinner size="sm" className="me-2" /> : null}
                  Save Changes
                </CButton>
              </div>
            </CTabPane>

            {/* Security Tab */}
            <CTabPane visible={activeTab === "security"}>
              <h5 className="mb-4" style={{ fontWeight: "600" }}>
                Security Settings
              </h5>

              {/* Change Password */}
              <div className="mb-5">
                <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
                  Change Password
                </h6>
                <CRow className="g-3">
                  <CCol xs={12}>
                    <CFormLabel>Current Password</CFormLabel>
                    <CFormInput
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>New Password</CFormLabel>
                    <CFormInput
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Confirm New Password</CFormLabel>
                    <CFormInput
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </CCol>
                </CRow>
                <div className="mt-3">
                  <CButton
                    color="primary"
                    onClick={handleChangePassword}
                    disabled={saving}
                  >
                    {saving ? <CSpinner size="sm" className="me-2" /> : null}
                    Change Password
                  </CButton>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="mb-5">
                <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
                  Two-Factor Authentication
                </h6>
                <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                  <div>
                    <div style={{ fontWeight: "500" }}>
                      <CIcon icon={cilShieldAlt} className="me-2" />
                      Two-Factor Authentication
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#6B7280",
                        marginTop: "4px",
                      }}
                    >
                      Add an extra layer of security to your account
                    </div>
                  </div>
                  <CFormSwitch
                    checked={twoFactorEnabled}
                    onChange={handleToggle2FA}
                    disabled={saving}
                    size="lg"
                  />
                </div>
              </div>

              {/* Logout All Devices */}
              <div>
                <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
                  Active Sessions
                </h6>
                <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                  <div>
                    <div style={{ fontWeight: "500" }}>Logout All Devices</div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#6B7280",
                        marginTop: "4px",
                      }}
                    >
                      Log out of all devices except this one
                    </div>
                  </div>
                  <CButton
                    color="danger"
                    variant="outline"
                    onClick={() => setShowLogoutAllModal(true)}
                  >
                    Logout All
                  </CButton>
                </div>
              </div>
            </CTabPane>

            {/* Notifications Tab */}
            <CTabPane visible={activeTab === "notifications"}>
              <h5 className="mb-4" style={{ fontWeight: "600" }}>
                Notification Preferences
              </h5>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center p-3 border rounded mb-3">
                  <div>
                    <div style={{ fontWeight: "500" }}>Email Notifications</div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#6B7280",
                        marginTop: "4px",
                      }}
                    >
                      Receive email updates about important events and
                      activities
                    </div>
                  </div>
                  <CFormSwitch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    size="lg"
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                  <div>
                    <div style={{ fontWeight: "500" }}>Security Alerts</div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#6B7280",
                        marginTop: "4px",
                      }}
                    >
                      Get notified about security issues and account activity
                    </div>
                  </div>
                  <CFormSwitch
                    checked={securityAlerts}
                    onChange={(e) => setSecurityAlerts(e.target.checked)}
                    size="lg"
                  />
                </div>
              </div>

              <div className="mt-4">
                <CButton
                  color="primary"
                  onClick={handleUpdateNotifications}
                  disabled={saving}
                >
                  {saving ? <CSpinner size="sm" className="me-2" /> : null}
                  Save Preferences
                </CButton>
              </div>
            </CTabPane>

            {/* Danger Zone Tab */}
            <CTabPane visible={activeTab === "danger"}>
              <h5
                className="mb-4"
                style={{ fontWeight: "600", color: "#FF3B30" }}
              >
                Danger Zone
              </h5>

              <CAlert color="danger">
                <strong>Warning:</strong> These actions are irreversible. Please
                proceed with caution.
              </CAlert>

              <div className="d-flex justify-content-between align-items-center p-4 border border-danger rounded">
                <div>
                  <div style={{ fontWeight: "600", color: "#FF3B30" }}>
                    <CIcon icon={cilTrash} className="me-2" />
                    Delete Account
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#6B7280",
                      marginTop: "4px",
                    }}
                  >
                    Permanently delete your administrator account and all
                    associated data
                  </div>
                </div>
                <CButton
                  color="danger"
                  onClick={() => setShowDeleteAccountModal(true)}
                >
                  Delete Account
                </CButton>
              </div>
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Logout All Devices Modal */}
      <CModal
        visible={showLogoutAllModal}
        onClose={() => setShowLogoutAllModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Logout All Devices</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            Are you sure you want to logout of all devices? You will remain
            logged in on this device, but all other active sessions will be
            terminated.
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowLogoutAllModal(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={handleLogoutAllDevices}
            disabled={saving}
          >
            {saving ? <CSpinner size="sm" className="me-2" /> : null}
            Logout All Devices
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Account Modal */}
      <CModal
        visible={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
      >
        <CModalHeader>
          <CModalTitle style={{ color: "#FF3B30" }}>Delete Account</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="danger">
            <strong>This action cannot be undone!</strong>
          </CAlert>
          <p>
            Deleting your account will permanently remove all your data and
            revoke your administrator access. This action is irreversible.
          </p>
          <p>
            Please type <strong>DELETE</strong> to confirm:
          </p>
          <CFormInput
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type DELETE"
          />
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowDeleteAccountModal(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={handleDeleteAccount}
            disabled={saving || deleteConfirmation !== "DELETE"}
          >
            {saving ? <CSpinner size="sm" className="me-2" /> : null}
            Delete Account
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AdminSettings;
