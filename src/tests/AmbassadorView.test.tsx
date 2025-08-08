// Mocks (must be before imports)
jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: jest.fn(),
    useQueryClient: () => ({ invalidateQueries: jest.fn() }),
    useMutation: () => ({ mutate: jest.fn() }),
  };
});

jest.mock('../pages/AmbassadorDetails', () => ({
  __esModule: true,
  default: ({ ambassadorId, inTabView }: any) => (
    <div data-testid="ambassador-details-page">
      Mocked AmbassadorDetails - ID: {ambassadorId}, Tab: {String(inTabView)}
    </div>
  ),
}));

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AmbassadorView from '../pages/AmbassadorView';
import * as ReactQuery from '@tanstack/react-query';

const mockAmbassador = {
  id: 'tems-id',
  name: 'Tems',
  email: 'tems@essence.co',
  phone: '+2348000000000',
  student_id: 'TMS234',
  is_active: true,
  profile_image_url: 'https://example.com/tems.jpg',
  bio: 'Nigerian singer-songwriter.',
  graduation_year: 2025,
  major: 'Music Production',
};

beforeEach(() => {
  (ReactQuery.useQuery as jest.Mock).mockReturnValue({
    data: mockAmbassador,
    isLoading: false,
    isError: false,
    error: null,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderComponent = () => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/ambassadors/tems-id']}>
        <Routes>
          <Route path="/ambassadors/:id" element={<AmbassadorView />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Walky Admin - Ambassadors Page: AmbassadorView', () => {
  it('loads AmbassadorDetails with correct props based on route param', async () => {
    renderComponent();
    expect(await screen.findByTestId('ambassador-view-wrapper')).toBeInTheDocument();
  });

  it('passes ambassadorId and disables tab view', () => {
    renderComponent();
    expect(
      screen.getByText(/Mocked AmbassadorDetails - ID: tems-id, Tab: false/)
    ).toBeInTheDocument();
  });

  it('renders AmbassadorDetails inside padded container', () => {
    renderComponent();
    const wrapper = screen.getByTestId('ambassador-view-wrapper');
    const details = screen.getByTestId('ambassador-details-page');
    expect(wrapper).toContainElement(details);
    expect(wrapper).toHaveClass('p-2');
  });
});
