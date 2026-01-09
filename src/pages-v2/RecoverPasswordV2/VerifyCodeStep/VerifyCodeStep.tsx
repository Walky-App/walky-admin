import React, { useState } from "react";
import { AssetIcon } from "../../../components-v2";
import { apiClient } from "../../../API";

interface VerifyCodeStepProps {
  email: string;
  onVerify: (code: string) => Promise<void> | void;
  onResendCode: () => void;
}

const VerifyCodeStep: React.FC<VerifyCodeStepProps> = ({
  email,
  onVerify,
  onResendCode,
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  const validateOtp = (code: string): boolean => {
    // OTP must be exactly 6 digits
    const trimmedCode = code.trim();
    if (!/^\d{6}$/.test(trimmedCode)) {
      setError("Please enter a valid 6-digit verification code");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOtp(verificationCode)) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Verify OTP with backend before proceeding
      const response = await apiClient.api.verifyOtpCreate({
        email,
        otp: parseInt(verificationCode.trim(), 10),
      });

      if (response.data?.verified) {
        // OTP is valid, proceed to password reset
        onVerify(verificationCode.trim());
      }
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      const data = err?.response?.data;

      if (data?.locked) {
        setError("Too many failed attempts. Please request a new verification code.");
        setRemainingAttempts(0);
      } else if (data?.expired) {
        setError("Verification code has expired. Please request a new one.");
      } else if (data?.remainingAttempts !== undefined) {
        setRemainingAttempts(data.remainingAttempts);
        setError(`Invalid verification code. ${data.remainingAttempts} attempts remaining.`);
      } else {
        setError(data?.message || "Invalid verification code. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setError("");
    setRemainingAttempts(null);
    onResendCode();
  };

  return (
    <div
      className="verify-code-step"
      role="region"
      aria-label="Verification code form"
    >
      <div className="recover-content">
        <div className="recover-logo" role="img" aria-label="Walky Logo">
          <AssetIcon
            name="logo-walky-white"
            className="logo-icon"
            style={{ width: "217px", height: "auto" }}
          />
        </div>

        <h1 className="recover-title">Enter Verification Code</h1>

        <form
          className="recover-form"
          onSubmit={handleSubmit}
          data-testid="verify-code-form"
          aria-label="Verification code form"
        >
          {error && (
            <div
              className="error-message"
              style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}
              role="alert"
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
              value={email}
              disabled
              data-testid="verify-email-display"
              aria-label="Email address (read-only)"
              aria-readonly="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="code" className="form-label">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              className="form-input"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => {
                // Only allow numeric input
                const value = e.target.value.replace(/\D/g, "");
                setVerificationCode(value);
                if (error) setError("");
              }}
              required
              data-testid="verification-code-input"
              aria-label="Verification code"
              aria-required="true"
              autoComplete="one-time-code"
            />
            {remainingAttempts !== null && remainingAttempts > 0 && (
              <small style={{ color: "#ff9800", display: "block", marginTop: "0.5rem" }}>
                {remainingAttempts} attempts remaining
              </small>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || remainingAttempts === 0}
            data-testid="verify-code-submit-button"
            aria-label="Verify code"
            aria-busy={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>

          <button
            type="button"
            className="resend-link"
            onClick={handleResend}
            data-testid="resend-code-button"
            aria-label="Resend verification code"
          >
            Resend Verification Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCodeStep;
