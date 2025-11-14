import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerifyCodeStep from "./VerifyCodeStep";

describe("VerifyCodeStep", () => {
  const mockOnVerify = vi.fn();
  const mockOnResendCode = vi.fn();
  const testEmail = "test@example.com";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders verify code step correctly", () => {
    render(
      <VerifyCodeStep
        email={testEmail}
        onVerify={mockOnVerify}
        onResendCode={mockOnResendCode}
      />
    );

    expect(screen.getByTestId("verify-code-form")).toBeInTheDocument();
    expect(screen.getByText("Enter Verification Code")).toBeInTheDocument();
  });

  it("displays the provided email address", () => {
    render(
      <VerifyCodeStep
        email={testEmail}
        onVerify={mockOnVerify}
        onResendCode={mockOnResendCode}
      />
    );

    const emailInput = screen.getByTestId(
      "verify-email-display"
    ) as HTMLInputElement;
    expect(emailInput.value).toBe(testEmail);
    expect(emailInput).toBeDisabled();
  });

  it("has verification code input field", () => {
    render(
      <VerifyCodeStep
        email={testEmail}
        onVerify={mockOnVerify}
        onResendCode={mockOnResendCode}
      />
    );

    const codeInput = screen.getByTestId("verification-code-input");
    expect(codeInput).toBeInTheDocument();
    expect(codeInput).toHaveAttribute("type", "text");
    expect(codeInput).toBeRequired();
  });

  it("has verify button", () => {
    render(
      <VerifyCodeStep
        email={testEmail}
        onVerify={mockOnVerify}
        onResendCode={mockOnResendCode}
      />
    );

    const verifyBtn = screen.getByTestId("verify-code-submit-button");
    expect(verifyBtn).toBeInTheDocument();
    expect(verifyBtn).toHaveTextContent("Verify Code");
  });

  it("has resend code button", () => {
    render(
      <VerifyCodeStep
        email={testEmail}
        onVerify={mockOnVerify}
        onResendCode={mockOnResendCode}
      />
    );

    const resendBtn = screen.getByTestId("resend-code-button");
    expect(resendBtn).toBeInTheDocument();
    expect(resendBtn).toHaveTextContent("Resend Verification Code");
  });

  it("updates verification code input when typing", async () => {
    const user = userEvent.setup();
    render(
      <VerifyCodeStep
        email={testEmail}
        onVerify={mockOnVerify}
        onResendCode={mockOnResendCode}
      />
    );

    const codeInput = screen.getByTestId(
      "verification-code-input"
    ) as HTMLInputElement;
    await user.type(codeInput, "123456");

    expect(codeInput.value).toBe("123456");
  });

  it("calls onVerify with code when verify button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <VerifyCodeStep
        email={testEmail}
        onVerify={mockOnVerify}
        onResendCode={mockOnResendCode}
      />
    );

    const codeInput = screen.getByTestId("verification-code-input");
    const verifyBtn = screen.getByTestId("verify-code-submit-button");

    await user.type(codeInput, "123456");
    await user.click(verifyBtn);

    await waitFor(() => {
      expect(mockOnVerify).toHaveBeenCalledWith("123456");
    });
  });

  it("calls onResendCode when resend button is clicked", () => {
    render(
      <VerifyCodeStep
        email={testEmail}
        onVerify={mockOnVerify}
        onResendCode={mockOnResendCode}
      />
    );

    const resendBtn = screen.getByTestId("resend-code-button");
    fireEvent.click(resendBtn);

    expect(mockOnResendCode).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when verifying", async () => {
    const user = userEvent.setup();
    render(
      <VerifyCodeStep
        email={testEmail}
        onVerify={mockOnVerify}
        onResendCode={mockOnResendCode}
      />
    );

    const codeInput = screen.getByTestId("verification-code-input");
    const verifyBtn = screen.getByTestId("verify-code-submit-button");

    await user.type(codeInput, "123456");
    await user.click(verifyBtn);

    expect(verifyBtn).toHaveTextContent("Verifying...");
    expect(verifyBtn).toBeDisabled();
  });

  it("has correct accessibility attributes", () => {
    render(
      <VerifyCodeStep
        email={testEmail}
        onVerify={mockOnVerify}
        onResendCode={mockOnResendCode}
      />
    );

    const emailInput = screen.getByTestId("verify-email-display");
    const codeInput = screen.getByTestId("verification-code-input");
    const verifyBtn = screen.getByTestId("verify-code-submit-button");

    expect(emailInput).toHaveAttribute("aria-readonly", "true");
    expect(codeInput).toHaveAttribute("aria-required", "true");
    expect(codeInput).toHaveAttribute("aria-label", "Verification code");
    expect(verifyBtn).toHaveAttribute("aria-label", "Verify code");
  });

  it("has correct autocomplete attribute on verification code", () => {
    render(
      <VerifyCodeStep
        email={testEmail}
        onVerify={mockOnVerify}
        onResendCode={mockOnResendCode}
      />
    );

    const codeInput = screen.getByTestId("verification-code-input");
    expect(codeInput).toHaveAttribute("autoComplete", "one-time-code");
  });

  it("prevents form submission with empty code", () => {
    render(
      <VerifyCodeStep
        email={testEmail}
        onVerify={mockOnVerify}
        onResendCode={mockOnResendCode}
      />
    );

    const verifyBtn = screen.getByTestId("verify-code-submit-button");
    fireEvent.click(verifyBtn);

    expect(mockOnVerify).not.toHaveBeenCalled();
  });
});
