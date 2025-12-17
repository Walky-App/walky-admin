import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CModal, CModalBody } from "@coreui/react";
import AssetIcon from "../../components-v2/AssetIcon/AssetIcon";
import AssetImage from "../../components-v2/AssetImage/AssetImage";
import "./LoginV2.css";

import { apiClient } from "../../API";

const LoginV2: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.api.loginCreate({
        email,
        password,
      });

      const responseData = response.data;
      const token = responseData.access_token;
      const userData = responseData;

      if (!token) {
        throw new Error("Token not found in response.");
      }

      // Validate user role - only allow admin roles
      const adminRoles = [
        "super_admin",
        "walky_internal",
        "school_admin",
        "campus_admin",
        "editor",
        "moderator",
        "staff",
        "viewer",
      ];
      const userRole = userData?.role;

      if (!userRole || !adminRoles.includes(userRole)) {
        setError("Access denied: You are not authorized for the admin panel.");
        return;
      }

      // Store token and user data in localStorage
      // Extract IDs from potentially populated objects
      const schoolId = typeof userData.school_id === 'object' && userData.school_id !== null
        ? (userData.school_id as any)._id || (userData.school_id as any).id
        : userData.school_id;
      const campusId = typeof userData.campus_id === 'object' && userData.campus_id !== null
        ? (userData.campus_id as any)._id || (userData.campus_id as any).id
        : userData.campus_id;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: userData._id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          avatar_url: userData.avatar_url,
          campus_id: campusId,
          school_id: schoolId,
          require_password_change: !!responseData.require_password_change,
        })
      );

      // Check if password change is required
      if (responseData.require_password_change) {
        window.location.href = "/force-password-change";
        return;
      }

      // Reload to update auth state (since useAuth reads from localStorage on mount)
      window.location.href = "/";
    } catch (err: any) {
      console.error("Login failed:", err);

      // Check if user is deactivated
      if (err?.response?.data?.code === "USER_DEACTIVATED") {
        setShowDeactivatedModal(true);
        return;
      }

      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/recover-password");
  };

  return (
    <main
      className="login-v2"
      data-testid="login-v2-page"
      aria-label="Login page"
    >
      <div className="login-container">
        <div className="login-form-wrapper">
          <div className="login-logo" role="img" aria-label="Walky Logo">
            <AssetIcon name="logo-walky-white" />
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
            data-testid="login-form"
            aria-label="Login form"
          >
            {error && (
              <div className="error-message" style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>
                {error}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="email-input"
                aria-label="Email address"
                aria-required="true"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="password-input"
                aria-label="Password"
                aria-required="true"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="forgot-password-link"
                onClick={handleForgotPassword}
                data-testid="forgot-password-button"
                aria-label="Forgot password"
              >
                Forgot Password
              </button>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
              data-testid="submit-button"
              aria-label="Sign in"
              aria-busy={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      <div className="login-decoration" role="presentation" aria-hidden="true">
        <AssetImage
          name="login-placeholder"
          alt="Decorative illustration for login page"
          className="decoration-image"
          data-testid="login-decoration-image"
        />
      </div>

      {/* Deactivated User Modal */}
      <CModal
        visible={showDeactivatedModal}
        onClose={() => setShowDeactivatedModal(false)}
        alignment="center"
        className="deactivated-user-modal"
        data-testid="deactivated-user-modal"
      >
        <CModalBody className="deactivated-modal-body">
          <div className="deactivated-modal-content">
            <div className="deactivated-modal-icon">
              <AssetIcon name="tooltip-icon" size={48} color="#dc3545" />
            </div>
            <h2 className="deactivated-modal-title">Account Deactivated</h2>
            <p className="deactivated-modal-message">
              Your account has been deactivated. Please contact Walky admin for assistance.
            </p>
            <a
              href="mailto:support@walkyapp.com"
              className="deactivated-modal-contact-link"
            >
              support@walkyapp.com
            </a>
            <button
              data-testid="deactivated-modal-close-btn"
              className="deactivated-modal-close-btn"
              onClick={() => setShowDeactivatedModal(false)}
            >
              Close
            </button>
          </div>
        </CModalBody>
      </CModal>
    </main>
  );
};

export default LoginV2;
