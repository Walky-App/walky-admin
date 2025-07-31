// src/tests/CampusSync.test.tsx
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { DefaultOptions, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CampusSync from "../pages/CampusSync";
import { campusSyncService } from "../services/campusSyncService";
import type { CampusSyncStatus } from "../services/campusSyncService";
import { format } from "date-fns";
import userEvent from "@testing-library/user-event";

// ---- Mocks ----
jest.mock("../services/campusSyncService", () => ({
  campusSyncService: {
    getCampusesWithSyncStatus: jest.fn(),
    syncCampus: jest.fn(),
    syncAllCampuses: jest.fn(),
    getSyncLogs: jest.fn(),
    previewCampusBoundary: jest.fn(),
  },
}));

const mockedService = campusSyncService as jest.Mocked<typeof campusSyncService>;

const mockCampuses: CampusSyncStatus[] = [
  {
    _id: "campus1",
    campus_name: "Test University",
    has_coordinates: true,
    places_count: 12,
    coordinates: {
      type: "Polygon",
      coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]],
    },
    last_sync: {
      date: new Date(),
      status: "completed",
      places_added: 5,
      places_updated: 3,
      places_removed: 1,
      api_calls_used: 22,
    },
  },
];

const mockCampusesWithBoundary: CampusSyncStatus[] = [
  {
    _id: "campus1",
    campus_name: "Test University",
    has_coordinates: true,
    places_count: 12,
    coordinates: {
      type: "Polygon",
      coordinates: [
        [
          [-80.1918, 25.7617],
          [-80.1918, 25.7627],
          [-80.1928, 25.7627],
          [-80.1928, 25.7617],
          [-80.1918, 25.7617],
        ],
      ],
    },
    last_sync: {
      date: new Date("2025-07-16T15:43:00Z"),
      status: "completed",
      places_added: 5,
      places_updated: 3,
      places_removed: 1,
      api_calls_used: 22,
    },
  },
];

const testQueryOptions: DefaultOptions = {
  queries: {
    retry: false,
    gcTime: 0,
    staleTime: 0,
  },
};

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: testQueryOptions });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("Walky Admin - CampusSync Component", () => {
  it("renders the Campus Sync page with proper layout and styling", async () => {
    mockedService.getCampusesWithSyncStatus.mockResolvedValueOnce(mockCampuses);
    renderWithProviders(<CampusSync />);
    await waitFor(() => {
      expect(screen.getByText("Test University")).toBeInTheDocument();
    });
    expect(screen.getByTestId("sync-page-title")).toHaveTextContent("Campus Sync Management");
    ["Campus Name", "Coordinates", "Places", "Last Sync", "Status", "API Calls", "Actions"].forEach(header =>
      expect(screen.getByText(header)).toBeInTheDocument()
    );
    expect(screen.getAllByTestId("button-sync")[0]).toBeVisible();
  });

  it("displays header: Campus Sync Management", async () => {
    mockedService.getCampusesWithSyncStatus.mockResolvedValueOnce(mockCampuses);
    renderWithProviders(<CampusSync />);
    await waitFor(() => {
      expect(screen.getByText("Campus Sync Management")).toBeInTheDocument();
    });
    expect(screen.getByTestId("sync-page-title")).toHaveTextContent("Campus Sync Management");
  });

  it("renders Sync All Campuses and View Logs buttons", async () => {
    mockedService.getCampusesWithSyncStatus.mockResolvedValueOnce(mockCampuses);
    renderWithProviders(<CampusSync />);
    await waitFor(() => {
      expect(screen.getByText("Test University")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /Sync All Campuses/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /View Logs/i })).toBeInTheDocument();
  });

  it("fetches and displays campus rows with key info and action buttons", async () => {
    mockedService.getCampusesWithSyncStatus.mockResolvedValueOnce(mockCampuses);
    renderWithProviders(<CampusSync />);
    await waitFor(() => {
      expect(screen.getByText("Test University")).toBeInTheDocument();
    });
    expect(screen.getByText("Test University")).toBeInTheDocument();
    expect(screen.getByText("Configured")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    const formattedDate = format(mockCampuses[0].last_sync!.date, "MMM dd, yyyy HH:mm");
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("22")).toBeInTheDocument();
    expect(screen.getAllByTestId("button-sync")[0]).toBeEnabled();
    expect(screen.getByTestId("button-preview")).toBeEnabled();
  });

  it("handles Sync Campus button: triggers sync, shows spinner, updates status, and displays alert", async () => {
    const mockSyncCampus = jest.fn().mockImplementation(() =>
      new Promise((resolve) =>
        setTimeout(() => resolve({
          _id: "campus1",
          sync_status: "completed",
          places_added: 4,
          places_updated: 2,
          places_removed: 1,
        }), 100)
      )
    );
    mockedService.getCampusesWithSyncStatus
      .mockResolvedValueOnce(mockCampuses)
      .mockResolvedValueOnce(mockCampuses);
    mockedService.syncCampus.mockImplementationOnce(mockSyncCampus);
    renderWithProviders(<CampusSync />);
    await waitFor(() => {
      expect(screen.getByText("Test University")).toBeInTheDocument();
    });
    const syncButton = screen.getByTestId("button-sync");
    expect(syncButton).toBeEnabled();
    await userEvent.click(syncButton);
    await waitFor(() => {
      expect(screen.getByTestId("button-sync")).toContainElement(
        screen.getByRole("status")
      );
    });
    await waitFor(() => {
      expect(mockSyncCampus).toHaveBeenCalledWith("campus1");
      expect(screen.getByTestId("sync-alert")).toBeInTheDocument();
      expect(screen.getByTestId("sync-alert")).toHaveTextContent(/sync completed/i);
    });
  });

  it("opens Preview Modal on button click and displays boundary metadata", async () => {
    mockedService.getCampusesWithSyncStatus.mockResolvedValueOnce(mockCampusesWithBoundary);
    mockedService.previewCampusBoundary.mockResolvedValueOnce({
      campus_name: "Test University",
      area_acres: 30.5,
      area_sqm: 123456,
      search_points_count: 12,
      center: { lat: 25.7617, lng: -80.1918 },
      bounds: {
        north: 26,
        south: 25.5,
        east: -80,
        west: -80.5,
      },
      boundary: mockCampusesWithBoundary[0].coordinates ?? { type: "Polygon", coordinates: [] },
      search_points: [
        { lat: 25.7618, lng: -80.1919, radius: 0 },
        { lat: 25.7619, lng: -80.1920, radius: 0 },
      ],
    });
    renderWithProviders(<CampusSync />);
    await waitFor(() => {
      expect(screen.getByText("Test University")).toBeInTheDocument();
    });
    const previewBtn = screen.getByTestId("button-preview");
    await userEvent.click(previewBtn);
    const modal = await screen.findByRole("dialog");
    const modalUtils = within(modal);
    expect(modalUtils.getByText("Campus Boundary Preview")).toBeInTheDocument();
    expect(modalUtils.getByText("Test University")).toBeInTheDocument();
    expect(modalUtils.getByText(/30\.50 acres/i)).toBeInTheDocument();
    expect(modalUtils.getByText(/123456 m²/i)).toBeInTheDocument();
    expect(modalUtils.getAllByText((_, node) =>
      !!node?.textContent?.includes("Search Points: 12")
    )[0]).toBeInTheDocument();
    expect(modalUtils.getAllByText((_, node) =>
      !!node?.textContent?.includes("Center: 25.761700, -80.191800")
    )[0]).toBeInTheDocument();
    expect(modalUtils.getAllByText((_, node) =>
      !!node?.textContent?.includes("Bounds: N: 26.0000, S: 25.5000")
    )[0]).toBeInTheDocument();
  });

  it("opens Logs Modal on button click and displays sync logs", async () => {
    mockedService.getCampusesWithSyncStatus.mockResolvedValueOnce(mockCampusesWithBoundary);
    mockedService.getSyncLogs.mockResolvedValueOnce({
      logs: [
        {
          _id: "log1",
          createdAt: new Date("2025-07-16T17:00:00Z"),
          last_sync_date: new Date("2025-07-16T17:00:00Z"),
          campus_id: {
            _id: "campus1",
            campus_name: "Test University",
          },
          sync_status: "completed",
          places_added: 10,
          places_updated: 5,
          places_removed: 3,
          sync_duration_ms: 1500,
          api_calls_used: 18,
          total_places_processed: 18,
          error_message: "",
        },
      ],
      pagination: {
        total: 1,
        limit: 50,
        offset: 0,
      },
    });
    renderWithProviders(<CampusSync />);
    await waitFor(() => {
      expect(screen.getByText("Test University")).toBeInTheDocument();
    });
    const viewLogsBtn = screen.getByRole("button", { name: /view logs/i });
    await userEvent.click(viewLogsBtn);
    const logsModal = await screen.findByRole("dialog");
    const modalUtils = within(logsModal);
    expect(modalUtils.getByText("Sync Logs")).toBeInTheDocument();
    ["Date", "Campus", "Status", "Added", "Updated", "Removed", "Duration"].forEach(header =>
      expect(modalUtils.getByText(header)).toBeInTheDocument()
    );
    expect(modalUtils.getByText("Test University")).toBeInTheDocument();
    expect(modalUtils.getByText("completed")).toBeInTheDocument();
    expect(modalUtils.getByText("10")).toBeInTheDocument();
    expect(modalUtils.getByText("5")).toBeInTheDocument();
    expect(modalUtils.getByText("3")).toBeInTheDocument();
    expect(modalUtils.getByText("1.5s")).toBeInTheDocument();
  });

  it("displays a loading spinner while campuses are being fetched", async () => {
    mockedService.getCampusesWithSyncStatus.mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<CampusSync />);
    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("displays an error alert if fetching campuses fails", async () => {
    mockedService.getCampusesWithSyncStatus.mockRejectedValueOnce(new Error("Network error"));
    renderWithProviders(<CampusSync />);
    const alert = await screen.findByTestId("campus-fetch-error");
    expect(alert).toHaveTextContent(/network error/i);
  });
});
