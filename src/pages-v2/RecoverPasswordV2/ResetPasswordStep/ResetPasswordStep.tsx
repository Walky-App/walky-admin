import React, { useState } from "react";
import { AssetIcon } from "../../../components-v2";

interface ResetPasswordStepProps {
  onReset: (password: string) => Promise<void> | void;
  apiError?: string;
  apiErrors?: string[];
}

const ResetPasswordStep: React.FC<ResetPasswordStepProps> = ({
  onReset,
  apiError,
  apiErrors,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Combine client-side and API errors for display
  const displayError = error || apiError;
  const displayErrors = apiErrors || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      await onReset(newPassword);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="reset-password-step"
      role="region"
      aria-label="Reset password form"
    >
      <div className="recover-content">
        <div className="recover-logo" role="img" aria-label="Walky Logo">
          <AssetIcon
            name="logo-walky-white"
            className="logo-icon"
            style={{ width: "217px", height: "auto" }}
          />
        </div>

        <h1 className="recover-title">Reset Your Password</h1>

        <form
          className="recover-form"
          onSubmit={handleSubmit}
          data-testid="reset-password-form"
          aria-label="Reset password form"
        >
          {(displayError || displayErrors.length > 0) && (
            <div
              className="error-message"
              role="alert"
              aria-live="polite"
              data-testid="reset-password-error"
              style={{
                backgroundColor: "rgba(255, 107, 107, 0.1)",
                border: "1px solid rgba(255, 107, 107, 0.3)",
                borderRadius: "12px",
                padding: "16px 20px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: displayErrors.length > 0 ? "12px" : 0,
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    lineHeight: 1,
                  }}
                >
                  ⚠️
                </span>
                <span
                  style={{
                    color: "#dc3545",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {displayError || "Please fix the following issues:"}
                </span>
              </div>
              {displayErrors.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    paddingLeft: "28px",
                  }}
                >
                  {displayErrors.map((err, index) => (
                    <div
                      key={index}
                      style={{
                        color: "#666",
                        fontSize: "13px",
                        lineHeight: "1.4",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          color: "#dc3545",
                          fontSize: "8px",
                          marginTop: "5px",
                        }}
                      >
                        ●
                      </span>
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              className="form-input"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              data-testid="new-password-input"
              aria-label="New password"
              aria-required="true"
              aria-describedby={error ? "reset-password-error" : undefined}
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              data-testid="confirm-password-input"
              aria-label="Confirm password"
              aria-required="true"
              aria-describedby={error ? "reset-password-error" : undefined}
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
            data-testid="reset-password-submit-button"
            aria-label="Reset password"
            aria-busy={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordStep;
