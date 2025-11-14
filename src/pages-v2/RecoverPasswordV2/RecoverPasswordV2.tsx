import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AssetIcon from "../../components-v2/AssetIcon/AssetIcon";
import VerifyCodeStep from "./VerifyCodeStep";
import ResetPasswordStep from "./ResetPasswordStep";
import "./RecoverPasswordV2.css";

type RecoveryStep = "email" | "verify" | "reset";

const RecoverPasswordV2: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<RecoveryStep>("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement password recovery logic
    console.log("Password recovery request:", { email });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep("verify");
    }, 1000);
  };

  const handleVerify = (code: string) => {
    console.log("Verification code:", code);
    setCurrentStep("reset");
  };

  const handleResendCode = () => {
    console.log("Resending code to:", email);
    // TODO: Implement resend logic
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReset = (_password: string) => {
    console.log("Password reset complete");
    // Navigate to login after successful reset
    navigate("/login-v2");
  };

  const handleBackToLogin = () => {
    navigate("/login-v2");
  };

  if (currentStep === "verify") {
    return (
      <div
        className="recover-password-v2"
        data-testid="recover-password-verify-step"
      >
        <VerifyCodeStep
          email={email}
          onVerify={handleVerify}
          onResendCode={handleResendCode}
        />
      </div>
    );
  }

  if (currentStep === "reset") {
    return (
      <div
        className="recover-password-v2"
        data-testid="recover-password-reset-step"
      >
        <ResetPasswordStep onReset={handleReset} />
      </div>
    );
  }
  return (
    <div
      className="recover-password-v2"
      data-testid="recover-password-email-step"
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
    </div>
  );
};

export default RecoverPasswordV2;
