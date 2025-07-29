// src/tests/Settings.test.tsx
import React from "react";
import { render, screen} from "@testing-library/react";
import { DefaultOptions, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Settings from "../pages/Settings";
import userEvent from "@testing-library/user-event";
import { useTheme } from "../hooks/useTheme";

// 🧪 Setup consistent query options
const testQueryOptions: DefaultOptions = {
  queries: {
    retry: false,
    gcTime: 0,
    staleTime: 0,
  },
};

jest.mock("../hooks/useTheme", () => ({
  useTheme: jest.fn(),
}));

// 🔧 Render with QueryClient
const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: testQueryOptions });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe("Walky Admin - Settings Page", () => {
    beforeEach(() => {
        (useTheme as jest.Mock).mockReturnValue({
            theme: {
            colors: {
                cardBg: "white",
                borderColor: "#dee2e6",
            },
            },
        });
        });

    it("renders the Settings page with layout and styling", () => {
        renderWithProviders(<Settings />);

        // ✅ Wrapper
        expect(screen.getByTestId("settings-page")).toBeInTheDocument();

        // ✅ Inputs via labels (more robust)
        expect(screen.getByLabelText(/school name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email domain/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/school logo/i)).toBeInTheDocument();

        // ✅ Buttons
        expect(screen.getByTestId("settings-cancel-button")).toBeInTheDocument();
        expect(screen.getByTestId("settings-save-button")).toBeInTheDocument();
        });

    it("contains the title card and form container", () => {
        renderWithProviders(<Settings />);
        const page = screen.getByTestId("settings-page");

        // Checks form exists and is inside the card
        expect(page.querySelector("form")).toBeInTheDocument();
        expect(page.querySelector(".card")).toBeInTheDocument();
        });

    it("renders the School Name input with label and help text", () => {
        renderWithProviders(<Settings />);

        const input = screen.getByLabelText(/school name/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("placeholder", "Enter school name");

        const help = screen.getByText(/official name of your school or institution/i);
        expect(help).toBeInTheDocument();
    });

    it("renders the Email Domain input with label and help text", () => {
        renderWithProviders(<Settings />);

        const input = screen.getByLabelText(/email domain/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("placeholder", "example.edu");

        const help = screen.getByText(/domain used for school email addresses/i);
        expect(help).toBeInTheDocument();
       });

    it("renders the School Logo uploader and accepts correct formats", () => {
        renderWithProviders(<Settings />);

        const input = screen.getByLabelText(/school logo/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("type", "file");
        expect(input).toHaveAttribute("accept", "image/jpeg, image/png, image/svg+xml");
    });

    it("displays recommended size and max size text for logo upload", () => {
        renderWithProviders(<Settings />);
        expect(screen.getByText(/recommended size: 200x200px, max 2mb/i)).toBeInTheDocument();
    });

    it("validates required fields: school name, display name, and email domain", async () => {
        renderWithProviders(<Settings />);

        const saveButton = screen.getByTestId("settings-save-button");
        await userEvent.click(saveButton);

        // Required inputs should show browser's validation errors, but we check fallback behavior
        const schoolInput = screen.getByLabelText(/school name/i);
        const displayInput = screen.getByLabelText(/display name/i);
        const emailInput = screen.getByLabelText(/email domain/i);

        // Since native validation won't trigger errors we can test, we assert their required attribute is set
        expect(schoolInput).toBeRequired();
        expect(displayInput).toBeRequired();
        expect(emailInput).toBeRequired();

        // Optionally: simulate filling one field at a time if you handle error styling or messages
        await userEvent.type(schoolInput, "Test School");
        await userEvent.clear(displayInput);
        await userEvent.clear(emailInput);

        // Try submitting again
        await userEvent.click(saveButton);

        // Confirm values updated
        expect(schoolInput).toHaveValue("Test School");
        expect(displayInput).toHaveValue("");
        expect(emailInput).toHaveValue("");
    });

    it("calls handleSubmit on Save click and logs assembled form data", async () => {
        // Spy on console.log to verify payload
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        renderWithProviders(<Settings />);

        // Fill out the form fields
        const schoolInput = screen.getByLabelText(/school name/i);
        const displayInput = screen.getByLabelText(/display name/i);
        const emailInput = screen.getByLabelText(/email domain/i);

        await userEvent.type(schoolInput, "Cool University");
        await userEvent.type(displayInput, "Cool U");
        await userEvent.type(emailInput, "cool.edu");

        // Simulate uploading a file for the logo
        const file = new File(["dummy-content"], "logo.png", { type: "image/png" });
        const logoInput = screen.getByLabelText(/school logo/i);
        await userEvent.upload(logoInput, file);

        // Click the save button to trigger handleSubmit
        const saveButton = screen.getByTestId("settings-save-button");
        await userEvent.click(saveButton);

        // Assert correct payload was logged
        expect(logSpy).toHaveBeenCalledWith("Settings updated:", {
            schoolName: "Cool University",
            displayName: "Cool U",
            emailDomain: "cool.edu",
            studentAmbassadors: [],
            logo: file,
        });

        logSpy.mockRestore();
    });

    it("renders the Cancel button (functionality not yet implemented)", () => {
        renderWithProviders(<Settings />);

        const cancelButton = screen.getByTestId("settings-cancel-button");
        expect(cancelButton).toBeInTheDocument();
        expect(cancelButton).toHaveTextContent(/cancel/i);
    });

    it("applies theme styles based on current theme (light/dark)", () => {
        // 🌓 Mock a dark theme
        (useTheme as jest.Mock).mockReturnValue({
        theme: {
            colors: {
            cardBg: "rgb(30,30,30)",
            borderColor: "rgb(60,60,60)",
            },
        },
        });

        renderWithProviders(<Settings />);

        const card = screen.getByTestId("settings-page").querySelector(".card");

        // ✅ Asserts theme-based styles are applied
        expect(card).toHaveStyle("background-color: rgb(30,30,30)");
        expect(card).toHaveStyle("border-color: rgb(60,60,60)");
    });

});

