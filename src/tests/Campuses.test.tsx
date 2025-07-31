// src/tests/Campuses.test.tsx
import { render, screen } from '@testing-library/react';
import Campuses from '../pages/Campuses';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock env
jest.mock('../utils/env', () => ({
  getEnv: () => ({
    VITE_API_BASE_URL: 'http://localhost:8081/api',
  }),
}));

// Mock campusService to prevent real API calls and console errors
jest.mock('../services/campusService', () => ({
  campusService: {
    // Adjust the return value to match your actual query expectations!
    getAll: jest.fn().mockResolvedValue([]),
  },
}));

// Silence only the specific React Query warning
const originalError = console.error;
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
    if (
      typeof msg === 'string' &&
      msg.includes('Query data cannot be undefined')
    ) {
      return;
    }
    originalError(msg, ...args);
  });
});

const renderWithProviders = () => {
  const queryClient = new QueryClient();
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Campuses />
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('Walky Admin - Campuses Page', () => {
  it('renders the Campuses page container with proper layout and spacing', () => {
    renderWithProviders();
    const container = screen.getByTestId('campuses-page');
    expect(container).toBeInTheDocument();
  });

  it('displays title/header: Campus Management', () => {
    renderWithProviders();
    const title = screen.getByTestId('campuses-section-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Campus Management');
  });

  it('renders the + Add Campus button', () => {
    renderWithProviders();
    const addBtn = screen.getByTestId('add-campus-button');
    expect(addBtn).toBeInTheDocument();
    expect(addBtn).toHaveTextContent('Add Campus');
  });

  it('includes the CampusTable component (CTable)', () => {
    renderWithProviders();
    const table = screen.getByTestId('campuses-table');
    expect(table).toBeInTheDocument();
  });
});
