import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import RecoverPasswordV2 from "./RecoverPasswordV2";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderRecoverPassword = () => {
  return render(
    <BrowserRouter>
      <RecoverPasswordV2 />
    </BrowserRouter>
  );
};

describe("RecoverPasswordV2 - Email Step", () => {
  it("renders email step correctly", () => {
    renderRecoverPassword();

    expect(
      screen.getByTestId("recover-password-email-step")
    ).toBeInTheDocument();
    expect(screen.getByText("Forgot your password ?")).toBeInTheDocument();
  });

  it("has email input field", () => {
    renderRecoverPassword();

    const emailInput = screen.getByTestId("recover-email-input");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toBeRequired();
  });

  it("has send reset link button", () => {
    renderRecoverPassword();

    const submitBtn = screen.getByTestId("recover-submit-button");
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveTextContent("Send Reset Link");
  });

  it("has back to login button", () => {
    renderRecoverPassword();

    const backBtn = screen.getByTestId("back-to-login-button");
    expect(backBtn).toBeInTheDocument();
    expect(backBtn).toHaveTextContent("Back to Log in");
  });

  it("updates email input when typing", async () => {
    const user = userEvent.setup();
    renderRecoverPassword();

    const emailInput = screen.getByTestId(
      "recover-email-input"
    ) as HTMLInputElement;
    await user.type(emailInput, "test@example.com");

    expect(emailInput.value).toBe("test@example.com");
  });

  it("navigates back to login when back button is clicked", () => {
    renderRecoverPassword();

    const backBtn = screen.getByTestId("back-to-login-button");
    fireEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/login-v2");
  });

  it("shows loading state when submitting", async () => {
    const user = userEvent.setup();
    renderRecoverPassword();

    const emailInput = screen.getByTestId("recover-email-input");
    const submitBtn = screen.getByTestId("recover-submit-button");

    await user.type(emailInput, "test@example.com");
    await user.click(submitBtn);

    expect(submitBtn).toHaveTextContent("Sending...");
    expect(submitBtn).toBeDisabled();
  });

  it("has correct accessibility attributes", () => {
    renderRecoverPassword();

    const form = screen.getByTestId("recover-email-form");
    const emailInput = screen.getByTestId("recover-email-input");
    const submitBtn = screen.getByTestId("recover-submit-button");

    expect(form).toHaveAttribute("aria-label", "Password recovery form");
    expect(emailInput).toHaveAttribute("aria-required", "true");
    expect(emailInput).toHaveAttribute("aria-label", "Email address");
    expect(submitBtn).toHaveAttribute("aria-label", "Send reset link");
  });

  it("has correct autocomplete attribute", () => {
    renderRecoverPassword();

    const emailInput = screen.getByTestId("recover-email-input");
    expect(emailInput).toHaveAttribute("autoComplete", "email");
  });

  it("renders logo with accessibility", () => {
    renderRecoverPassword();

    const logo = screen.getByLabelText("Walky Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("role", "img");
  });
});
