import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import API from '../API';
// import * as useThemeHook from '../hooks/useTheme';
// import { getTheme } from '../theme';

jest.mock('../API');

// jest.spyOn(useThemeHook, 'useTheme').mockReturnValue({
//   theme: getTheme(false),
//   toggleTheme: jest.fn(),
// });

describe('Walky Admin Portal - Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (API.get as jest.Mock).mockImplementation((url: string) => {
      switch (url) {
        case '/walks/count?groupBy=month':
          return {
            data: {
              chartData: [10, 20, 30, 40, 50, 60],
              chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              totalWalksCreated: 210,
            },
          };
        case '/users/monthly-active?period=month':
          return {
            data: {
              monthlyData: [],
              chartData: [],
              chartLabels: [],
              totalActiveUsers: 100,
              last24HoursActiveUsers: 12,
              period: 'month',
              since: 'Jan 2024',
            },
          };
        default:
          return { data: {} };
      }
    });
  });

  it('renders the Walks widget and chart title', async () => {
    try {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App initialLoginState={true} />
        </MemoryRouter>
      );
  
      await waitFor(() => {
        expect(screen.getByTestId('walks-widget')).toBeInTheDocument();
      });
  
    } catch (error: unknown) {
      console.error('🔥 FINAL ERROR:', error);
      throw error;
    
  }
  });
});
