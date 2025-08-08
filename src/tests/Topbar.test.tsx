import { render, screen, fireEvent, act } from "@testing-library/react";
import { Topbar } from "../components/Topbar";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate so we don't actually try to navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

// Mock useTheme
const toggleThemeMock = jest.fn();
jest.mock("../hooks/useTheme", () => ({
  useTheme: () => ({
    theme: {
      isDark: false,
      colors: {
        bodyBg: "#fff",
        bodyColor: "#000",
        cardBg: "#eee",
        borderColor: "#ccc",
        primary: "#007bff",
        secondary: "#6c757d",
        success: "#28a745",
        info: "#17a2b8",
        warning: "#ffc107",
        danger: "#dc3545",
      },
    },
    toggleTheme: toggleThemeMock,
  }),
}));

describe("Walky Admin - Topbar Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset mocks
    jest.clearAllMocks();
  });

  it("calls toggleTheme when theme toggle button is clicked", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Topbar
            onToggleSidebar={jest.fn()}
            isMobile={false}
            sidebarVisible={true}
          />
        </MemoryRouter>
      );
    })

    const toggleBtn = screen.getByTestId("theme-toggle");
    fireEvent.click(toggleBtn);

    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });

  it("shows avatar menu on click", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Topbar
            onToggleSidebar={jest.fn()}
            isMobile={false}
            sidebarVisible={true}
          />
        </MemoryRouter>
      );
    })

    // Click avatar toggle to show dropdown
    const avatarToggle = screen.getByTestId("user-dropdown");
    fireEvent.click(avatarToggle);

    // Wait for dropdown item to appear
    const logoutItem = await screen.findByTestId("logout-button");
    expect(logoutItem).toBeInTheDocument();
  });

  it('removes token and navigates to "/login" on logout', async () => {
    // Set a token in localStorage first to simulate a logged-in user
    localStorage.setItem("token", "test-token");
    
    await act(async () => {
      render(
        <MemoryRouter>
          <Topbar
            onToggleSidebar={jest.fn()}
            isMobile={false}
            sidebarVisible={true}
          />
        </MemoryRouter>
      );
    })

    // Open dropdown menu
    const avatarToggle = screen.getByTestId("user-dropdown");
    fireEvent.click(avatarToggle);

    // Click logout button
    const logoutBtn = screen.getByTestId("logout-button");
    fireEvent.click(logoutBtn);

    // Verify token is removed and navigation occurs
    expect(localStorage.getItem("token")).toBe(undefined);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

});
