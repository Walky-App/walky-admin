/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, waitFor, within, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import API from "../API";
import { getTheme } from "../theme";

// ---- Mocks ----
jest.mock('../utils/env', () => ({
  getEnv: () => ({
    VITE_API_BASE_URL: 'http://localhost:8081/api',
  }),
}));

jest.mock("@react-google-maps/api", () => ({
  GoogleMap: () => <div data-testid="mocked-google-map" />,
  useJsApiLoader: () => ({
    isLoaded: true,
    loadError: null,
  }),
  DrawingManager: () => <div data-testid="mocked-drawing-manager" />,
}));

jest.mock("../hooks/useTheme", () => ({
  useTheme: () => ({
    theme: getTheme(false),
    toggleTheme: jest.fn(),
  }),
}));

jest.mock("chart.js", () => ({
  Chart: jest.fn(),
  TooltipModel: jest.fn(),
  registerables: [],
  defaults: { font: {}, plugins: {}, scale: {} },
  register: jest.fn(),
}));

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
  CChartLine: (props: any) => (
    <div data-testid="mocked-chart-line">{props.data?.labels?.join(",")}</div>
  ),
  CChartBar: (props: any) => (
    <div data-testid="mocked-chart-bar">{props.data?.labels?.join(",")}</div>
  ),
}));

jest.mock("@coreui/react", () => ({
  CWidgetStatsA: ({
    "data-testid": testId,
    value,
    title,
    percent,
    trend,
    icon,
    children,
  }: any) => (
    <div data-testid={testId || "coreui-widget"}>
      <div className="widget-value">
        {value}
        {percent !== undefined && (
          <span className="fs-6 fw-normal">
            ({percent}%
            <span data-testid="mocked-icon">
              {trend === "up" ? "↑" : trend === "down" ? "↓" : ""}{" "}
              {icon && "Icon"}
            </span>
            )
          </span>
        )}
      </div>
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
}));

jest.mock("@coreui/icons-react", () => ({
  __esModule: true,
  default: function CIcon() {
    return <span data-testid="mocked-icon">Icon</span>;
  },
}));

jest.mock("../API");

// ---- Test Setup ----
beforeEach(async () => {
  jest.clearAllMocks();

  document.body.innerHTML = '<div id="root"></div>';

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
  });

  // API mocks for dashboard widgets
  (API.get as jest.Mock).mockImplementation((url: string) => {
    switch (url) {
      case "/walks/count?groupBy=month":
        return Promise.resolve({
          data: {
            chartData: [10, 20, 30, 40, 50, 60],
            chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            totalWalksCreated: 210,
            monthlyData: [
              { month: "May", year: "2025", count: 100 },
              { month: "June", year: "2025", count: 110 },
            ],
          },
        });
      case "/walks/count?groupBy=day":
      case "/walks/count?groupBy=week":
        return Promise.resolve({
          data: {
            chartData: [10, 20, 30, 40, 50, 60],
            chartLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            totalWalksCreated: 210,
            monthlyData: [
              { month: "May", year: "2025", count: 100 },
              { month: "June", year: "2025", count: 110 },
            ],
          },
        });
      case "/users/monthly-active?period=month":
      case "/users/monthly-active?period=day":
      case "/users/monthly-active?period=week":
        return Promise.resolve({
          data: {
            monthlyData: [
              { month: "May", year: "2025", count: 100 },
              { month: "June", year: "2025", count: 110 },
            ],
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
            totalEvents: 60,
            data: [
              { month: "January 2025", totalCount: 10 },
              { month: "February 2025", totalCount: 20 },
              { month: "March 2025", totalCount: 30 },
            ],
            monthlyData: [
              { month: "May", year: "2025", count: 100 },
              { month: "June", year: "2025", count: 110 },
            ],
          },
        });
      case "/ideas/count":
      case "/ideas/count?groupBy=month":
        return Promise.resolve({
          data: {
            chartData: [8, 12, 15, 18, 22, 25],
            totalIdeas: 210,
            monthlyData: [
              { month: "May", year: "2025", count: 100 },
              { month: "June", year: "2025", count: 110 },
            ],
          },
        });
      default:
        return Promise.resolve({ data: {} });
    }
  });

  // Mock getElementById for chartjs-tooltip
  const originalGetElementById = document.getElementById;
  jest.spyOn(document, "getElementById").mockImplementation((id: string) => {
    if (id === "chartjs-tooltip") return null;
    return originalGetElementById.call(document, id);
  });

  // Mock createElement for style
  const originalCreateElement = document.createElement;
  jest.spyOn(document, "createElement").mockImplementation((tagName: string) => {
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

  await act(async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
      { container: document.getElementById("root") as HTMLElement }
    );
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Walky Admin Portal - Dashboard Page", () => {
  it("renders the widgets and chart title", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("walks-widget")).toBeInTheDocument();
      expect(screen.getByTestId("events-widget")).toBeInTheDocument();
      expect(screen.getByTestId("ideas-widget")).toBeInTheDocument();
      expect(screen.getByTestId("surprise-widget")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("main-chart-title")).toBeInTheDocument();
      expect(screen.getByTestId("main-chart-title")).toHaveTextContent(
        "Active Users & Walks"
      );
    });
  });

  it("shows correct label, number, trend %, and graph icon per card", async () => {
    // Wait for widgets to finish loading their numbers
    await waitFor(() =>
      expect(screen.getByTestId("walks-widget")).toHaveTextContent("210")
    );
    const walksWidget = screen.getByTestId("walks-widget");
    expect(walksWidget).toHaveTextContent("Walks");
    expect(walksWidget).toHaveTextContent("10%");
    expect(within(walksWidget).getByTestId("mocked-icon")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByTestId("events-widget")).toHaveTextContent("60")
    );
    const eventsWidget = screen.getByTestId("events-widget");
    expect(eventsWidget).toHaveTextContent("Events");
    expect(eventsWidget).toHaveTextContent("50%");
    expect(within(eventsWidget).getByTestId("mocked-icon")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByTestId("ideas-widget")).toHaveTextContent("210")
    );
    const ideasWidget = screen.getByTestId("ideas-widget");
    expect(ideasWidget).toHaveTextContent("Ideas");
    expect(ideasWidget).toHaveTextContent("10%");
    expect(within(ideasWidget).getByTestId("mocked-icon")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByTestId("surprise-widget")).toHaveTextContent(/coming soon/i)
    );
    const surpriseWidget = screen.getByTestId("surprise-widget");
    expect(surpriseWidget).toHaveTextContent("Surprise");
    expect(surpriseWidget).toHaveTextContent("0%");
    expect(within(surpriseWidget).getByTestId("mocked-icon")).toBeInTheDocument();
  });

  it("handles missing/falsy stat data gracefully", async () => {
    // Override API mock to return missing/falsy data
    (API.get as jest.Mock).mockImplementation((url: string) => {
      switch (url) {
        case "/walks/count?groupBy=month":
          return Promise.resolve({
            data: {
              chartData: [],
              chartLabels: [],
              totalWalksCreated: null,
            },
          });
        case "/events/count":
          return Promise.resolve({
            data: {
              totalEvents: undefined,
            },
          });
        case "/ideas/count":
          return Promise.resolve({
            data: null,
          });
        default:
          return Promise.resolve({ data: {} });
      }
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>,
        { container: document.getElementById("root") as HTMLElement }
      );
    });

    await waitFor(() => {
      const walks = screen.getByTestId("walks-widget");
      expect(walks).toBeInTheDocument();
      expect(walks).toHaveTextContent(/0|n\/a|coming soon|loading/i);

      const events = screen.getByTestId("events-widget");
      expect(events).toBeInTheDocument();
      expect(events).toHaveTextContent(/0|n\/a|coming soon|loading/i);

      const ideas = screen.getByTestId("ideas-widget");
      expect(ideas).toBeInTheDocument();
      expect(ideas).toHaveTextContent(/0|n\/a|coming soon|loading/i);
    });
  });
});
