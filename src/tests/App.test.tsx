/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import API from "../API";
import { getTheme } from "../theme";

// Mock the hooks/useTheme module
jest.mock("../hooks/useTheme", () => ({
  useTheme: () => ({
    theme: getTheme(false), // Always return light theme
    toggleTheme: jest.fn(),
  }),
}));
jest.mock("chart.js", () => {
  return {
    Chart: jest.fn(),
    TooltipModel: jest.fn(),
    registerables: [],
    defaults: {
      font: {},
      plugins: {},
      scale: {},
    },
    register: jest.fn(),
  };
});

// Mock ExampleAdminLayout component
jest.mock("../components/ExampleAdminLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="admin-layout">{children}</div>
  ),
}));
jest.mock("../components/MainChart", () => ({
  __esModule: true,
  default: () => <div data-testid="mocked-main-chart">Main Chart Mock</div>,
}));
jest.mock("@coreui/react-chartjs", () => ({
  CChartLine: (props: any) => {
    return (
      <div data-testid="mocked-chart-line">{props.data?.labels?.join(",")}</div>
    );
  },
  CChartBar: (props: any) => {
    return (
      <div data-testid="mocked-chart-bar">{props.data?.labels?.join(",")}</div>
    );
  },
}));

// Mock CoreUI components
jest.mock("@coreui/react", () => {
  // Create simplified mocks of CoreUI components
  return {
    CWidgetStatsA: ({ "data-testid": testId, value, title, children }: any) => (
      <div data-testid={testId || "coreui-widget"}>
        <div className="widget-value">{value}</div>
        <div className="widget-title">{title}</div>
        {children}
      </div>
    ),
    CCard: ({ children, className }: any) => (
      <div className={`card ${className || ""}`}>{children}</div>
    ),
    CCardHeader: ({ children }: any) => (
      <div className="card-header">{children}</div>
    ),
    CCardBody: ({ children }: any) => (
      <div className="card-body">{children}</div>
    ),
    CRow: ({ children }: any) => <div className="row">{children}</div>,
    CCol: ({ children }: any) => <div className="col">{children}</div>,
    CButton: ({ children, onClick }: any) => (
      <button onClick={onClick} className="btn">
        {children}
      </button>
    ),
    CButtonGroup: ({ children }: any) => (
      <div className="btn-group">{children}</div>
    ),
  };
});

// Mock @coreui/icons-react
jest.mock("@coreui/icons-react", () => ({
  __esModule: true,
  // eslint-disable-next-line no-empty-pattern
  default: function CIcon({}: { icon: any }) {
    return <span data-testid="mocked-icon">Icon</span>;
  },
}));

jest.mock("../API");

describe("Walky Admin Portal - Dashboard Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up proper DOM for testing
    document.body.innerHTML = '<div id="root"></div>';

    // Reset any document mocks to avoid interference
    jest.restoreAllMocks();

    // Add additional mocks for API endpoints used in the test
    (API.get as jest.Mock).mockImplementation((url: string) => {
      switch (url) {
        case "/walks/count?groupBy=month":
          return Promise.resolve({
            data: {
              chartData: [10, 20, 30, 40, 50, 60],
              chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              totalWalksCreated: 210,
            },
          });
        case "/walks/count?groupBy=day":
        case "/walks/count?groupBy=week":
          return Promise.resolve({
            data: {
              chartData: [10, 20, 30, 40, 50, 60],
              chartLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              totalWalksCreated: 210,
            },
          });
        case "/users/monthly-active?period=month":
        case "/users/monthly-active?period=day":
        case "/users/monthly-active?period=week":
          return Promise.resolve({
            data: {
              monthlyData: [],
              chartData: [5, 10, 15, 20, 25, 30],
              chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              totalActiveUsers: 100,
              last24HoursActiveUsers: 12,
              period: "month",
              since: "Jan 2024",
            },
          });
        case "/events/count":
        case "/events/eventEngagement-count?timeFrame=last6months":
          return Promise.resolve({
            data: {
              chartData: [5, 10, 15, 20, 25, 30],
              totalEvents: 105,
              data: [
                { month: "January 2025", totalCount: 10 },
                { month: "February 2025", totalCount: 20 },
                { month: "March 2025", totalCount: 30 },
              ],
            },
          });
        case "/ideas/count":
        case "/ideas/count?groupBy=month":
          return Promise.resolve({
            data: {
              chartData: [8, 12, 15, 18, 22, 25],
              totalIdeas: 100,
              monthlyData: [
                { month: "January", year: "2025", count: 10 },
                { month: "February", year: "2025", count: 20 },
                { month: "March", year: "2025", count: 30 },
              ],
            },
          });
        default:
          return Promise.resolve({ data: {} });
      }
    });

    // Mock getElementById
    const originalGetElementById = document.getElementById;
    jest.spyOn(document, "getElementById").mockImplementation((id: string) => {
      if (id === "chartjs-tooltip") {
        return null;
      }
      return originalGetElementById.call(document, id);
    });

    // Mock createElement
    const originalCreateElement = document.createElement;
    jest
      .spyOn(document, "createElement")
      .mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === "div" && element) {
          element.id = "";
          Object.defineProperty(element, "style", {
            value: {},
            writable: true,
          });
        }
        return element;
      });
  });

  it("renders the Walks widget and chart title", async () => {
    try {
      // Mock console methods to catch any errors
      const originalConsoleError = console.error;
      console.error = jest.fn();

      // Mock window methods
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => "light"),
          setItem: jest.fn(),
        },
        writable: true,
      });

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      }); // Helper to stub document methods safely
      // Removed complex document mocking approach

      // Render with mocked theme hook
      render(
        <MemoryRouter initialEntries={["/"]}>
          <App initialLoginState={true} />
        </MemoryRouter>,
        { container: document.getElementById("root") as HTMLElement }
      );

      // Wait for API calls to resolve and components to render with longer timeout
      await waitFor(
        () => {
          expect(screen.getByTestId("walks-widget")).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      // Also check for chart title
      await waitFor(
        () => {
          expect(screen.getByTestId("main-chart-title")).toBeInTheDocument();
          expect(screen.getByTestId("main-chart-title")).toHaveTextContent(
            "Active Users & Walks"
          );
        },
        { timeout: 5000 }
      );

      // Restore console.error
      console.error = originalConsoleError;
    } catch (error: unknown) {
      console.error("🔥 FINAL ERROR:", error);
      throw error;
    }
  });
});
