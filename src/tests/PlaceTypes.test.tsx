// src/tests/PlaceTypes.test.tsx
import { render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import PlaceTypes from "../pages/PlaceTypes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { placeTypeService } from "../services/placeTypeService";


// Mock services
jest.mock("../services/placeTypeService", () => ({
  placeTypeService: {
    getAll: jest.fn().mockResolvedValue([]),
    getGoogleTypes: jest.fn().mockResolvedValue([]),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockPlaceTypes = [
  {
    _id: "1",
    name: "Library",
    description: "Quiet study area",
    google_types: ["library"],
    is_active: true,
    places_count: 2,
  },
  {
    _id: "2",
    name: "Dining Hall",
    description: "All things dining and food",
    google_types: ["restaurant"],
    is_active: true,
    places_count: 0,
  },
  {
    _id: "3",
    name: "Inactive Lounge",
    description: "Temporarily closed",
    google_types: ["bar"],
    is_active: false,
    places_count: 1,
  },
];



const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe("Walky Admin - Place Types Page", () => {

    beforeEach(() => {
        (placeTypeService.getAll as jest.Mock).mockImplementation(({ search, is_active }) => {
            let filtered = mockPlaceTypes;

            if (typeof is_active === "boolean") {
            filtered = filtered.filter((pt) => pt.is_active === is_active);
            }

            if (search) {
            filtered = filtered.filter(
                (pt) =>
                pt.name.toLowerCase().includes(search.toLowerCase()) ||
                pt.description?.toLowerCase().includes(search.toLowerCase())
            );
            }

            return Promise.resolve(filtered);
        });

        (placeTypeService.getGoogleTypes as jest.Mock).mockResolvedValue([]);
    });

      afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Place Types page with layout and CoreUI structure", async () => {
    renderWithClient(<PlaceTypes />);

    // ✅ Page container
    expect(await screen.findByTestId("place-types-page")).toBeInTheDocument();

    // ✅ Page title
    expect(screen.getByTestId("places-types-title")).toHaveTextContent("Place Types Management");

    // ✅ Add Place Type button
    expect(screen.getByTestId("add-place-type-button")).toBeInTheDocument();

    // ✅ Table container
    expect(screen.getByTestId("place-types-table")).toBeInTheDocument();
  });

  it("displays title/header: Place Types Management", async () => {
    renderWithClient(<PlaceTypes />);
    
    const title = await screen.findByTestId("places-types-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Place Types Management");
  });

  it("fetches place types from /place-types API with search and active toggle filters", async () => {
    const mockGetAll = placeTypeService.getAll as jest.Mock;

    renderWithClient(<PlaceTypes />);

    // Default query: no search, active only
    await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalledWith({
        search: undefined,
        is_active: true,
        });
    });

    // Toggle "Show inactive"
    const checkbox = await screen.findByLabelText(/show inactive/i);
    await userEvent.click(checkbox);

    // Wait for re-fetch with is_active: undefined
    await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalledWith({
        search: undefined,
        is_active: undefined,
        });
    });

    // Type in search input
    const input = screen.getByPlaceholderText(/search place types/i);
    await userEvent.type(input, "Dining");

    await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalledWith({
        search: "Dining",
        is_active: undefined,
        });
    });
  });

  it("filters place types by name or description using the search bar", async () => {
    renderWithClient(<PlaceTypes />);

    // Wait for initial data
    const input = await screen.findByPlaceholderText(/search place types/i);

    // Type a search term
    await userEvent.clear(input);
    await userEvent.type(input, "dining");

    // Should only see rows that match "dining"
    await waitFor(() => {
        const rows = screen.getAllByTestId(/^place-type-row-/);
        rows.forEach((row) => {
        expect(row).toHaveTextContent(/dining/i);
        });
    });
    });
    it('toggles visibility of inactive place types with "Show inactive" checkbox', async () => {
        renderWithClient(<PlaceTypes />);

        // Wait for initial data (only active by default)
        expect(await screen.findByText("Library")).toBeInTheDocument();
        expect(screen.queryByText("Inactive Lounge")).not.toBeInTheDocument();

        // Click the "Show inactive" checkbox
        const checkbox = screen.getByLabelText(/show inactive/i);
        await userEvent.click(checkbox);

        // Inactive item should now be visible
        expect(await screen.findByText("Inactive Lounge")).toBeInTheDocument();
        });

    it("renders correct table headers", async () => {
    renderWithClient(<PlaceTypes />);

    // Wait for the table to load
    await screen.findByTestId("place-types-table");

    const headers = screen.getByTestId("place-types-table-header");
    expect(headers).toHaveTextContent("Name");
    expect(headers).toHaveTextContent("Description");
    expect(headers).toHaveTextContent("Google Types");
    expect(headers).toHaveTextContent("Places Count");
    expect(headers).toHaveTextContent("Status");
    expect(headers).toHaveTextContent("Actions");
    });

    it("renders row data with up to 3 Google types, status badge, places count, and extra types summary", async () => {
        // Extend mockPlaceTypes[0] with more than 3 google_types
        const extendedMock = [
            {
            ...mockPlaceTypes[0],
            google_types: ["library", "university", "school", "book_store", "archive"],
            },
            mockPlaceTypes[1],
        ];

        // Override mock
        (placeTypeService.getAll as jest.Mock).mockResolvedValue(extendedMock);

        renderWithClient(<PlaceTypes />);

        const row = await screen.findByTestId("place-type-row-1");

        // ✅ Up to 3 individual type badges
        expect(screen.getByTestId("place-type-badge-library")).toBeInTheDocument();
        expect(screen.getByTestId("place-type-badge-university")).toBeInTheDocument();
        expect(screen.getByTestId("place-type-badge-school")).toBeInTheDocument();

        // ✅ "+X more" badge
        expect(screen.getByText("+2 more")).toBeInTheDocument();

        // ✅ Status badge
        expect(row).toHaveTextContent(/active/i);

        // ✅ Places count
        expect(row).toHaveTextContent("2");
        });

    it("renders form fields: name, description, active toggle, and Google types list", async () => {
        renderWithClient(<PlaceTypes />);

        await userEvent.click(screen.getByTestId("add-place-type-button"));
        const modal = await screen.findByRole("dialog");

        expect(within(modal).getByLabelText(/name/i)).toBeInTheDocument();
        expect(within(modal).getByLabelText(/description/i)).toBeInTheDocument();
        expect(within(modal).getByLabelText(/active/i)).toBeInTheDocument();
        expect(within(modal).getByText(/select google place types/i)).toBeInTheDocument();
        });

    it("displays scrollable list of Google types", async () => {
        (placeTypeService.getGoogleTypes as jest.Mock).mockResolvedValue([
            { type: "library", places_count: 2 },
            { type: "restaurant", places_count: 5 },
            { type: "book_store", places_count: 1 },
        ]);

        renderWithClient(<PlaceTypes />);
        await userEvent.click(screen.getByTestId("add-place-type-button"));

        const modal = await screen.findByRole("dialog");

        // Limit queries to the modal so we don’t pick up table values
        expect(within(modal).getByText("Library")).toBeInTheDocument();
        expect(within(modal).getByText("Restaurant")).toBeInTheDocument();
        });

        it('shows "Selected types" summary after selecting types', async () => {
    // Provide some mock Google types
    (placeTypeService.getGoogleTypes as jest.Mock).mockResolvedValue([
        { type: "library", places_count: 2 },
        { type: "book_store", places_count: 3 },
    ]);

    renderWithClient(<PlaceTypes />);

    // Open modal
    await userEvent.click(screen.getByTestId("add-place-type-button"));

    const modal = await screen.findByTestId("create-edit-modal");

    // Click to select a couple Google types
        const libraryWrapper = within(modal).getByText("Library").closest("div.p-2");
        const bookstoreWrapper = within(modal).getByText("Book Store").closest("div.p-2");

        await userEvent.click(libraryWrapper!);
        await userEvent.click(bookstoreWrapper!);


    // Check for selected types summary
    const summary = await within(modal).findByTestId("selected-types-summary");

    // Check badge text
    expect(summary).toHaveTextContent("library");
    expect(summary).toHaveTextContent("book store");
    });

    it("shows validation error if name is missing", async () => {
    (placeTypeService.getGoogleTypes as jest.Mock).mockResolvedValue([
        { type: "library", places_count: 1 },
    ]);

    renderWithClient(<PlaceTypes />);

    await userEvent.click(screen.getByTestId("add-place-type-button"));
    const modal = await screen.findByTestId("create-edit-modal");

    // Don't type a name
    // Select a Google type
    const wrapper = within(modal).getByText("Library").closest("div.p-2");
    await userEvent.click(wrapper!);

    // Try submitting
    const submitBtn = within(modal).getByRole("button", { name: /create/i });
    await userEvent.click(submitBtn);

    // Should still be on modal (not closed)
    expect(modal).toBeInTheDocument();

    // Name input should be invalid
    const nameInput = within(modal).getByLabelText(/name/i);
    expect(nameInput).toBeInvalid();
    });

    it("shows validation warning if no Google types selected", async () => {
    (placeTypeService.getGoogleTypes as jest.Mock).mockResolvedValue([
        { type: "library", places_count: 1 },
    ]);

    renderWithClient(<PlaceTypes />);

    await userEvent.click(screen.getByTestId("add-place-type-button"));
    const modal = await screen.findByTestId("create-edit-modal");

    // Fill in name
    const nameInput = within(modal).getByLabelText(/name/i);
    await userEvent.type(nameInput, "Test Type");

    // Don’t select any Google type

    // Try submitting
    const submitBtn = within(modal).getByRole("button", { name: /create/i });
    await userEvent.click(submitBtn);

    // Should still be on modal
    expect(modal).toBeInTheDocument();

    // Warning alert should be visible
    expect(
        within(modal).getByText(/please select at least one google place type/i)
    ).toBeInTheDocument();

    // Button should be disabled
    expect(submitBtn).toBeDisabled();
    });


    it("shows validation warning if no Google types selected", async () => {
    (placeTypeService.getGoogleTypes as jest.Mock).mockResolvedValue([
        { type: "library", places_count: 1 },
    ]);

    renderWithClient(<PlaceTypes />);

    await userEvent.click(screen.getByTestId("add-place-type-button"));
    const modal = await screen.findByTestId("create-edit-modal");

    // Fill in name
    const nameInput = within(modal).getByLabelText(/name/i);
    await userEvent.type(nameInput, "Test Type");

    // Don’t select any Google type

    // Try submitting
    const submitBtn = within(modal).getByRole("button", { name: /create/i });
    await userEvent.click(submitBtn);

    // Should still be on modal
    expect(modal).toBeInTheDocument();

    // Warning alert should be visible
    expect(
        within(modal).getByText(/please select at least one google place type/i)
    ).toBeInTheDocument();

    // Button should be disabled
    expect(submitBtn).toBeDisabled();
    });



it("triggers create mutation with correct data", async () => {
  const createMock = placeTypeService.create as jest.Mock;
  createMock.mockResolvedValueOnce({}); // pretend it worked 🎭

  (placeTypeService.getGoogleTypes as jest.Mock).mockResolvedValue([
    { type: "library", places_count: 1 },
  ]);

  renderWithClient(<PlaceTypes />);

  // Open the modal
  await userEvent.click(screen.getByTestId("add-place-type-button"));
  const modal = await screen.findByTestId("create-edit-modal");

  // 🚨 Use fireEvent to set name value instantly and correctly
  const nameInput = within(modal).getByLabelText(/name/i);
  fireEvent.change(nameInput, { target: { value: "Study Spots" } });

  await waitFor(() => {
    expect(nameInput).toHaveValue("Study Spots");
  });

  // Select Google type
  const wrapper = within(modal).getByText("Library").closest("div.p-2");
  await userEvent.click(wrapper!);

  // Submit
  const submitBtn = within(modal).getByRole("button", { name: /create/i });
  await userEvent.click(submitBtn);

  // Assert correct payload
  await waitFor(() => {
    expect(createMock).toHaveBeenCalledWith({
      name: "Study Spots",
      description: "",
      google_types: ["library"],
      is_active: true,
    });
  });
});


    it("triggers update mutation with correct data", async () => {
  const updateMock = placeTypeService.update as jest.Mock;
  updateMock.mockResolvedValueOnce({});

  (placeTypeService.getGoogleTypes as jest.Mock).mockResolvedValue([
    { type: "library", places_count: 1 },
    { type: "book_store", places_count: 3 },
  ]);

  (placeTypeService.getAll as jest.Mock).mockResolvedValueOnce([
    {
      _id: 1,
      name: "Library",
      description: "Quiet study area",
      is_active: true,
      google_types: ["library"],
      places_count: 2,
    },
  ]);

  renderWithClient(<PlaceTypes />);

  const editBtn = await screen.findByTestId("edit-place-type-button-1");
  await userEvent.click(editBtn);

  const modal = await screen.findByTestId("create-edit-modal");

  const nameInput = within(modal).getByLabelText(/name/i);
  fireEvent.change(nameInput, { target: { value: "Updated Library" } });

  await waitFor(() => {
    expect(nameInput).toHaveValue("Updated Library");
  });

  // Find the "Book Store" text and click its parent container
  const bookStoreText = within(modal).getByText("Book Store");
  const bookStoreContainer = bookStoreText.closest('div[style*="cursor: pointer"]');
  await userEvent.click(bookStoreContainer!);

  // Wait for the checkbox to be checked
  await waitFor(() => {
    const bookStoreCheckbox = within(modal).getByTestId("google-type-book_store") as HTMLInputElement;
    expect(bookStoreCheckbox.checked).toBe(true);
  });

  // Confirm the badge summary also reflects the change
  await waitFor(() => {
    const summary = screen.getByTestId("selected-types-summary");
    expect(summary.textContent?.toLowerCase()).toContain("book store");
  });

  const submitBtn = within(modal).getByRole("button", { name: /update/i });
  await userEvent.click(submitBtn);

  await waitFor(() => {
    expect(updateMock).toHaveBeenCalledTimes(1);
    expect(updateMock).toHaveBeenCalledWith(1, {
      name: "Updated Library",
      description: "Quiet study area",
      is_active: true,
      google_types: ["library", "book_store"],
    });
  });
});

it("shows success alert when update mutation succeeds", async () => {
  const updateMock = placeTypeService.update as jest.Mock;
  updateMock.mockResolvedValueOnce({}); // ✅ simulate success

  (placeTypeService.getGoogleTypes as jest.Mock).mockResolvedValue([
    { type: "library", places_count: 1 },
  ]);

  (placeTypeService.getAll as jest.Mock).mockResolvedValueOnce([
    {
      _id: 1,
      name: "Library",
      description: "Quiet study area",
      is_active: true,
      google_types: ["library"],
      places_count: 2,
    },
  ]);

  renderWithClient(<PlaceTypes />);

  const editBtn = await screen.findByTestId("edit-place-type-button-1");
  await userEvent.click(editBtn);
  const modal = await screen.findByTestId("create-edit-modal");

  const nameInput = within(modal).getByLabelText(/name/i);
  fireEvent.change(nameInput, { target: { value: "Updated Library" } });

  const submitBtn = within(modal).getByRole("button", { name: /update/i });
  await userEvent.click(submitBtn);

  await waitFor(() => {
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/place type updated successfully/i);
  });
});

it("shows error alert when update mutation fails", async () => {
  const updateMock = placeTypeService.update as jest.Mock;
  updateMock.mockRejectedValueOnce(new Error("Update failed")); // ❌ simulate failure

  (placeTypeService.getGoogleTypes as jest.Mock).mockResolvedValue([
    { type: "library", places_count: 1 },
  ]);

  (placeTypeService.getAll as jest.Mock).mockResolvedValueOnce([
    {
      _id: 1,
      name: "Library",
      description: "Quiet study area",
      is_active: true,
      google_types: ["library"],
      places_count: 2,
    },
  ]);

  renderWithClient(<PlaceTypes />);

  const editBtn = await screen.findByTestId("edit-place-type-button-1");
  await userEvent.click(editBtn);
  const modal = await screen.findByTestId("create-edit-modal");

  const nameInput = within(modal).getByLabelText(/name/i);
  fireEvent.change(nameInput, { target: { value: "Updated Library" } });

  const submitBtn = within(modal).getByRole("button", { name: /update/i });
  await userEvent.click(submitBtn);

  await waitFor(() => {
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/failed to update place type/i);
  });
});

it("shows delete confirmation modal with place count warning", async () => {
  (placeTypeService.getAll as jest.Mock).mockResolvedValueOnce([
    {
      _id: 1,
      name: "Library",
      description: "Quiet study area",
      is_active: true,
      google_types: ["library"],
      places_count: 2, // important
    },
  ]);

  renderWithClient(<PlaceTypes />);
  const deleteBtn = await screen.findByTestId("delete-place-type-button-1");
  await userEvent.click(deleteBtn);

  const modal = await screen.findByTestId("delete-confirmation-modal");

  expect(
    within(modal).getByText(/are you sure you want to delete/i)
  ).toBeInTheDocument();

  expect(
    within(modal).getByText((text) =>
      text.toLowerCase().includes("this place type is currently used by") &&
      text.includes("2")
    )
  ).toBeInTheDocument();
});

it("triggers delete mutation when confirmed", async () => {
  const deleteMock = placeTypeService.delete as jest.Mock;
  deleteMock.mockResolvedValueOnce({}); // success

  (placeTypeService.getAll as jest.Mock).mockResolvedValueOnce([
    {
      _id: 1,
      name: "Library",
      description: "Quiet study area",
      is_active: true,
      google_types: ["library"],
      places_count: 0,
    },
  ]);

  renderWithClient(<PlaceTypes />);
  const deleteBtn = await screen.findByTestId("delete-place-type-button-1");
  await userEvent.click(deleteBtn);

  const modal = await screen.findByTestId("delete-confirmation-modal");
  const confirmBtn = within(modal).getByRole("button", { name: /delete/i });
  await userEvent.click(confirmBtn);

  await waitFor(() => {
    expect(deleteMock).toHaveBeenCalledWith(1);
  });
});

it("shows success alert when delete succeeds", async () => {
  const deleteMock = placeTypeService.delete as jest.Mock;
  deleteMock.mockResolvedValueOnce({});

  (placeTypeService.getAll as jest.Mock).mockResolvedValueOnce([
    {
      _id: 1,
      name: "Library",
      description: "Quiet study area",
      is_active: true,
      google_types: ["library"],
      places_count: 0,
    },
  ]);

  renderWithClient(<PlaceTypes />);
  await userEvent.click(await screen.findByTestId("delete-place-type-button-1"));

  const modal = await screen.findByTestId("delete-confirmation-modal");
  await userEvent.click(within(modal).getByRole("button", { name: /delete/i }));

  await waitFor(() => {
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/place type deleted successfully/i);
  });
});

it("shows error alert when delete fails", async () => {
  const deleteMock = placeTypeService.delete as jest.Mock;
  deleteMock.mockRejectedValueOnce(new Error("oh no"));

  (placeTypeService.getAll as jest.Mock).mockResolvedValueOnce([
    {
      _id: 1,
      name: "Library",
      description: "Quiet study area",
      is_active: true,
      google_types: ["library"],
      places_count: 0,
    },
  ]);

  renderWithClient(<PlaceTypes />);
  await userEvent.click(await screen.findByTestId("delete-place-type-button-1"));

  const modal = await screen.findByTestId("delete-confirmation-modal");
  await userEvent.click(within(modal).getByRole("button", { name: /delete/i }));

  await waitFor(() => {
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/failed to delete/i);
  });
});

it("shows fallback message when no place types are available", async () => {
  (placeTypeService.getAll as jest.Mock).mockResolvedValueOnce([]); // empty list
  renderWithClient(<PlaceTypes />);

  const tableBody = await screen.findByTestId("place-types-table");
  expect(tableBody).toBeInTheDocument();

  // Match "No place types found" message or whatever your fallback says
  expect(screen.getByText(/no place types found/i)).toBeInTheDocument();
});

it("shows loading spinner while fetching data", async () => {
  // Delay resolution to give spinner time to show
  let resolveGetAll: (value: any) => void;
  const getAllPromise = new Promise((res) => {
    resolveGetAll = res;
  });

  (placeTypeService.getAll as jest.Mock).mockReturnValueOnce(getAllPromise);
  renderWithClient(<PlaceTypes />);

  // Spinner should be present before promise resolves
  expect(screen.getByTestId("places-types-loading")).toBeInTheDocument();

  // Now resolve the promise
  resolveGetAll!([]);

  // Wait for spinner to disappear
  await waitFor(() => {
    expect(screen.queryByTestId("places-types-loading")).not.toBeInTheDocument();
  });
});

});

