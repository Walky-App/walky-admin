// src/tests/NavSideBar.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { Sidebar } from "../components/NavSideBar";
import { MemoryRouter } from "react-router-dom";
import { useState } from "react";

// Wrapper with Router
const SidebarWrapper = () => {
    const [visible, setVisible] = useState(true);
  
    return (
      <MemoryRouter>
        <Sidebar visible={visible} onVisibleChange={setVisible} isMobile={true} />
        <div data-testid="outside-area" onClick={() => setVisible(false)}>
          Outside Content
        </div>
      </MemoryRouter>
    );
  };

describe("Walky Admin - Sidebar Component", () => {
  it("shows correct nav links (Dashboard, Students, etc.)", () => {
    render(
      <MemoryRouter>
        <Sidebar visible={true} onVisibleChange={() => {}} />
      </MemoryRouter>
    );

    const links = [
      { testId: "dashboard-link", text: "Dashboard" },
      { testId: "students-link", text: "Students" },
      { testId: "engagement-link", text: "Engagement" },
      { testId: "review-link", text: "Review" },
      { testId: "campuses-link", text: "Campuses" },
      { testId: "ambassadors-link", text: "Ambassadors" },
      { testId: "settings-link", text: "Settings" },
    ];

    links.forEach(({ testId, text }) => {
      const link = screen.getByTestId(testId);
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent(text);
    });
  });

  it("highlights active route", () => {
    render(
      <MemoryRouter initialEntries={["/students"]}>
        <Sidebar visible={true} onVisibleChange={() => {}} />
      </MemoryRouter>
    );

    const activeLink = screen.getByTestId("students-link");
    expect(activeLink).toHaveClass("active");
  });

  it("closes on outside click in mobile view", () => {
    render(<SidebarWrapper />);

    const sidebar = screen.getByTestId("sidebar-container");
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveStyle("transform: translateX(0)");

    const outside = screen.getByTestId("outside-area");
    fireEvent.click(outside);

    expect(sidebar).toHaveStyle("transform: translateX(-100%)");
  });

});
