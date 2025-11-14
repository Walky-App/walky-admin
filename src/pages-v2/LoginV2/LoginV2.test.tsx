import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import LoginV2 from "./LoginV2";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLoginV2 = () => {
  return render(
    <BrowserRouter>
      <LoginV2 />
    </BrowserRouter>
  );
};

describe("LoginV2", () => {
  it("renders login page correctly", () => {
    renderLoginV2();

    expect(screen.getByTestId("login-v2-page")).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("has correct form labels", () => {
    renderLoginV2();

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
  });

  it("has forgot password button", () => {
    renderLoginV2();

    const forgotPasswordBtn = screen.getByTestId("forgot-password-button");
    expect(forgotPasswordBtn).toBeInTheDocument();
    expect(forgotPasswordBtn).toHaveTextContent("Forgot Password");
  });

  it("has submit button", () => {
    renderLoginV2();

    const submitBtn = screen.getByTestId("submit-button");
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveTextContent("Sign In");
  });

  it("updates email input value when typing", async () => {
    const user = userEvent.setup();
    renderLoginV2();

    const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
    await user.type(emailInput, "test@example.com");

    expect(emailInput.value).toBe("test@example.com");
  });

  it("updates password input value when typing", async () => {
    const user = userEvent.setup();
    renderLoginV2();

    const passwordInput = screen.getByTestId(
      "password-input"
    ) as HTMLInputElement;
    await user.type(passwordInput, "password123");

    expect(passwordInput.value).toBe("password123");
  });

  it("navigates to recover password when forgot password is clicked", () => {
    renderLoginV2();

    const forgotPasswordBtn = screen.getByTestId("forgot-password-button");
    fireEvent.click(forgotPasswordBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/recover-password");
  });

  it("requires email and password fields", () => {
    renderLoginV2();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it("has correct input types", () => {
    renderLoginV2();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("has correct autocomplete attributes", () => {
    renderLoginV2();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    expect(emailInput).toHaveAttribute("autoComplete", "email");
    expect(passwordInput).toHaveAttribute("autoComplete", "current-password");
  });

  it("has correct accessibility attributes", () => {
    renderLoginV2();

    const form = screen.getByTestId("login-form");
    const emailInput = screen.getByTestId("email-input");
    const submitBtn = screen.getByTestId("submit-button");

    expect(form).toHaveAttribute("aria-label", "Login form");
    expect(emailInput).toHaveAttribute("aria-required", "true");
    expect(submitBtn).toHaveAttribute("aria-label", "Sign in");
  });

  it("renders logo with accessibility", () => {
    renderLoginV2();

    const logo = screen.getByLabelText("Walky Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("role", "img");
  });
});
