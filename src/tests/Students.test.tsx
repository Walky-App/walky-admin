// src/tests/Students.test.tsx
import { render, screen } from '@testing-library/react'
import Students from '../pages/Students'
import { MemoryRouter } from 'react-router-dom'
import API from '../API'

// Mock the API module to return dummy data for <StudentTable /> and stat widgets
jest.mock("../API/", () => {
    const get = jest.fn((url: string) => {
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
  
    return { get };
  });
  

describe('Walky Admin - Students Page', () => {
  it('renders all 4 stat widgets', async () => {
    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    )

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
  
    // Assert that API.get was called with correct endpoints
    expect(API.get).toHaveBeenCalledWith("/users/count");
    expect(API.get).toHaveBeenCalledWith("/age/average");
    expect(API.get).toHaveBeenCalledWith("/language/count");
    expect(API.get).toHaveBeenCalledWith("/users/parent-count");
  });

  it("displays fallback (—) if API fails or data is missing", async () => {
    // Override the mock to simulate failures/missing data
    const mockGet = jest.fn((url: string) => {
      switch (url) {
        case "/users/count":
          return Promise.reject(new Error("Network error")); // fails
        case "/age/average":
          return Promise.resolve({}); // missing .data
        case "/language/count":
          return Promise.resolve({ data: {} }); // missing totalUniqueLanguages
        case "/users/parent-count":
          return Promise.resolve({ data: { parentUsersCount: 13 } }); // normal
        default:
          return Promise.resolve({ data: {} });
      }
    });
  
    // Replace the original mock
    (API.get as jest.Mock) = mockGet;
  
    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    );
  
    // Wait for UI to settle
    const total = await screen.findByTestId("total-students");
    const age = await screen.findByTestId("average-age");
    const langs = await screen.findByTestId("languages");
    const parents = await screen.findByTestId("parents");
  
    expect(total).toHaveTextContent("—");     // failed request
    expect(age).toHaveTextContent("—");       // missing .data
    expect(langs).toHaveTextContent("—");     // undefined value
    expect(parents).toHaveTextContent("13");  // fallback not triggered
  });
  
})
