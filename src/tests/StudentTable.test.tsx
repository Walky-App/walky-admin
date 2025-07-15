// src/tests/StudentTable.test.tsx
import { render, screen } from '@testing-library/react'
import StudentTable from '../components/StudentTable'
import { MemoryRouter } from 'react-router-dom'
import API from '../API'
import userEvent from '@testing-library/user-event'

// Mock the API module
jest.mock('../API')

const mockedAPI = jest.mocked(API)

describe('Walky Admin - StudentTable Component', () => {
  beforeEach(() => {
    mockedAPI.get.mockResolvedValue({
      data: {
        users: [
          {
            _id: '1',
            first_name: 'Alice',
            last_name: 'Doe',
            email: 'alice@example.com',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-05T00:00:00Z',
          },
          {
            _id: '2',
            first_name: 'Bob',
            last_name: 'Smith',
            email: 'bob@example.com',
            createdAt: '2023-02-01T00:00:00Z',
            updatedAt: '2023-02-05T00:00:00Z',
          },
        ],
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('fetches and displays rows from /users API', async () => {
    render(
      <MemoryRouter>
        <StudentTable />
      </MemoryRouter>
    )

    const rows = await screen.findAllByTestId('student-row')
    expect(rows).toHaveLength(2)

    expect(screen.getByText('Alice Doe')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()

    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()

    expect(mockedAPI.get).toHaveBeenCalledWith(
      '/users/?fields=_id,first_name,last_name,email,createdAt,updatedAt'
    )
  })

  it('transforms API data into readable table format', async () => {
    render(
      <MemoryRouter>
        <StudentTable />
      </MemoryRouter>
    )
  
    const rows = await screen.findAllByTestId('student-row')
    expect(rows).toHaveLength(2)
  
    expect(screen.getByText('Alice Doe')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  
    // ✅ Dates as they appear in YOUR current time zone
    expect(screen.getByText('Dec 31, 2022')).toBeInTheDocument()
    expect(screen.getByText('Jan 4, 2023')).toBeInTheDocument()
    expect(screen.getByText('Jan 31, 2023')).toBeInTheDocument()
    expect(screen.getByText('Feb 4, 2023')).toBeInTheDocument()
  })
  
  it('renders correct headers: ID, Name, Email, Joined, Last Update', () => {
    render(
      <MemoryRouter>
        <StudentTable />
      </MemoryRouter>
    )
  
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Joined')).toBeInTheDocument()
    expect(screen.getByText('Last Update')).toBeInTheDocument()
  })
  
  it('renders dropdown actions: Send email, Flag/Unflag user, Request edit, Request to delete', async () => {
    render(
      <MemoryRouter>
        <StudentTable />
      </MemoryRouter>
    )
  
    const toggle = await screen.findByTestId('dropdown-toggle-1')
    await userEvent.click(toggle)
  
    expect(await screen.findByTestId('send-email-1')).toBeInTheDocument()
    expect(screen.getByTestId('flag-user-1')).toBeInTheDocument()
    expect(screen.getByTestId('request-edit-1')).toBeInTheDocument()
    expect(screen.getByTestId('request-delete-1')).toBeInTheDocument()
  })
  
  it('toggles flag button text and row visual style when clicked', async () => {
    render(
      <MemoryRouter>
        <StudentTable />
      </MemoryRouter>
    )
  
    const toggle = await screen.findByTestId('dropdown-toggle-1')
    await userEvent.click(toggle)
  
    const flagButton = screen.getByTestId('flag-user-1')
    const row = screen.getAllByTestId('student-row')[0]
  
    // Click to flag
    await userEvent.click(flagButton)
  
    expect(flagButton).toHaveTextContent('Unflag user')
    expect(row.className).toMatch(/danger/i) 
  
    // Click to unflag
    await userEvent.click(flagButton)
  
    expect(flagButton).toHaveTextContent('Flag user')
    expect(row.className).not.toMatch(/danger/i)
  })

  // it('handles missing or undefined values gracefully', async () => {
  //   mockedAPI.get.mockResolvedValueOnce({
  //     data: {
  //       users: [
  //         {
  //           _id: '3',
  //           first_name: null,
  //           last_name: undefined,
  //           email: null,
  //           createdAt: null,
  //           updatedAt: undefined,
  //         },
  //       ],
  //     },
  //   })
  
  //   render(
  //     <MemoryRouter>
  //       <StudentTable />
  //     </MemoryRouter>
  //   )
  
  //   const row = await screen.findByTestId('student-row')
  
  //   // Should still render row with ID
  //   expect(screen.getByText('3')).toBeInTheDocument()
  
  //   // Name fallback — likely "null undefined" if not handled
  //   expect(row).toHaveTextContent(/null|undefined|\s+/)
  
  //   // Email cell should not crash
  //   expect(row).toBeInTheDocument() // already confirmed above, but safe
  
  //   // Graceful fallback: these might be blank if date is invalid
  //   // Check that it doesn’t crash or show "Invalid Date"
  //   expect(row).not.toHaveTextContent('Invalid Date')
  // })  
  
  
})
