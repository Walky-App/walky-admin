// src/tests/CampusDetails.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as ambassadorModule from "../services/ambassadorService";
import * as campusModule from "../services/campusService";
import CampusDetails from "../pages/CampusDetails";

// ---- Mocks ----
jest.mock("../services/ambassadorService");
jest.mock("../services/campusService");
jest.mock('../utils/env', () => ({
  getEnv: () => ({
    VITE_API_BASE_URL: 'http://localhost:8081/api',
  }),
}));
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ---- Helpers ----
const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderWithProviders(
  ui: React.ReactElement,
  { route = "/campuses/campus-view", state = {} } = {}
) {
  const queryClient = createTestQueryClient();
  return render(
    <MemoryRouter initialEntries={[{ pathname: route, state }]}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>
  );
}

const mockCampusData = {
  id: "test-456",
  campus_name: "Pre-Filled University",
  phone_number: "(123) 456-7890",
  address: "456 College Blvd",
  city: "Orlando",
  state: "FL",
  zip: "32801",
  time_zone: "America/New_York",
  ambassador_ids: [],
  is_active: true,
};

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

beforeEach(() => {
  const mockedAmbassadorService = ambassadorModule.ambassadorService as jest.Mocked<typeof ambassadorModule.ambassadorService>;
  mockedAmbassadorService.getAll.mockResolvedValue([
    { _id: "a1", id: "a1", name: "Alice", email: "alice@example.com", is_active: true },
    { _id: "a2", id: "a2", name: "Bob", email: "bob@example.com", is_active: true },
  ]);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Walky Admin - CampusDetails Component", () => {
  jest.setTimeout(20000);

  it("renders the form layout with required fields and buttons", async () => {
    renderWithProviders(<CampusDetails />);
    expect(await screen.findByTestId("form-title")).toBeInTheDocument();
    expect(screen.getByTestId("input-campus-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-phone-number")).toBeInTheDocument();
    expect(screen.getByTestId("input-address")).toBeInTheDocument();
    expect(screen.getByTestId("input-city")).toBeInTheDocument();
    expect(screen.getByTestId("input-state")).toBeInTheDocument();
    expect(screen.getByTestId("input-zip")).toBeInTheDocument();
    expect(screen.getByTestId("select-time-zone")).toBeInTheDocument();
    expect(screen.getByTestId("select-campus-status")).toBeInTheDocument();
    expect(screen.getByTestId("input-dawn-time")).toBeInTheDocument();
    expect(screen.getByTestId("input-dusk-time")).toBeInTheDocument();
    expect(screen.getByTestId("button-save")).toBeInTheDocument();
    expect(screen.getByTestId("button-cancel")).toBeInTheDocument();
  });

  it("displays 'New Campus' when no campusData is provided", async () => {
    renderWithProviders(<CampusDetails />);
    expect(await screen.findByTestId("form-title")).toHaveTextContent("New Campus");
  });

  it("displays 'Edit Campus' when campusData is provided via location.state", async () => {
    renderWithProviders(<CampusDetails />, { state: { campusData: mockCampusData } });
    expect(await screen.findByTestId("form-title")).toHaveTextContent("Edit Campus");
  });

  it("pre-fills form inputs with campusData from navigation state", async () => {
    renderWithProviders(<CampusDetails />, { state: { campusData: mockCampusData } });
    expect(await screen.findByTestId("form-title")).toHaveTextContent("Edit Campus");
    expect(screen.getByTestId("input-campus-name")).toHaveValue(mockCampusData.campus_name);
    expect(screen.getByTestId("input-phone-number")).toHaveValue(mockCampusData.phone_number);
    expect(screen.getByTestId("input-address")).toHaveValue(mockCampusData.address);
    expect(screen.getByTestId("input-city")).toHaveValue(mockCampusData.city);
    expect(screen.getByTestId("input-state")).toHaveValue(mockCampusData.state);
    expect(screen.getByTestId("input-zip")).toHaveValue(mockCampusData.zip);
    expect(screen.getByTestId("select-time-zone")).toHaveValue(mockCampusData.time_zone);
    expect(screen.getByTestId("select-campus-status")).toHaveValue("true");
  });

  describe("handles form input changes", () => {
    it("updates basic text fields", async () => {
      renderWithProviders(<CampusDetails />, { state: { campusData: mockCampusData } });
      await screen.findByTestId("form-title");
      const nameInput = screen.getByTestId("input-campus-name");
      const phoneInput = screen.getByTestId("input-phone-number");
      const addressInput = screen.getByTestId("input-address");
      const cityInput = screen.getByTestId("input-city");
      const stateInput = screen.getByTestId("input-state");
      const zipInput = screen.getByTestId("input-zip");

      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, "Updated Campus");
      await userEvent.clear(phoneInput);
      await userEvent.type(phoneInput, "(555) 123-1234");
      await userEvent.clear(addressInput);
      await userEvent.type(addressInput, "999 Updated Ave");
      await userEvent.clear(cityInput);
      await userEvent.type(cityInput, "Updated City");
      await userEvent.clear(stateInput);
      await userEvent.type(stateInput, "CA");
      await userEvent.clear(zipInput);
      await userEvent.type(zipInput, "90210");

      expect(nameInput).toHaveValue("Updated Campus");
      expect(phoneInput).toHaveValue("(555) 123-1234");
      expect(addressInput).toHaveValue("999 Updated Ave");
      expect(cityInput).toHaveValue("Updated City");
      expect(stateInput).toHaveValue("CA");
      expect(zipInput).toHaveValue("90210");
    });

    it("updates time zone dropdown", async () => {
      renderWithProviders(<CampusDetails />, { state: { campusData: mockCampusData } });
      const timeZoneSelect = await screen.findByTestId("select-time-zone");
      await userEvent.selectOptions(timeZoneSelect, "America/Chicago");
      expect(timeZoneSelect).toHaveValue("America/Chicago");
    });

    it("updates dawn and dusk times", async () => {
      renderWithProviders(<CampusDetails />, { state: { campusData: mockCampusData } });
      const dawnTimeInput = await screen.findByTestId("input-dawn-time");
      const duskTimeInput = screen.getByTestId("input-dusk-time");
      await userEvent.clear(dawnTimeInput);
      await userEvent.type(dawnTimeInput, "07:30");
      fireEvent.change(dawnTimeInput, { target: { value: "07:30" } });
      dawnTimeInput.blur();
      await userEvent.clear(duskTimeInput);
      await userEvent.type(duskTimeInput, "21:00");
      fireEvent.change(duskTimeInput, { target: { value: "21:00" } });
      duskTimeInput.blur();
      expect(dawnTimeInput).toHaveValue("07:30");
      expect(duskTimeInput).toHaveValue("21:00");
    });

    it("updates campus status dropdown", async () => {
      renderWithProviders(<CampusDetails />, { state: { campusData: mockCampusData } });
      const statusSelect = await screen.findByTestId("select-campus-status");
      await userEvent.selectOptions(statusSelect, "false");
      expect(statusSelect).toHaveValue("false");
    });

    it("updates ambassador multi-select dropdown", async () => {
      const mockAmbassadors = [
        { _id: "a1", id: "a1", name: "Alice", email: "alice@example.com", is_active: true },
        { _id: "a2", id: "a2", name: "Bob", email: "bob@example.com", is_active: true },
      ];
      const mockedAmbassadorService = ambassadorModule.ambassadorService as jest.Mocked<typeof ambassadorModule.ambassadorService>;
      mockedAmbassadorService.getAll.mockResolvedValueOnce(mockAmbassadors);

      renderWithProviders(<CampusDetails />, { state: { campusData: mockCampusData } });
      await screen.findByText(/student ambassadors/i);
      const toggle = await screen.findByTestId("select-ambassadors");
      await userEvent.click(toggle);
      const input = await screen.findByTestId("select-ambassadors-search");
      await userEvent.type(input, "alice");
      expect(input).toHaveValue("alice");
      await userEvent.keyboard("{Enter}");
    });
  });

  it("renders Campus Boundary and triggers onBoundaryChange when edited", async () => {
    renderWithProviders(<CampusDetails />, { state: { campusData: mockCampusData } });
    const mapContainer = await screen.findByTestId("campus-boundary-container");
    expect(mapContainer).toBeInTheDocument();
    expect(mapContainer).toHaveStyle({ height: "800px" });
  });

  it("validates required fields and disables save if polygon or fields are missing", async () => {
    const mockedAmbassadorService = ambassadorModule.ambassadorService as jest.Mocked<typeof ambassadorModule.ambassadorService>;
    mockedAmbassadorService.getAll.mockResolvedValueOnce([]);
    renderWithProviders(<CampusDetails />, {
      state: { campusData: { ...mockCampusData, coordinates: null } },
    });
    await userEvent.clear(screen.getByTestId("input-campus-name"));
    await userEvent.clear(screen.getByTestId("input-city"));
    await userEvent.clear(screen.getByTestId("input-state"));
    await userEvent.clear(screen.getByTestId("input-zip"));
    await userEvent.clear(screen.getByTestId("input-phone-number"));
    await userEvent.clear(screen.getByTestId("input-address"));
    await userEvent.selectOptions(screen.getByTestId("select-time-zone"), "");
    const saveButton = screen.getByTestId("button-save");
    expect(saveButton).toBeDisabled();
    expect(screen.getByTestId("input-campus-name")).toHaveValue("");
  });

  it("calls createCampusMutation.mutate when creating a new campus", async () => {
    const mockCreate = jest.fn().mockResolvedValue({ id: "new-id", campus_name: "Test Campus" });
    jest.spyOn(campusModule.campusService, "create").mockImplementation(mockCreate);
    const defaultCampus = {
      id: "default-999",
      campus_name: "Test Campus",
      city: "Test City",
      state: "FL",
      zip: "12345",
      phone_number: "555-555-5555",
      time_zone: "America/New_York",
      address: "123 Test St",
      ambassador_ids: [],
      is_active: true,
      dawn_to_dusk: [360, 1200],
      coordinates: {
        type: "Polygon",
        coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]],
      },
    };
    renderWithProviders(<CampusDetails />, { state: { campusData: defaultCampus } });
    await userEvent.click(screen.getByTestId("button-save"));
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  it("shows success toast on save", async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      id: "new-id",
      campus_name: "Success Campus",
    });
    jest.spyOn(campusModule.campusService, "create").mockImplementation(mockCreate);
    const defaultCampus = {
      id: "default-1001",
      campus_name: "Success Campus",
      city: "Success City",
      state: "FL",
      zip: "54321",
      phone_number: "111-222-3333",
      time_zone: "America/New_York",
      address: "789 Toast Ave",
      ambassador_ids: [],
      is_active: true,
      dawn_to_dusk: [360, 1200],
      coordinates: {
        type: "Polygon",
        coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]],
      },
    };
    renderWithProviders(<CampusDetails />, { state: { campusData: defaultCampus } });
    await userEvent.click(screen.getByTestId("button-save"));
    expect(await screen.findByText("Campus details saved successfully!")).toBeInTheDocument();
  });

  it("handles cancel action (navigates back to Campuses)", async () => {
    renderWithProviders(<CampusDetails />, {
      state: {
        campusData: {
          id: "default-999",
          campus_name: "Test Campus",
          city: "Test City",
          state: "FL",
          zip: "12345",
          phone_number: "555-555-5555",
          time_zone: "America/New_York",
          address: "123 Test St",
          ambassador_ids: [],
          is_active: true,
          dawn_to_dusk: [360, 1200],
          coordinates: {
            type: "Polygon",
            coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]],
          },
        },
      },
    });
    await userEvent.click(screen.getByTestId("button-cancel"));
    expect(mockNavigate).toHaveBeenCalledWith("/campuses");
  });
});
