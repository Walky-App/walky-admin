// src/tests/Ambassadors.test.tsx
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Ambassadors from '../pages/Ambassadors';
import { ambassadorService } from '../services/ambassadorService';

// Mocks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('../services/ambassadorService', () => ({
  ambassadorService: {
    getAll: jest.fn(),
    delete: jest.fn(),
  },
}));

const renderAmbassadorsPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Ambassadors />
      </QueryClientProvider>
    </MemoryRouter>
  );
};

const mockAmbassadors = [
  {
    id: 'abc12345',
    name: 'Megan Thee Stallion',
    email: 'meg@hotties.edu',
    campus_name: 'Texas Southern University',
    major: 'Health Administration',
    is_active: true,
  },
];

beforeEach(() => {
  (ambassadorService.getAll as jest.Mock).mockResolvedValue([]);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Walky Admin - Ambassadors Page', () => {
  it('renders the Ambassadors page container with proper layout and spacing', () => {
    renderAmbassadorsPage();
    expect(screen.getByTestId('ambassadors-page')).toBeInTheDocument();
    expect(screen.getByTestId('ambassadors-section-title')).toHaveTextContent('Ambassador Management');
    expect(screen.getByTestId('add-ambassador-button')).toBeInTheDocument();
    expect(screen.getByTestId('ambassadors-table')).toBeInTheDocument();
  });

  it('displays the title/header: Ambassador Management', () => {
    renderAmbassadorsPage();
    const title = screen.getByTestId('ambassadors-section-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Ambassador Management');
  });

  it('renders the + Add Ambassador button', async () => {
    renderAmbassadorsPage();
    const addButton = await screen.findByTestId('add-ambassador-button');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveTextContent('Add Ambassador');
    expect(addButton).toBeEnabled();
  });

  it('fetches and displays ambassador data from /ambassadors API', async () => {
    (ambassadorService.getAll as jest.Mock).mockResolvedValueOnce(mockAmbassadors);
    renderAmbassadorsPage();
    const row = await screen.findByTestId('ambassador-row-abc12345');
    expect(row).toBeInTheDocument();
    expect(screen.getByTestId('ambassador-name-abc12345')).toHaveTextContent('Megan Thee Stallion');
    expect(screen.getByTestId('ambassador-email-abc12345')).toHaveTextContent('meg@hotties.edu');
    expect(screen.getByTestId('ambassador-campus-abc12345')).toHaveTextContent('Texas Southern University');
    expect(screen.getByTestId('ambassador-major-abc12345')).toHaveTextContent('Health Administration');
    expect(screen.getByTestId('ambassador-status-abc12345')).toHaveTextContent('Active');
    expect(row.querySelector('svg')).toBeInTheDocument();
    expect(screen.getByTestId('edit-ambassador-abc12345')).toBeInTheDocument();
    expect(screen.getByTestId('delete-ambassador-abc12345')).toBeInTheDocument();
  });

  it('renders correct table headers: Ambassador, Email, Campuses, Major, Status, Actions', () => {
    renderAmbassadorsPage();
    const headers = [
      'Ambassador',
      'Email',
      'Campuses',
      'Major',
      'Status',
      'Actions',
    ];
    headers.forEach((headerText) => {
      expect(screen.getByRole('columnheader', { name: headerText })).toBeInTheDocument();
    });
  });

  it('triggers navigation to AmbassadorDetails page on Edit button click', async () => {
    (ambassadorService.getAll as jest.Mock).mockResolvedValueOnce(mockAmbassadors);
    renderAmbassadorsPage();
    const editButton = await screen.findByTestId('edit-ambassador-abc12345');
    expect(editButton).toBeInTheDocument();
    await userEvent.click(editButton);
    expect(mockNavigate).toHaveBeenCalledWith(
      '/ambassadors/ambassador-view/abc12345',
      expect.objectContaining({
        state: expect.objectContaining({
          ambassadorData: expect.objectContaining({
            name: 'Megan Thee Stallion',
          }),
        }),
      })
    );
  });

  it('shows confirmation and calls delete mutation on Delete button click', async () => {
    (ambassadorService.getAll as jest.Mock).mockResolvedValueOnce(mockAmbassadors);
    (ambassadorService.delete as jest.Mock).mockResolvedValueOnce({ success: true });
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    renderAmbassadorsPage();
    const deleteButton = await screen.findByTestId('delete-ambassador-abc12345');
    await userEvent.click(deleteButton);
    await screen.findByTestId('ambassadors-alert');
    expect(confirmSpy).toHaveBeenCalled();
    expect(ambassadorService.delete).toHaveBeenCalledWith('abc12345');
    expect(screen.getByTestId('ambassadors-alert')).toHaveTextContent('Ambassador deleted successfully!');
    confirmSpy.mockRestore();
  });

  it('shows loading skeletons when ambassadors data is being fetched', () => {
    (ambassadorService.getAll as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderAmbassadorsPage();
    const skeletonRows = screen.getAllByTestId('empty-ambassador-message');
    expect(skeletonRows.length).toBeGreaterThan(0);
  });

  it('displays fallback message and call-to-action when ambassador list is empty', async () => {
    (ambassadorService.getAll as jest.Mock).mockResolvedValueOnce([]);
    renderAmbassadorsPage();
    const fallbackText = await screen.findByText('No ambassadors found');
    const fallbackContainer = fallbackText.closest('td');
    expect(fallbackContainer).toBeInTheDocument();
    const { getByRole } = within(fallbackContainer!);
    const fallbackButton = getByRole('button', { name: /add ambassador/i });
    expect(fallbackButton).toBeInTheDocument();
  });

  it('applies consistent CoreUI styles and responsiveness', () => {
    renderAmbassadorsPage();
    const pageContainer = screen.getByTestId('ambassadors-page');
    expect(pageContainer).toHaveClass('page-container');
    const card = pageContainer.querySelector('.card');
    expect(card).toHaveClass('campus-card');
    const header = card?.querySelector('.card-header');
    expect(header).toHaveClass('campus-card-header');
    const body = card?.querySelector('.card-body');
    expect(body).toHaveClass('campus-card-body');
    const tableWrapper = body?.querySelector('.table-responsive');
    const table = screen.getByTestId('ambassadors-table');
    expect(tableWrapper).toBeInTheDocument();
    expect(table).toHaveClass('table table-hover campus-table');
  });
});
