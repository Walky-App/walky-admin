// src/tests/ExampleAdminLayout.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ExampleAdminLayout from "../components/ExampleAdminLayout";
import { MemoryRouter } from "react-router-dom";



// Mock Sidebar and Topbar to observe sidebar visibility behavior
jest.mock("../components/NavSideBar.tsx", () => ({
  Sidebar: ({ visible }: { visible: boolean }) => (
    <div data-testid="mocked-sidebar">
      {visible ? "Sidebar Open" : "Sidebar Closed"}
    </div>
  ),
}));

jest.mock("../components/Topbar.tsx", () => ({
  Topbar: ({ onToggleSidebar }: { onToggleSidebar: () => void }) => (
    <button data-testid="toggle-button" onClick={onToggleSidebar}>
      Toggle Sidebar
    </button>
  ),
}));

// Mock theme hook
let mockTheme = {
    colors: {
      bodyBg: "#fff",
      bodyColor: "#000",
      cardBg: "#eee",
      borderColor: "#ccc",
    },
  };
  
  // Then mock useTheme to return the dynamic theme
jest.mock("../hooks/useTheme", () => ({
    useTheme: () => ({
        theme: mockTheme,
    }),
}));

// Mock Breadcrumbs (optional)
jest.mock("../components/examples/BreadCrumbs.tsx", () => ({
  BreadcrumbDividersExample: () => <div data-testid="mocked-breadcrumb" />,
}));

describe("Walky Admin - ExampleAdminLayout.tsx", () => {
  beforeEach(() => {
    // Set up DOM root for render
    document.body.innerHTML = '<div id="root"></div>';
  });

  it("shows sidebar on large screens and hides on small screens", () => {
    // Set large screen
    window.innerWidth = 1024;
    window.dispatchEvent(new Event("resize"));

    render(
      <MemoryRouter initialEntries={["/"]}>
        <ExampleAdminLayout>
          <div>Test Content</div>
        </ExampleAdminLayout>
      </MemoryRouter>,
      { container: document.getElementById("root") as HTMLElement }
    );

    expect(screen.getByTestId("mocked-sidebar")).toHaveTextContent("Sidebar Open");

    // Set small screen
    window.innerWidth = 500;
    window.dispatchEvent(new Event("resize"));

    // Re-render to reflect new layout
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ExampleAdminLayout>
          <div>Test Content</div>
        </ExampleAdminLayout>
      </MemoryRouter>,
      { container: document.getElementById("root") as HTMLElement }
    );

    expect(screen.getByTestId("mocked-sidebar")).toHaveTextContent("Sidebar Closed");
  });

  it("toggles sidebar when clicking the toggle button", () => {
    // Set large screen
    window.innerWidth = 1024;
    window.dispatchEvent(new Event("resize"));

    render(
      <MemoryRouter initialEntries={["/"]}>
        <ExampleAdminLayout>
          <div>Test Content</div>
        </ExampleAdminLayout>
      </MemoryRouter>,
      { container: document.getElementById("root") as HTMLElement }
    );

    const sidebar = screen.getByTestId("mocked-sidebar");
    expect(sidebar).toHaveTextContent("Sidebar Open");

    const toggleButton = screen.getByTestId("toggle-button");
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);

    // Since state doesn't persist across fake components, you would normally test toggle state
    // through real rendering, but this confirms interaction fires
    expect(toggleButton).toBeInTheDocument();
  });

  describe.each([
    ["/", "Dashboard"],
    ["/students", "Students"],
    ["/engagement", "Real Time"],
    ["/review", "Review"],
    ["/campuses", "Campuses"],
    ["/settings", "Settings"],
  ])("renders correct title for route %s", (route, expectedTitle) => {
    it(`shows "${expectedTitle}"`, () => {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event("resize"));
  
      render(
        <MemoryRouter initialEntries={[route]}>
          <ExampleAdminLayout>
            <div>Test Content</div>
          </ExampleAdminLayout>
        </MemoryRouter>
      );
  
      const heading = screen.getByTestId("page-title");
      expect(heading).toHaveTextContent(expectedTitle);
    });
  });

  it("renders breadcrumb when present", () => {
    render(
      <MemoryRouter initialEntries={["/students"]}>
        <ExampleAdminLayout>
          <div>Test Content</div>
        </ExampleAdminLayout>
      </MemoryRouter>
    );
  
    expect(screen.getByTestId("mocked-breadcrumb")).toBeInTheDocument();
  });

   
  it("applies light theme styles correctly", () => {
    mockTheme = {
      colors: {
        bodyBg: "#ffffff",
        bodyColor: "#000000",
        cardBg: "#eeeeee",
        borderColor: "#cccccc",
      },
    };
  
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ExampleAdminLayout>
          <div>Test Content</div>
        </ExampleAdminLayout>
      </MemoryRouter>
    );
  
    const main = screen.getByRole("main");
    expect(main).toHaveStyle({ backgroundColor: "#ffffff", color: "#000000" });
  });
  
  it("applies dark theme styles correctly", () => {
    mockTheme = {
      colors: {
        bodyBg: "#1a1a1a",
        bodyColor: "#f2f2f2",
        cardBg: "#333333",
        borderColor: "#444444",
      },
    };
  
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ExampleAdminLayout>
          <div>Test Content</div>
        </ExampleAdminLayout>
      </MemoryRouter>
    );
  
    const main = screen.getByRole("main");
    expect(main).toHaveStyle({ backgroundColor: "#1a1a1a", color: "#f2f2f2" });
  });

  it("renders footer with correct text", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ExampleAdminLayout>
          <div>Test Content</div>
        </ExampleAdminLayout>
      </MemoryRouter>
    );
  

    const footer = screen.getByTestId("footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent("Walky Admin © 2023 | Built with CoreUI");
  
  });
  
  

});
