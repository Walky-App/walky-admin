// src/tests/Campuses.test.tsx
import { render, screen } from '@testing-library/react'
import Campuses from '../pages/Campuses'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

describe('Walky Admin - Campuses Page', () => {
  const queryClient = new QueryClient()

  const renderWithProviders = () =>
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Campuses />
        </QueryClientProvider>
      </BrowserRouter>
    )

  it('renders the Campuses page container with proper layout and spacing', () => {
    renderWithProviders()
    const container = screen.getByTestId('campuses-page')
    expect(container).toBeInTheDocument()
  })

  it('displays title/header: Campus Management', () => {
    renderWithProviders()
    const title = screen.getByTestId('campuses-section-title')
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent('Campus Management')
  })

  it('renders the + Add Campus button', () => {
    renderWithProviders()
    const addBtn = screen.getByTestId('add-campus-button')
    expect(addBtn).toBeInTheDocument()
    expect(addBtn).toHaveTextContent('Add Campus')
  })

  it('includes the CampusTable component (CTable)', () => {
    renderWithProviders()
    const table = screen.getByTestId('campuses-table')
    expect(table).toBeInTheDocument()
  })
  
  
  
})
