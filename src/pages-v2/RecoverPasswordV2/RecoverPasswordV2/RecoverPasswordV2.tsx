import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "./RecoverPasswordV2.css";
import VerifyCodeStep from "../VerifyCodeStep/VerifyCodeStep";
import ResetPasswordStep from "../ResetPasswordStep/ResetPasswordStep";
import { AssetIcon, CustomToast } from "../../../components-v2";

type RecoveryStep = "email" | "verify" | "reset";

import { apiClient } from "../../../API";

const RecoverPasswordV2: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<RecoveryStep>("email");
  const [error, setError] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetErrors, setResetErrors] = useState<string[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const step = searchParams.get("step");
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      const normalizedEmail = emailFromQuery.includes(" ")
        ? emailFromQuery.replace(/ /g, "+")
        : emailFromQuery;
      setEmail(normalizedEmail);
    }
    if (step === "verify" && emailFromQuery) {
      setCurrentStep("verify");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await apiClient.api.forgotPasswordCreate({ email });
      setCurrentStep("verify");
    } catch (err: any) {
      console.error("Password recovery request failed:", err);
      setError(err?.response?.data?.message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP verification is now handled by VerifyCodeStep via backend API
  // This callback is called after successful verification
  const handleVerify = (code: string) => {
    const parsedOtp = parseInt(code, 10);
    if (isNaN(parsedOtp) || parsedOtp <= 0) {
      setError("Invalid verification code");
      return;
    }
    setOtp(parsedOtp);
    setCurrentStep("reset");
  };

  const handleResendCode = async () => {
    console.log("Resending code to:", email);
    try {
      await apiClient.api.forgotPasswordCreate({ email });
    } catch (err) {
      console.error("Resend code failed:", err);
    }
  };

  const handleReset = async (password: string) => {
    setIsLoading(true);
    setResetError("");
    setResetErrors([]);
    try {
      await apiClient.api.resetPasswordCreate({
        email,
        otp: otp || 0,
        password,
        password_confirmed: password,
      });
      console.log("Password reset complete");
      setShowSuccessToast(true);
      // Navigate after showing toast
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Password reset failed:", err);
      const data = err?.response?.data;

      // Handle password validation errors - show in form, not alert
      if (data?.message === "Password validation failed" && data?.errors) {
        setResetErrors(data.errors);
        throw err; // Re-throw so child component can handle loading state
      }

      // Handle other errors
      setResetError(data?.message || "Failed to reset password.");
      throw err; // Re-throw so child component can handle loading state
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (currentStep === "verify") {
    return (
      <main
        className="recover-password-v2"
        data-testid="recover-password-verify-step"
        aria-label="Verify code page"
      >
        <VerifyCodeStep
          email={email}
          onVerify={handleVerify}
          onResendCode={handleResendCode}
        />
      </main>
    );
  }

  if (currentStep === "reset") {
    return (
      <main
        className="recover-password-v2"
        data-testid="recover-password-reset-step"
        aria-label="Reset password page"
      >
        <ResetPasswordStep
          onReset={handleReset}
          apiError={resetError}
          apiErrors={resetErrors}
        />
        {showSuccessToast && (
          <CustomToast
            message="Password reset successfully! Redirecting to login..."
            onClose={() => setShowSuccessToast(false)}
            duration={2000}
          />
        )}
      </main>
    );
  }
  return (
    <main
      className="recover-password-v2"
      data-testid="recover-password-email-step"
      aria-label="Password recovery page"
    >
      <div className="recover-container">
        <div className="recover-content">
          <div className="recover-logo" role="img" aria-label="Walky Logo">
            <AssetIcon name="logo-walky-white" className="logo-icon" />
          </div>

          <h1 className="recover-title">Forgot your password ?</h1>

          <form
            className="recover-form"
            onSubmit={handleSubmit}
            data-testid="recover-email-form"
            aria-label="Password recovery form"
          >
            {error && (
              <div
                className="error-message"
                style={{
                  color: "red",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
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
                data-testid="recover-email-input"
                aria-label="Email address"
                aria-required="true"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
              data-testid="recover-submit-button"
              aria-label="Send reset link"
              aria-busy={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <button
            type="button"
            className="back-to-login"
            onClick={handleBackToLogin}
            data-testid="back-to-login-button"
            aria-label="Back to login page"
          >
            Back to Log in
          </button>
        </div>
      </div>
    </main>
  );
};

export default RecoverPasswordV2;
