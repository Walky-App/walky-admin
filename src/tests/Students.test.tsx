// src/tests/Students.test.tsx
import { render, screen } from '@testing-library/react'
import Students from '../pages/Students'
import { MemoryRouter } from 'react-router-dom'

// Mock the API module
jest.mock('../API')

// Mock the env module to avoid import.meta.env issues
jest.mock('../utils/env', () => ({
  getEnv: () => ({
    VITE_API_BASE_URL: 'http://localhost:8081/api',
  }),
}))

// Import the mocked module to access the mock function
import API from '../API'

describe('Walky Admin - Students Page', () => {
  beforeEach(() => {
    // Set up default mock responses for all API calls
    (API.get as jest.Mock).mockImplementation((url: string) => {
      switch (url) {
        case "/users/?fields=_id,first_name,last_name,email,createdAt,updatedAt":
          return Promise.resolve({
            data: {
              users: [
                {
                  _id: "1",
                  first_name: "Alice",
                  last_name: "Doe",
                  email: "alice@example.com",
                  createdAt: "2023-01-01T00:00:00Z",
                  updatedAt: "2023-01-05T00:00:00Z",
                },
              ],
            },
          });
        case "/users/count":
          return Promise.resolve({ data: { totalUsersCreated: 139 } });
        case "/age/average":
          return Promise.resolve({ data: { averageAge: 27.4 } });
        case "/language/count":
          return Promise.resolve({ data: { totalUniqueLanguages: 23 } });
        case "/users/parent-count":
          return Promise.resolve({ data: { parentUsersCount: 13 } });
        default:
          return Promise.resolve({ data: {} });
      }
    });
  })

  it('renders all 4 stat widgets', async () => {
    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    )

    // Verify all stat widgets are rendered
    expect(await screen.findByTestId('total-students')).toBeInTheDocument()
    expect(await screen.findByTestId('average-age')).toBeInTheDocument()
    expect(await screen.findByTestId('languages')).toBeInTheDocument()
    expect(await screen.findByTestId('parents')).toBeInTheDocument()
  })

  it("uses correct API calls to fetch stats", async () => {
    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    );
  
    // Wait for any one stat to appear to ensure useEffect finished
    await screen.findByTestId("total-students");
  
    // Verify that all expected API endpoints are called
    expect(API.get).toHaveBeenCalledWith("/users/count");
    expect(API.get).toHaveBeenCalledWith("/age/average");
    expect(API.get).toHaveBeenCalledWith("/language/count");
    expect(API.get).toHaveBeenCalledWith("/users/parent-count");
  });

  it("displays fallback (—) if API fails or data is missing", async () => {
    // Override the mock to simulate different failure scenarios
    (API.get as jest.Mock).mockImplementation((url: string) => {
      switch (url) {
        case "/users/count":
          return Promise.reject(new Error("Network error")); // API call fails
        case "/age/average":
          return Promise.resolve({}); // Missing .data property
        case "/language/count":
          return Promise.resolve({ data: {} }); // Missing totalUniqueLanguages property
        case "/users/parent-count":
          return Promise.resolve({ data: { parentUsersCount: 13 } }); // Normal response
        default:
          return Promise.resolve({ data: {} });
      }
    });
  
    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    );
  
    // Wait for UI to settle and verify fallback behavior
    const total = await screen.findByTestId("total-students");
    const age = await screen.findByTestId("average-age");
    const langs = await screen.findByTestId("languages");
    const parents = await screen.findByTestId("parents");
  
    // Verify fallback values are displayed for failed/missing data
    expect(total).toHaveTextContent("—");     // Failed request shows fallback
    expect(age).toHaveTextContent("—");       // Missing .data shows fallback
    expect(langs).toHaveTextContent("—");     // Missing property shows fallback
    expect(parents).toHaveTextContent("13");  // Normal response shows actual value
  });
})
