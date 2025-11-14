import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordStep from "./ResetPasswordStep";

describe("ResetPasswordStep", () => {
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders reset password step correctly", () => {
    render(<ResetPasswordStep onReset={mockOnReset} />);

    expect(screen.getByTestId("reset-password-form")).toBeInTheDocument();
    expect(screen.getByText("Reset Your Password")).toBeInTheDocument();
  });

  it("has new password input field", () => {
    render(<ResetPasswordStep onReset={mockOnReset} />);

    const newPasswordInput = screen.getByTestId("new-password-input");
    expect(newPasswordInput).toBeInTheDocument();
    expect(newPasswordInput).toHaveAttribute("type", "password");
    expect(newPasswordInput).toBeRequired();
  });

  it("has confirm password input field", () => {
    render(<ResetPasswordStep onReset={mockOnReset} />);

    const confirmPasswordInput = screen.getByTestId("confirm-password-input");
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toBeRequired();
  });

  it("has reset password button", () => {
    render(<ResetPasswordStep onReset={mockOnReset} />);

    const resetBtn = screen.getByTestId("reset-password-submit-button");
    expect(resetBtn).toBeInTheDocument();
    expect(resetBtn).toHaveTextContent("Reset Password");
  });

  it("updates password inputs when typing", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordStep onReset={mockOnReset} />);

    const newPasswordInput = screen.getByTestId(
      "new-password-input"
    ) as HTMLInputElement;
    const confirmPasswordInput = screen.getByTestId(
      "confirm-password-input"
    ) as HTMLInputElement;

    await user.type(newPasswordInput, "newPassword123");
    await user.type(confirmPasswordInput, "newPassword123");

    expect(newPasswordInput.value).toBe("newPassword123");
    expect(confirmPasswordInput.value).toBe("newPassword123");
  });

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordStep onReset={mockOnReset} />);

    const newPasswordInput = screen.getByTestId("new-password-input");
    const confirmPasswordInput = screen.getByTestId("confirm-password-input");
    const resetBtn = screen.getByTestId("reset-password-submit-button");

    await user.type(newPasswordInput, "password123");
    await user.type(confirmPasswordInput, "password456");
    await user.click(resetBtn);

    const errorMessage = screen.getByTestId("reset-password-error");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Passwords do not match");
    expect(mockOnReset).not.toHaveBeenCalled();
  });

  it("shows error when password is too short", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordStep onReset={mockOnReset} />);

    const newPasswordInput = screen.getByTestId("new-password-input");
    const confirmPasswordInput = screen.getByTestId("confirm-password-input");
    const resetBtn = screen.getByTestId("reset-password-submit-button");

    await user.type(newPasswordInput, "short");
    await user.type(confirmPasswordInput, "short");
    await user.click(resetBtn);

    const errorMessage = screen.getByTestId("reset-password-error");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(
      "Password must be at least 8 characters"
    );
    expect(mockOnReset).not.toHaveBeenCalled();
  });

  it("calls onReset when passwords match and are valid", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordStep onReset={mockOnReset} />);

    const newPasswordInput = screen.getByTestId("new-password-input");
    const confirmPasswordInput = screen.getByTestId("confirm-password-input");
    const resetBtn = screen.getByTestId("reset-password-submit-button");

    await user.type(newPasswordInput, "validPassword123");
    await user.type(confirmPasswordInput, "validPassword123");
    await user.click(resetBtn);

    await waitFor(() => {
      expect(mockOnReset).toHaveBeenCalledWith("validPassword123");
    });
  });

  it("shows loading state when resetting", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordStep onReset={mockOnReset} />);

    const newPasswordInput = screen.getByTestId("new-password-input");
    const confirmPasswordInput = screen.getByTestId("confirm-password-input");
    const resetBtn = screen.getByTestId("reset-password-submit-button");

    await user.type(newPasswordInput, "validPassword123");
    await user.type(confirmPasswordInput, "validPassword123");
    await user.click(resetBtn);

    expect(resetBtn).toHaveTextContent("Resetting...");
    expect(resetBtn).toBeDisabled();
  });

  it("has correct accessibility attributes", () => {
    render(<ResetPasswordStep onReset={mockOnReset} />);

    const newPasswordInput = screen.getByTestId("new-password-input");
    const confirmPasswordInput = screen.getByTestId("confirm-password-input");
    const resetBtn = screen.getByTestId("reset-password-submit-button");

    expect(newPasswordInput).toHaveAttribute("aria-required", "true");
    expect(newPasswordInput).toHaveAttribute("aria-label", "New password");
    expect(confirmPasswordInput).toHaveAttribute("aria-required", "true");
    expect(confirmPasswordInput).toHaveAttribute(
      "aria-label",
      "Confirm password"
    );
    expect(resetBtn).toHaveAttribute("aria-label", "Reset password");
  });

  it("has correct autocomplete attributes", () => {
    render(<ResetPasswordStep onReset={mockOnReset} />);

    const newPasswordInput = screen.getByTestId("new-password-input");
    const confirmPasswordInput = screen.getByTestId("confirm-password-input");

    expect(newPasswordInput).toHaveAttribute("autoComplete", "new-password");
    expect(confirmPasswordInput).toHaveAttribute(
      "autoComplete",
      "new-password"
    );
  });

  it("error message has correct accessibility attributes", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordStep onReset={mockOnReset} />);

    const newPasswordInput = screen.getByTestId("new-password-input");
    const confirmPasswordInput = screen.getByTestId("confirm-password-input");
    const resetBtn = screen.getByTestId("reset-password-submit-button");

    await user.type(newPasswordInput, "password123");
    await user.type(confirmPasswordInput, "password456");
    await user.click(resetBtn);

    const errorMessage = screen.getByTestId("reset-password-error");
    expect(errorMessage).toHaveAttribute("role", "alert");
    expect(errorMessage).toHaveAttribute("aria-live", "polite");
  });

  it("links error message to inputs with aria-describedby", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordStep onReset={mockOnReset} />);

    const newPasswordInput = screen.getByTestId("new-password-input");
    const confirmPasswordInput = screen.getByTestId("confirm-password-input");
    const resetBtn = screen.getByTestId("reset-password-submit-button");

    await user.type(newPasswordInput, "password123");
    await user.type(confirmPasswordInput, "password456");
    await user.click(resetBtn);

    expect(newPasswordInput).toHaveAttribute(
      "aria-describedby",
      "reset-password-error"
    );
    expect(confirmPasswordInput).toHaveAttribute(
      "aria-describedby",
      "reset-password-error"
    );
  });

  it("clears error when passwords are corrected", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordStep onReset={mockOnReset} />);

    const newPasswordInput = screen.getByTestId("new-password-input");
    const confirmPasswordInput = screen.getByTestId("confirm-password-input");
    const resetBtn = screen.getByTestId("reset-password-submit-button");

    // First, create an error
    await user.type(newPasswordInput, "password123");
    await user.type(confirmPasswordInput, "password456");
    await user.click(resetBtn);

    expect(screen.getByTestId("reset-password-error")).toBeInTheDocument();

    // Clear and retype matching passwords
    await user.clear(newPasswordInput);
    await user.clear(confirmPasswordInput);
    await user.type(newPasswordInput, "validPassword123");
    await user.type(confirmPasswordInput, "validPassword123");
    await user.click(resetBtn);

    expect(
      screen.queryByTestId("reset-password-error")
    ).not.toBeInTheDocument();
  });
});
