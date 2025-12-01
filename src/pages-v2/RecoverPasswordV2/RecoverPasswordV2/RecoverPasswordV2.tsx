import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMixpanel } from "../../../hooks/useMixpanel";
import "./RecoverPasswordV2.css";
import VerifyCodeStep from "../VerifyCodeStep/VerifyCodeStep";
import ResetPasswordStep from "../ResetPasswordStep/ResetPasswordStep";
import { AssetIcon } from "../../../components-v2";

type RecoveryStep = "email" | "verify" | "reset";

const RecoverPasswordV2: React.FC = () => {
  const navigate = useNavigate();
  const { trackEvent } = useMixpanel();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<RecoveryStep>("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    trackEvent("Recover Password V2 - Email Submitted", { email });
    console.log("✅ Recover Password V2 - Email Submitted", { email });

    // TODO: Implement password recovery logic
    console.log("Password recovery request:", { email });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep("verify");
    }, 1000);
  };

  const handleVerify = (code: string) => {
    trackEvent("Recover Password V2 - Code Verified", { email });
    console.log("✅ Recover Password V2 - Code Verified", { email });
    console.log("Verification code:", code);
    setCurrentStep("reset");
  };

  const handleResendCode = () => {
    trackEvent("Recover Password V2 - Resend Code Clicked", { email });
    console.log("✅ Recover Password V2 - Resend Code Clicked", { email });
    console.log("Resending code to:", email);
    // TODO: Implement resend logic
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReset = (_password: string) => {
    trackEvent("Recover Password V2 - Password Reset Complete", { email });
    console.log("✅ Recover Password V2 - Password Reset Complete", { email });
    console.log("Password reset complete");
    // Navigate to login after successful reset
    navigate("/login-v2");
  };

  const handleBackToLogin = () => {
    trackEvent("Recover Password V2 - Back to Login Clicked");
    console.log("✅ Recover Password V2 - Back to Login Clicked");
    navigate("/login-v2");
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
        <ResetPasswordStep onReset={handleReset} />
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
                onChange={(e) => {
                  trackEvent("Recover Password V2 - Email Input Changed");
                  console.log("✅ Recover Password V2 - Email Input Changed");
                  setEmail(e.target.value);
                }}
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
