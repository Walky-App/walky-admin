import React, { useState } from "react";
import { AssetIcon } from "../../../components-v2";
import { useMixpanel } from "../../../hooks/useMixpanel";

interface ResetPasswordStepProps {
  onReset: (password: string) => void;
}

const ResetPasswordStep: React.FC<ResetPasswordStepProps> = ({ onReset }) => {
  const { trackEvent } = useMixpanel();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      trackEvent("Recover Password V2 - Reset Password Error", {
        error: "Passwords do not match",
      });
      console.log(
        "✅ Recover Password V2 - Reset Password Error: Passwords do not match"
      );
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      trackEvent("Recover Password V2 - Reset Password Error", {
        error: "Password too short",
      });
      console.log(
        "✅ Recover Password V2 - Reset Password Error: Password too short"
      );
      return;
    }

    setIsLoading(true);

    trackEvent("Recover Password V2 - Reset Password Submitted");
    console.log("✅ Recover Password V2 - Reset Password Submitted");

    // TODO: Implement password reset logic
    console.log("Password reset attempt");

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onReset(newPassword);
    }, 1000);
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
          {error && (
            <div
              className="error-message"
              role="alert"
              aria-live="polite"
              data-testid="reset-password-error"
            >
              {error}
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
              onChange={(e) => {
                trackEvent("Recover Password V2 - New Password Input Changed");
                console.log(
                  "✅ Recover Password V2 - New Password Input Changed"
                );
                setNewPassword(e.target.value);
              }}
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
              onChange={(e) => {
                trackEvent(
                  "Recover Password V2 - Confirm Password Input Changed"
                );
                console.log(
                  "✅ Recover Password V2 - Confirm Password Input Changed"
                );
                setConfirmPassword(e.target.value);
              }}
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
