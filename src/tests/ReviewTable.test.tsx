// src/tests/ReviewTable.test.tsx
import { render, screen, act } from '@testing-library/react'
import ReviewTable from '../components/ReviewTable'
import { MemoryRouter } from 'react-router-dom'
import API from '../API'
import userEvent from '@testing-library/user-event'

// Mock API
jest.mock('../API')
const mockedAPI = jest.mocked(API)

describe('Walky Admin - ReviewTable Component', () => {
  beforeEach(() => {
    mockedAPI.get.mockResolvedValue({
      data: {
        users: [
          {
            _id: 'r1',
            first_name: 'Jane',
            last_name: 'Doe',
            reason: 'Inappropriate behavior',
            createdAt: '2023-04-30T00:00:00Z',
            reportedOn: '2023-05-09T00:00:00Z',
          },
        ],
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('fetches and displays rows from /users API with required fields', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ReviewTable />
        </MemoryRouter>
      )
    })
  
    // Wait for the row
    await screen.findByTestId('review-row')
  
    expect(screen.getByTestId('review-id')).toHaveTextContent('r1')
    expect(screen.getByTestId('review-name')).toHaveTextContent('Jane Doe')
    expect(screen.getByTestId('review-reason')).toHaveTextContent('Inappropriate behavior')
    expect(screen.getByTestId('review-joined')).toHaveTextContent('Apr 30, 2023')
    expect(screen.getByTestId('review-reported')).toHaveTextContent('May 9, 2023')
  
    expect(mockedAPI.get).toHaveBeenCalledWith(
      '/users/?fields=_id,first_name,last_name,reason,createdAt,reportedOn'
    )
  })

  it('transforms API data into readable table format', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ReviewTable />
        </MemoryRouter>
      )
    })
  
    // Wait for the table row to load
    await screen.findByTestId('review-row')
  
    // Check name is full name (first + last)
    expect(screen.getByTestId('review-name')).toHaveTextContent('Jane Doe')
  
    // Check formatted dates
    expect(screen.getByTestId('review-joined')).toHaveTextContent('Apr 30, 2023')
    expect(screen.getByTestId('review-reported')).toHaveTextContent('May 9, 2023')
  })
  
  it('renders correct table headers', () => {
    render(
      <MemoryRouter>
        <ReviewTable />
      </MemoryRouter>
    )
  
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Reason')).toBeInTheDocument()
    expect(screen.getByText('Joined')).toBeInTheDocument()
    expect(screen.getByText('Reported On')).toBeInTheDocument()
  
    // Optional: check number of headers (6 total, last is blank)
    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(6)
  })  
  
  it('renders dropdown menu with correct actions for each row', async () => {
    render(
      <MemoryRouter>
        <ReviewTable />
      </MemoryRouter>
    )
  
    // Click the ⋮ dropdown toggle for the first row
    const toggle = await screen.findByTestId('dropdown-toggle-r1')
    await userEvent.click(toggle)
  
    // Check for each dropdown item
    expect(screen.getByTestId('send-email-r1')).toBeInTheDocument()
    expect(screen.getByTestId('view-logs-r1')).toBeInTheDocument()
    expect(screen.getByTestId('suspend-r1')).toBeInTheDocument()
    expect(screen.getByTestId('delete-r1')).toBeInTheDocument()
  })
  
  it('displays fallback (—) if reason is missing', async () => {
    // Override mock data with missing reason
    mockedAPI.get.mockResolvedValueOnce({
      data: {
        users: [
          {
            _id: 'x1',
            first_name: 'No',
            last_name: 'Reason',
            reason: null, // missing
            createdAt: '2023-01-01T00:00:00Z',
            reportedOn: '2023-01-02T00:00:00Z',
          },
        ],
      },
    });
  
    render(
      <MemoryRouter>
        <ReviewTable />
      </MemoryRouter>
    );
  
    const reasonCell = await screen.findByTestId('review-reason')
    expect(reasonCell).toHaveTextContent('-')
  })

  it('handles API errors gracefully (logs error + UI still renders)', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  
    mockedAPI.get.mockRejectedValueOnce(new Error('Network error'))
  
    render(
      <MemoryRouter>
        <ReviewTable />
      </MemoryRouter>
    )
  
    // ✅ Wait for the table to render even if empty
    const table = await screen.findByRole('table')
    expect(table).toBeInTheDocument()
  
    // ✅ Check that console.error was called
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('❌ Failed to fetch student data:'),
      expect.any(Error)
    )
  
    errorSpy.mockRestore()
  })  
  
  it('applies CoreUI table styles and is responsive', async () => {
    mockedAPI.get.mockResolvedValueOnce({
      data: {
        users: [
          {
            _id: 'r1',
            first_name: 'Styled',
            last_name: 'User',
            reason: 'Just checking',
            createdAt: '2023-01-01T00:00:00Z',
            reportedOn: '2023-01-02T00:00:00Z',
          },
        ],
      },
    })
  
    render(
      <MemoryRouter>
        <ReviewTable />
      </MemoryRouter>
    )
  
    const table = await screen.findByRole('table')
  
    // Check CoreUI classes
    expect(table.className).toMatch(/table-hover/)
    expect(table.className).toMatch(/custom-table-hover/)
    expect(table.className).toMatch(/left-align/)
  
    // Check responsive wrapper exists
    const wrapper = table.closest('.table-responsive')
    expect(wrapper).toBeInTheDocument()
  })

  it('opens dropdown menu and displays actions for each row', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ReviewTable />
        </MemoryRouter>
      );
    })
  
    // Wait for the row to appear
    await screen.findByTestId('review-row');
  
    // Click the dropdown toggle
    const toggle = screen.getByTestId('dropdown-toggle-r1'); // update ID to match your test data
    await userEvent.click(toggle);
  
    // Check for all expected actions
    expect(await screen.findByTestId('send-email-r1')).toBeInTheDocument();
    expect(screen.getByTestId('view-logs-r1')).toBeInTheDocument();
    expect(screen.getByTestId('suspend-r1')).toBeInTheDocument();
    expect(screen.getByTestId('delete-r1')).toBeInTheDocument();
  });  
  
})
