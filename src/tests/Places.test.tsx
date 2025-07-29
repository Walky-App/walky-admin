// src/tests/Places.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { DefaultOptions, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Places from "../pages/Places";



// ✅ MOCK the campusService and placeService
jest.mock("../services/campusService", () => ({
  campusService: {
    getAll: jest.fn(),
  },
}));
jest.mock("../services/placeService", () => ({
  placeService: {
    getAll: jest.fn(),
  },
}));

// ✅ Type-safe mocks
import { campusService } from "../services/campusService";
import { placeService } from "../services/placeService";
import userEvent from "@testing-library/user-event";
const mockedCampusService = campusService as jest.Mocked<typeof campusService>;
const mockedPlaceService = placeService as jest.Mocked<typeof placeService>;

// ✅ Mock data
const mockCampuses = [
  {
    id: "campus1",
    campus_name: "Test University",
    city: "Miami",
    state: "FL",
    zip: "33199",
    phone_number: "(305) 555-1234",
    address: "11200 SW 8th St, Miami, FL",
    time_zone: "America/New_York",
    is_active: true,
    image_url: "",
    dawn_to_dusk: [360, 1200],
    ambassador_ids: [],
  },
];

const mockPlacesData = {
  places: [
    {
      _id: "place1",
      place_id: "gplace1",
      id: "place1", // optional, for component safety
      name: "Library",
      type: "Education",
      address: "123 Library Ln",
      campus_id: "campus1",
      campus_name: "Test University",
      is_deleted: false,
      location: { lat: 25.7617, lng: -80.1918 },
    },
    {
      _id: "place2",
      place_id: "gplace2",
      id: "place2",
      name: "Dining Hall",
      type: "Food",
      address: "456 Eatery Blvd",
      campus_id: "campus1",
      campus_name: "Test University",
      is_deleted: false,
      location: { lat: 25.7627, lng: -80.1928 },
    },
  ],
  total: 2,
  page: 1,
  pages: 1,
  limit: 20,
};

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
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe("Walky Admin - Places Page", () => {
  beforeEach(() => {
    mockedCampusService.getAll.mockResolvedValue(mockCampuses);
    mockedPlaceService.getAll.mockResolvedValue({
      places: [],
      total: 0,
      page: 1,
      pages: 1,
      limit: 20,
    });
  });

  it("renders the Places page container with proper layout and spacing", async () => {
    renderWithProviders(<Places />);

    // Wait for the dropdown to populate
    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    // Page title
    expect(screen.getByText("Places Management")).toBeInTheDocument();

    // Refresh button
    expect(screen.getByRole("button", { name: /refresh/i })).toBeInTheDocument();
  });

  it("displays title/header: Places Management", async () => {
    renderWithProviders(<Places />);

    // Wait for campusService.getAll to resolve so the component finishes loading
    await waitFor(() => {
        expect(screen.getByText("Places Management")).toBeInTheDocument();
      });
    });

  it("renders campus dropdown and displays fetched campuses correctly", async () => {
    renderWithProviders(<Places />);

    // Wait for dropdown to populate
    const dropdown = await screen.findByRole("combobox");

    expect(dropdown).toBeInTheDocument();

    // Check options are rendered correctly
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(mockCampuses.length + 1); // includes default "Select a campus..." option

    // Verify formatted text
    expect(
      screen.getByRole("option", {
        name: "Test University - Miami, FL",
      })
    ).toBeInTheDocument();
  });

  it("renders Refresh button: disabled if no campus is selected, triggers refetch and shows alert", async () => {
    renderWithProviders(<Places />);

    const refreshButton = await screen.findByRole("button", { name: /refresh/i });

    // 🔹 Disabled when no campus is selected
    expect(refreshButton).toBeDisabled();

    // 🔹 Simulate campus selection
    const dropdown = screen.getByRole("combobox");
    await waitFor(() => {
      expect(dropdown).toBeInTheDocument();
    });

    // Fire change event
    await waitFor(() => {
      dropdown.focus();
      dropdown.scrollTop = 0;
    });
    await screen.findByText("Test University - Miami, FL");

    // Manually set selectedCampus and force refresh
    await screen.findByRole("button", { name: /refresh/i });


    await userEvent.selectOptions(screen.getByRole("combobox"), "campus1");


    // 🔹 Button becomes enabled
    const recheckButton = screen.getByRole("button", { name: /refresh/i });
    expect(recheckButton).toBeEnabled();

    // 🔹 Click refresh and expect "Refreshing..." alert
    recheckButton.click();

    await waitFor(() => {
      expect(screen.getByText(/refreshing places/i)).toBeInTheDocument();
    });
  });

  it("renders PlacesList panel only after campus selection, shows loading spinner, displays results, and calls placeService.getAll with filters", async () => {

    // Mock data responses
    mockedCampusService.getAll.mockResolvedValue(mockCampuses);
    mockedPlaceService.getAll.mockResolvedValue(mockPlacesData);

    mockedPlaceService.getAll.mockImplementation(() =>
      new Promise((resolve) =>
        setTimeout(() => resolve(mockPlacesData), 300) // ⏳ fake delay to show spinner
      )
    );

    renderWithProviders(<Places />);

    // 🔹 Places list should not be shown initially
    expect(screen.queryByText("Library")).not.toBeInTheDocument();

    // Wait for the specific campus option to be present before selecting
    await screen.findByRole("option", { name: "Test University - Miami, FL" });
    await userEvent.selectOptions(screen.getByRole("combobox"), "campus1");


    // 🔹 Show spinner while loading
    expect(await screen.findByText(/loading places/i)).toBeInTheDocument();

    // 🔹 Wait for places to render
    await waitFor(() => {
      expect(screen.getByText("Library")).toBeInTheDocument();
      expect(screen.getByText("Dining Hall")).toBeInTheDocument();
    });

    // 🔹 Pagination and total items
    expect(mockedPlaceService.getAll).toHaveBeenCalledWith(
      expect.objectContaining({
        campus_id: "campus1",
        page: 1,
        limit: 20,
      })
    );
  });

  it("displays alert if campus fetch fails", async () => {
    mockedCampusService.getAll.mockRejectedValueOnce(new Error("Campus API failed"));

    renderWithProviders(<Places />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/failed to load campuses/i);
  });

  it("displays alert if places fetch fails after campus selection", async () => {
    // ✅ Step 1: campus loads normally
    mockedCampusService.getAll.mockResolvedValue(mockCampuses);

    // ✅ Step 2: placeService fails only *after* a campus is selected
    mockedPlaceService.getAll.mockImplementation((filters) => {
      if (filters?.campus_id === "campus1") {
        return Promise.reject(new Error("Places API failed"));
      }
      return Promise.resolve(mockPlacesData);
    });


    renderWithProviders(<Places />);

    // ✅ Wait for dropdown option
    await screen.findByRole("option", { name: "Test University - Miami, FL" });

    // ✅ Select campus
    await userEvent.selectOptions(screen.getByRole("combobox"), "campus1");

    // ✅ Wait for the alert to appear
    const alert = await screen.findByText(/failed to load places/i);
    expect(alert).toBeInTheDocument();
  });

  it("displays info alert when Refresh button is clicked", async () => {
    mockedCampusService.getAll.mockResolvedValue(mockCampuses);
    mockedPlaceService.getAll.mockResolvedValue(mockPlacesData);

    renderWithProviders(<Places />);

    await screen.findByRole("option", { name: "Test University - Miami, FL" });
    await userEvent.selectOptions(screen.getByRole("combobox"), "campus1");

    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    await userEvent.click(refreshButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/refreshing places/i);
  });

  it('shows "Select a campus" prompt before any campus is selected', async () => {
    mockedCampusService.getAll.mockResolvedValue(mockCampuses);

    renderWithProviders(<Places />);

    // 🔍 Match heading flexibly
    const prompt = await screen.findByText(/select a campus to view places/i);
    expect(prompt).toBeInTheDocument();
  });

  it('shows "No places found" message after selecting campus with no results', async () => {
    mockedCampusService.getAll.mockResolvedValue(mockCampuses);

    mockedPlaceService.getAll.mockResolvedValueOnce({
      places: [],
      total: 0,
      page: 1,
      pages: 1,
      limit: 20,
    });

    renderWithProviders(<Places />);

    // Wait for and select campus
    await screen.findByRole("option", { name: "Test University - Miami, FL" });
    await userEvent.selectOptions(screen.getByRole("combobox"), "campus1");

    // Wait for fallback message
    expect(await screen.findByText("No places found")).toBeInTheDocument();
    expect(
      screen.getByText("There are no places associated with this campus.")
    ).toBeInTheDocument();
  });

  it("applies consistent CoreUI layout and responsiveness", async () => {
    mockedCampusService.getAll.mockResolvedValue(mockCampuses);
    mockedPlaceService.getAll.mockResolvedValue(mockPlacesData);

    renderWithProviders(<Places />);

    // 🛑 Wait for the dropdown option
    await screen.findByRole("option", { name: "Test University - Miami, FL" });

    // ✅ Select a campus
    await userEvent.selectOptions(screen.getByRole("combobox"), "campus1");

    // 🧪 Wait for table to appear (ensures PlacesList rendered)
    await screen.findByRole("table");

    // 🔹 Card layout
    expect(screen.getByText("Places Management").closest(".card-header")).toBeInTheDocument();
    expect(screen.getByText("Places Management").closest(".card")).toBeInTheDocument();

    // 🔹 Responsive columns
    const campusCol = screen.getByRole("combobox").closest(".col-md-6");
    expect(campusCol).toBeInTheDocument();

    const refreshCol = screen.getByRole("button", { name: /refresh/i }).closest(".col-md-3");
    expect(refreshCol).toBeInTheDocument();

    // 🔹 Table is rendered
    expect(screen.getByRole("table")).toBeInTheDocument();
  });


});
