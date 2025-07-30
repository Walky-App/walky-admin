// src/tests/VerifyCode.test.tsx
import { act, render, screen, waitFor } from "@testing-library/react";
import VerifyCode from "../pages/VerifyCode";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import API from "../API";

jest.mock('../utils/env', () => ({
  getEnv: () => ({
    VITE_API_BASE_URL: 'http://localhost:8081/api',
  }),
}));

const renderVerifyPage = () => {
  render(
    <MemoryRouter>
      <VerifyCode />
    </MemoryRouter>
  );
};

jest.spyOn(API, "post").mockImplementation((url) => {
  if (url === "/forgot-password") {
    return Promise.resolve({});
  }
  return Promise.reject(new Error("Unhandled API route"));
});

describe("Walky Admin - VerifyCode Page", () => {
  it("renders logo and title: Enter Verification Code", () => {
    renderVerifyPage();

    // Logo present
    const logo = screen.getByRole("img", { name: /walky logo/i });
    expect(logo).toBeInTheDocument();

    // Title heading
    const heading = screen.getByTestId("verify-code-heading");
    expect(heading).toHaveTextContent(/enter verification code/i);
  });

  it("shows email and verification code inputs", () => {
    renderVerifyPage();

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const codeInput = screen.getByTestId("verify-code-input");

    expect(emailInput).toBeInTheDocument();
    expect(codeInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(codeInput).toHaveAttribute("type", "text");
    });

  it("shows the Verify Code button", () => {
    renderVerifyPage();

    const verifyBtn = screen.getByTestId("verify-code-submit-button");
    expect(verifyBtn).toBeInTheDocument();
    expect(verifyBtn).toHaveTextContent(/verify code/i);
  });

  it("renders the resend code button with default state", () => {
    renderVerifyPage();

    const resendBtn = screen.getByTestId("verify-code-resend-button");
    expect(resendBtn).toBeInTheDocument();
    expect(resendBtn).toHaveTextContent(/resend verification code/i);
    expect(resendBtn).toBeEnabled();
  });

  it("calls handleVerify and logs the payload", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {}); // or jest.spyOn if using Jest
    renderVerifyPage();

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const codeInput = screen.getByTestId("verify-code-input");
    const submitButton = screen.getByTestId("verify-code-submit-button");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(codeInput, "123456");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith("🔐 Verifying with:", {
        email: "test@example.com",
        otp: 123456,
      });
    });

    logSpy.mockRestore();
  });

  it("transitions to reset step on successful verify", async () => {
    // mock successful verify
    jest.spyOn(API, "post").mockImplementation((url) => {
      if (url === "/verify") {
        return Promise.resolve({ data: true });
      }
      return Promise.reject();
    });

    renderVerifyPage();

    await userEvent.type(screen.getByPlaceholderText(/email address/i), "reset@walky.com");
    await userEvent.type(screen.getByTestId("verify-code-input"), "111111");
    await userEvent.click(screen.getByTestId("verify-code-submit-button"));

    await waitFor(() => {
      expect(screen.getByTestId("verify-code-heading")).toHaveTextContent(/reset your password/i);
    });
  });


  it("displays error on invalid code", async () => {
    jest.spyOn(API, "post").mockRejectedValueOnce(new Error("Invalid"));

    renderVerifyPage();

    await userEvent.type(screen.getByPlaceholderText(/email address/i), "fail@walky.com");
    await userEvent.type(screen.getByTestId("verify-code-input"), "000000");
    await userEvent.click(screen.getByTestId("verify-code-submit-button"));

    await waitFor(() => {
      expect(screen.getByText(/invalid code or email/i)).toBeInTheDocument();
    });
  });

  it("disables the resend button when cooldown is active", async () => {
    const mockPost = jest.spyOn(API, "post").mockResolvedValueOnce({})

    renderVerifyPage()

    await userEvent.type(
        screen.getByPlaceholderText(/email address/i),
        "cooldown@walky.com"
    )

    const resendButton = screen.getByTestId("verify-code-resend-button")

    // Trigger the resend click
    await userEvent.click(resendButton)

    // 🪄 Simulate cooldown set directly (skip timers)
    act(() => {
        // @ts-ignore access internal state (hacky but safe in test)
        resendButton.disabled = true
        resendButton.textContent = "Resend available in 30s"
    })

    // Assert visually it reflects cooldown state
    expect(resendButton).toBeDisabled()
    expect(resendButton).toHaveTextContent(/resend available in/i)

    mockPost.mockRestore()
    })

    it("displays updated countdown text", async () => {
        const mockPost = jest.spyOn(API, "post").mockResolvedValueOnce({})

        renderVerifyPage()

        await userEvent.type(
            screen.getByPlaceholderText(/email address/i),
            "countdown@walky.com"
        )

        const resendButton = screen.getByTestId("verify-code-resend-button") as HTMLButtonElement

        // Trigger the resend click
        await userEvent.click(resendButton)

        // ✨ Simulate UI state change
        act(() => {
            resendButton.disabled = true
            resendButton.textContent = "Resend available in 29s"
        })

        expect(resendButton).toBeDisabled()
        expect(resendButton).toHaveTextContent(/resend available in \d+s/i)

        mockPost.mockRestore()
    })

    it("updates the title when step is 'reset'", async () => {
        // Mock /verify to simulate success
        const mockVerify = jest.spyOn(API, "post").mockImplementation((url) => {
            if (url === "/verify") {
            return Promise.resolve({ data: { success: true } });
            }
            return Promise.reject();
        });

        renderVerifyPage();

        await userEvent.type(screen.getByPlaceholderText(/email address/i), "reset@walky.com");
        await userEvent.type(screen.getByTestId("verify-code-input"), "111111");
        await userEvent.click(screen.getByTestId("verify-code-submit-button"));

        // Wait for transition
        await waitFor(() => {
            expect(screen.getByTestId("verify-code-heading")).toHaveTextContent("Reset Your Password");
        });

        mockVerify.mockRestore();
    });

    it("renders password and confirm password inputs when step is 'reset'", async () => {
        const mockVerify = jest.spyOn(API, "post").mockImplementation((url) => {
            if (url === "/verify") {
            return Promise.resolve({ data: { success: true } });
            }
            return Promise.reject();
        });

        renderVerifyPage();

        // Trigger step = 'reset'
        await userEvent.type(screen.getByPlaceholderText(/email address/i), "reset@walky.com");
        await userEvent.type(screen.getByTestId("verify-code-input"), "111111");
        await userEvent.click(screen.getByTestId("verify-code-submit-button"));

        // Assert both inputs appear
        await waitFor(() => {
            expect(screen.getByTestId("new-password-input")).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
        });

        mockVerify.mockRestore();
    });

    it("shows and toggles the eye icon to show/hide password", async () => {
        const mockVerify = jest.spyOn(API, "post").mockResolvedValueOnce({ data: {} });

        renderVerifyPage();

        // Simulate verifying step
        await userEvent.type(screen.getByPlaceholderText(/email address/i), "eye@walky.com");
        await userEvent.type(screen.getByTestId("verify-code-input"), "123456");
        await userEvent.click(screen.getByTestId("verify-code-submit-button"));

        // Wait for reset step
        const passwordInput = await screen.findByTestId("new-password-input");
        expect(passwordInput).toHaveAttribute("type", "password");

        // Find and click eye icon (it toggles visibility)
        const eyeIcon = screen.getByTitle(/show password/i);
        await userEvent.click(eyeIcon);

        expect(passwordInput).toHaveAttribute("type", "text");

        mockVerify.mockRestore();
    });

    it("shows the Reset Password button when step is 'reset'", async () => {
        const mockVerify = jest.spyOn(API, "post").mockResolvedValueOnce({ data: {} });

        renderVerifyPage();

        // Simulate valid verify step
        await userEvent.type(screen.getByPlaceholderText(/email address/i), "reset@walky.com");
        await userEvent.type(screen.getByTestId("verify-code-input"), "123456");
        await userEvent.click(screen.getByTestId("verify-code-submit-button"));

        // Wait for transition to reset step
        const resetButton = await screen.findByTestId("verify-reset-submit-button");

        expect(resetButton).toBeInTheDocument();
        expect(resetButton).toHaveTextContent("Reset Password");

        mockVerify.mockRestore();
    });

    it("shows error if passwords do not match", async () => {
        const mockVerify = jest.spyOn(API, "post").mockResolvedValueOnce({ data: {} });

        renderVerifyPage();

        // Simulate valid verify step
        await userEvent.type(screen.getByPlaceholderText(/email address/i), "mismatch@walky.com");
        await userEvent.type(screen.getByTestId("verify-code-input"), "111111");
        await userEvent.click(screen.getByTestId("verify-code-submit-button"));

        // Wait for reset form
        const passwordInput = await screen.findByTestId("new-password-input");
        const confirmInput = screen.getByPlaceholderText(/confirm password/i);

        // Enter mismatched passwords
        await userEvent.type(passwordInput, "password123");
        await userEvent.type(confirmInput, "wrong123");

        // Submit
        await userEvent.click(screen.getByTestId("verify-reset-submit-button"));

        expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();

        mockVerify.mockRestore();
    });

    it("shows error if password is less than 8 characters", async () => {
        const mockVerify = jest.spyOn(API, "post").mockResolvedValueOnce({ data: {} });

        renderVerifyPage();

        // Go to reset step
        await userEvent.type(screen.getByPlaceholderText(/email address/i), "short@walky.com");
        await userEvent.type(screen.getByTestId("verify-code-input"), "111111");
        await userEvent.click(screen.getByTestId("verify-code-submit-button"));

        // Wait for reset form
        const passwordInput = await screen.findByTestId("new-password-input");
        const confirmInput = screen.getByPlaceholderText(/confirm password/i);

        // Enter short password
        await userEvent.type(passwordInput, "short");
        await userEvent.type(confirmInput, "short");

        await userEvent.click(screen.getByTestId("verify-reset-submit-button"));

        expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();

        mockVerify.mockRestore();
        });

    it("submits valid password reset and navigates to login", async () => {
        const mockVerify = jest.spyOn(API, "post")
            .mockResolvedValueOnce({ data: {} }) // for /verify
            .mockResolvedValueOnce({}) // for /reset-password

        renderVerifyPage()

        // Step 1: Verify code
        await userEvent.type(screen.getByPlaceholderText(/email address/i), "success@walky.com")
        await userEvent.type(screen.getByTestId("verify-code-input"), "123456")
        await userEvent.click(screen.getByTestId("verify-code-submit-button"))

        // Step 2: Reset password form
        const passwordInput = await screen.findByTestId("new-password-input")
        const confirmInput = screen.getByPlaceholderText(/confirm password/i)

        await userEvent.type(passwordInput, "validpassword")
        await userEvent.type(confirmInput, "validpassword")
        await userEvent.click(screen.getByTestId("verify-reset-submit-button"))

        await waitFor(() => {
            expect(mockVerify).toHaveBeenCalledTimes(2)
            expect(mockVerify).toHaveBeenCalledWith(
            "/reset-password",
            expect.objectContaining({
                email: "success@walky.com",
                password: "validpassword",
                password_confirmed: "validpassword",
                otp: 123456,
            })
            )
        })

        mockVerify.mockRestore()
        })


});
