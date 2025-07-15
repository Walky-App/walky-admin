// src/tests/CampusTable.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Campuses from "../pages/Campuses";
import * as campusService from "../services/campusService";
import { Campus } from "../types/campus";

const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  

export function renderWithProviders(ui: React.ReactElement) {
    const queryClient = createTestQueryClient();
    
    return render(
        <BrowserRouter>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
        </BrowserRouter>
    );
}

// Mock campus data
const mockCampuses: Campus[] = [
    {
      id: "1",
      campus_name: "Test University",
      city: "Miami",
      state: "FL",
      zip: "33101",
      phone_number: "123-456-7890",
      address: "123 College Ave",
      image_url: "https://example.com/logo.png",
      time_zone: "America/New_York",
      is_active: true,
      coordinates: undefined, // optional — fine as null
      ambassador_ids: [], // optional
      created_by: "admin",
      school_id: "school_123",
      geofenceCount: 3,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
      // legacy fields for compatibility
      name: "Test University",
      location: "Miami, FL",
      logo: "https://example.com/logo.png",
      status: "active",
      campus_short_name: "TU",
    },
  ];
  

jest.spyOn(campusService.campusService, "getAll").mockResolvedValue(mockCampuses);

describe("Walky Admin - CampusTable Component", () => {
  it("fetches and displays campus data from /campuses API", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Campuses />
        </BrowserRouter>
      </QueryClientProvider>
    );

    // Wait for campus row to appear
    await waitFor(() =>
      expect(screen.getByText("Test University")).toBeInTheDocument()
    );

    expect(screen.getByText("Miami, FL")).toBeInTheDocument();
    expect(screen.getByText("123 College Ave")).toBeInTheDocument();
    expect(screen.getByText("Miami, FL")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders correct table headers", async () => {
    renderWithProviders(<Campuses />); // or CampusTable if you're isolating
  
    expect(await screen.findByRole("columnheader", { name: "Campus" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Location" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Address" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Status" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Actions" })).toBeInTheDocument();
  });

  it("displays each row with campus name, ID, location, address, status, and actions", async () => {
    renderWithProviders(<Campuses />);
  
    // Wait for the row to appear
    const campusName = await screen.findByText("Test University");
    expect(campusName).toBeInTheDocument();
  
    // Shortened ID preview (first 8 chars of ID)
    expect(screen.getByText(/^ID: 1\.\.\.$/)).toBeInTheDocument(); // Adjust regex if needed
  
    // Location
    expect(screen.getByText("Miami, FL")).toBeInTheDocument();
  
    // Full address
    expect(screen.getByText("123 College Ave")).toBeInTheDocument();
  
    // Status badge
    expect(screen.getByText("Active")).toBeInTheDocument();
  
    // Action buttons (Edit & Delete)
    expect(screen.getByTestId("edit-campus-1")).toBeInTheDocument();
    expect(screen.getByTestId("delete-campus-1")).toBeInTheDocument();
  });
  
  it("displays the Campus Boundary map with polygon boundaries and toggle buttons", async () => {
    renderWithProviders(<Campuses />);
  
    const campusRow = await screen.findByText("Test University");
    campusRow.click();
  
    const mapContainer = await screen.findByTestId("campus-boundary-map-1");
    expect(mapContainer).toBeInTheDocument();
  
    // Wait for spinner to disappear if needed
    await waitFor(() => {
      expect(
        screen.queryByRole("status", { name: /loading/i })
      ).not.toBeInTheDocument();
    });
  
    // Check that "Campus Boundary" heading appears (or another visible indicator)
    expect(
      screen.getByRole("heading", { name: /campus boundary/i })
    ).toBeInTheDocument();
  
    // Check for toggle buttons
    expect(screen.getByRole("button", { name: /map/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /satellite/i })).toBeInTheDocument();
  });
  
  
});
