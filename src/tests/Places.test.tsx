// src/tests/Places.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import Places from "../pages/Places";

jest.mock('../utils/env', () => ({
  getEnv: () => ({
    VITE_API_BASE_URL: 'http://localhost:8081/api',
  }),
}));

jest.mock("../services/campusService", () => ({
  campusService: {
    getAll: jest.fn().mockResolvedValue([
      { id: "campus1", campus_name: "Main Campus", city: "Miami", state: "FL" },
    ]),
  },
}));


jest.mock("../services/placeService", () => ({
  placeService: {
    getAll: jest.fn(),
  },
}));

import { campusService } from "../services/campusService";
import { placeService } from "../services/placeService";


const mockedCampusService = campusService as jest.Mocked<typeof campusService>;
const mockedPlaceService = placeService as jest.Mocked<typeof placeService>;

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
      id: "place1",
      name: "Library",
      type: "Education",
      address: "123 Library Ln",
      campus_id: "campus1",
      campus_name: "Test University",
      is_deleted: false,
      location: { lat: 25.7617, lng: -80.1918 },
    },
  ],
  total: 1,
  page: 1,
  pages: 1,
  limit: 20,
};

const testQueryOptions = {
  queries: {
    retry: false,
    staleTime: 0,
    cacheTime: 0,
  },
};

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: testQueryOptions });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};



describe("Walky Admin - Places Page", () => {

    beforeEach(() => {
    mockedCampusService.getAll.mockResolvedValue(mockCampuses);
    mockedPlaceService.getAll.mockResolvedValue(mockPlacesData);
  });


  it("renders initial layout and selects campus", async () => {
    renderWithProviders(<Places />);

    await screen.findByTestId("campus-select");
    expect(screen.getByTestId("places-page-title")).toHaveTextContent("Places Management");

    const select = screen.getByTestId("campus-select");
    await userEvent.selectOptions(select, "campus1");
    expect(select).toHaveValue("campus1");
  });

  it("renders hierarchy view dropdown and switches view", async () => {
  renderWithProviders(<Places />);

  await waitFor(() => {
    const select = screen.getByTestId("campus-select");
    expect(select).not.toBeDisabled();
    expect(screen.getByRole("option", { name: /Test University - Miami, FL/i })).toBeInTheDocument();
  });

  await userEvent.selectOptions(screen.getByTestId("campus-select"), "campus1");

  const hierarchyDropdown = screen.getByTestId("hierarchy-view-select");
  expect(hierarchyDropdown).toBeInTheDocument();

  await userEvent.selectOptions(hierarchyDropdown, "all");
  expect(hierarchyDropdown).toHaveValue("all");
});

it("shows loading spinner when places are loading", async () => {
  mockedPlaceService.getAll.mockImplementation(
    () => new Promise((resolve) => setTimeout(() => resolve(mockPlacesData), 300))
  );

  renderWithProviders(<Places />);

  await waitFor(() => expect(screen.getByTestId("campus-select")).not.toBeDisabled());

  await waitFor(() =>
    expect(screen.getByRole("option", { name: /Test University - Miami, FL/i })).toBeInTheDocument()
  );

  await userEvent.selectOptions(screen.getByTestId("campus-select"), "campus1");

  expect(await screen.findByTestId("loading-places")).toBeInTheDocument();
});

it("displays alert on refresh", async () => {
  renderWithProviders(<Places />);

  await waitFor(() => expect(screen.getByTestId("campus-select")).not.toBeDisabled());

  await waitFor(() =>
    expect(screen.getByRole("option", { name: /Test University - Miami, FL/i })).toBeInTheDocument()
  );

  await userEvent.selectOptions(screen.getByTestId("campus-select"), "campus1");

  const refreshBtn = await screen.findByTestId("refresh-button");
  await userEvent.click(refreshBtn);

  const alert = await screen.findByTestId("refresh-alert");
  expect(alert).toHaveTextContent(/refreshing places/i);
});

  it("shows no places message when API returns empty", async () => {
    // Override the mock for this test only to return empty places for campus1
    mockedPlaceService.getAll.mockImplementation((filters) => {
    if (filters?.campus_id === "campus1") {
      return Promise.resolve({
        places: [],
        total: 0,
        page: 1,
        pages: 1,
        limit: 20,
      });
    }
    return Promise.resolve(mockPlacesData);
  });

    renderWithProviders(<Places />);

    const campusSelect = await screen.findByTestId("campus-select");
    await userEvent.selectOptions(campusSelect, "campus1");

    await waitFor(() => {
      expect(screen.getByTestId("empty-prompt-no-places")).toBeInTheDocument();
    });
  });

  it("shows empty state when no campus selected", async () => {
    renderWithProviders(<Places />);

    const emptyPrompt = await screen.findByTestId("empty-prompt-select-campus");
    expect(emptyPrompt).toBeInTheDocument();
  });

});
