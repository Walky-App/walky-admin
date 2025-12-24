import React, { useState } from "react";
import { AssetIcon } from "../../../components-v2";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onVerify(verificationCode);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
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
              className="form-input"
              placeholder="Enter Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              data-testid="verification-code-input"
              aria-label="Verification code"
              aria-required="true"
              autoComplete="one-time-code"
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
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
