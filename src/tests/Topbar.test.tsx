import { render, screen, fireEvent, act } from "@testing-library/react";
import { Topbar } from "../components/Topbar";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate so we don’t actually try to navigate
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

    // click avatar toggle to show dropdown
    const avatarToggle = screen.getByTestId("user-dropdown");
    fireEvent.click(avatarToggle);

    // Wait for dropdown item to appear
    const logoutItem = await screen.findByTestId("logout-button");
    expect(logoutItem).toBeInTheDocument();
  });

  it('removes token and navigates to "/login" on logout', async () => {
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

    // Open dropdown
    const avatarToggle = screen.getByTestId("user-dropdown");
    fireEvent.click(avatarToggle);

    const logoutBtn = screen.getByTestId("logout-button");
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem("token")).toBe(null);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

});
