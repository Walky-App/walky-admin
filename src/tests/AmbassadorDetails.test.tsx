// src/tests/AmbassadorDetails.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AmbassadorDetails from '../pages/AmbassadorDetails';
import * as ReactQuery from '@tanstack/react-query'; 
import { useParams, useLocation } from 'react-router-dom';
import { ambassadorService } from '../services/ambassadorService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const renderComponent = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AmbassadorDetails />
      </BrowserRouter>
    </QueryClientProvider>
  );
};


 jest.mock('@tanstack/react-query', () => ({
   ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
 }));

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

const mockedUseParams = useParams as jest.Mock;
const mockedUseLocation = useLocation as jest.Mock;


// Default mock (used for ALL tests except the loading one)
beforeEach(() => {
  mockedUseLocation.mockReturnValue({ state: { ambassadorData: mockAmbassador } });
  mockedUseParams.mockReturnValue({ id  : 'tems-id' });
  (ReactQuery.useQuery as jest.Mock).mockReturnValue({
    data: mockAmbassador,
    isLoading: false,
    isError: false,
    error: null,
  });
});

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation((msg, ...args) => {
    if (
      typeof msg === 'string' &&
      msg.includes('📝 Loading ambassador from navigation state')
    ) return;
    console.info(msg, ...args);
  });

  jest.spyOn(console, 'warn').mockImplementation((msg, ...args) => {
    if (typeof msg === 'string' && msg.includes('⚠️ No token found')) return;
    console.warn(msg, ...args);
  });

  jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
    if (
      typeof msg === 'string' &&
      msg.includes('Failed to update ambassador')
    ) return;
    console.error(msg, ...args);
  });
});


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));


jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: jest.fn(),
    useLocation: jest.fn(),
  };
});


describe('Walky Admin - Ambassador Page: AmbassadorDetails Component', () => {
  it('renders the AmbassadorDetails form with proper layout and theme styling', () => {
    renderComponent();
    expect(screen.getByTestId('ambassador-details-page')).toBeInTheDocument();
    expect(screen.getByTestId('ambassador-go-back-button')).toBeInTheDocument();
    expect(screen.getByTestId('ambassador-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('ambassador-email-input')).toBeInTheDocument();
    expect(screen.getByTestId('ambassador-save-button')).toBeInTheDocument();
    expect(screen.getByTestId('ambassador-cancel-button')).toBeInTheDocument();
  });

  it('pre-fills form inputs with ambassadorData from navigation state', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByTestId('ambassador-name-input')).toHaveValue('Tems');
      expect(screen.getByTestId('ambassador-email-input')).toHaveValue('tems@essence.co');
    });
    expect(screen.getByDisplayValue('+2348000000000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('TMS234')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Music Production')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Nigerian singer-songwriter.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/tems.jpg')).toBeInTheDocument();
  });

  it('updates all form inputs when changed', async () => {
    renderComponent();
    const nameInput = await screen.findByTestId('ambassador-name-input');
    const emailInput = await screen.findByTestId('ambassador-email-input');
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    const studentIdInput = screen.getByLabelText(/Student ID/i);
    const majorInput = screen.getByLabelText(/Major/i);
    const gradYearInput = screen.getByLabelText(/Graduation Year/i);
    const bioInput = screen.getByLabelText(/Biography/i);
    const profileImgInput = screen.getByLabelText(/Profile Image URL/i);
    const statusSelect = screen.getByLabelText(/Status/i);

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Name');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'new@email.com');
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '+19995556666');
    await userEvent.clear(studentIdInput);
    await userEvent.type(studentIdInput, 'NEW123');
    await userEvent.clear(majorInput);
    await userEvent.type(majorInput, 'Engineering');
    await userEvent.clear(gradYearInput);
    await userEvent.type(gradYearInput, '2030');
    await userEvent.clear(bioInput);
    await userEvent.type(bioInput, 'I am a future engineer!');
    await userEvent.clear(profileImgInput);
    await userEvent.type(profileImgInput, 'https://example.com/new.jpg');
    await userEvent.selectOptions(statusSelect, 'false');

    await waitFor(() => {
      expect(nameInput).toHaveValue('New Name');
      expect(emailInput).toHaveValue('new@email.com');
      expect(phoneInput).toHaveValue('+19995556666');
      expect(studentIdInput).toHaveValue('NEW123');
      expect(majorInput).toHaveValue('Engineering');
      expect(gradYearInput).toHaveValue(2030);
      expect(bioInput).toHaveValue('I am a future engineer!');
      expect(profileImgInput).toHaveValue('https://example.com/new.jpg');
      expect(statusSelect).toHaveValue('false');
    });
  }, 10000);

  it('shows validation errors for missing required fields (name, email)', async () => {
    renderComponent();
    const nameInput = await screen.findByTestId('ambassador-name-input');
    const emailInput = await screen.findByTestId('ambassador-email-input');
    const saveButton = screen.getByTestId('ambassador-save-button');

    await userEvent.clear(nameInput);
    await userEvent.clear(emailInput);
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Ambassador name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email address is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    renderComponent();
    const emailInput = screen.getByTestId('ambassador-email-input');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(screen.getByTestId('ambassador-save-button'));
    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for short student ID', async () => {
    renderComponent();
    const studentIdInput = screen.getByLabelText(/Student ID/i);
    const saveButton = screen.getByTestId('ambassador-save-button');
    await userEvent.clear(studentIdInput);
    await userEvent.type(studentIdInput, 'ab');
    await userEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByTestId('ambassador-error-alert')).toBeInTheDocument();
    });
    expect(studentIdInput).toHaveValue('ab');
  });

  it('does not allow saving when graduation year is outside valid range', async () => {
    renderComponent();
    const gradYearInput = screen.getByLabelText(/Graduation Year/i);
    const saveButton = screen.getByTestId('ambassador-save-button');
    await userEvent.clear(gradYearInput);
    await userEvent.type(gradYearInput, '2045');
    await userEvent.click(saveButton);
    expect(gradYearInput).toHaveValue(2045);
    await waitFor(() => {
      expect(screen.getByTestId('ambassador-error-alert')).toBeInTheDocument();
    });
  });

  it('shows real-time validation feedback for invalid email', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/Email Address/i);
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'not-an-email');
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('triggers PUT mutation with updated data when editing an ambassador', async () => {
    const updateSpy = jest
      .spyOn(ambassadorService, 'update')
      .mockResolvedValueOnce({ ...mockAmbassador, name: 'Updated Tems', email: 'updated@essence.co' });

    renderComponent();
    await userEvent.clear(screen.getByTestId('ambassador-name-input'));
    await userEvent.type(screen.getByTestId('ambassador-name-input'), 'Updated Tems');
    await userEvent.clear(screen.getByTestId('ambassador-email-input'));
    await userEvent.type(screen.getByTestId('ambassador-email-input'), 'updated@essence.co');
    await userEvent.click(screen.getByTestId('ambassador-save-button'));

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith('tems-id', expect.objectContaining({
        name: 'Updated Tems',
        email: 'updated@essence.co',
      }));
    });
  });

  it('triggers POST mutation when creating a new ambassador', async () => {
    const newAmbassador = {
      name: 'Fresh Face',
      email: 'fresh@uni.edu',
      phone: '+15551234567',
      student_id: 'NEW456',
      is_active: true,
      profile_image_url: '',
      bio: '',
      graduation_year: 2026,
      major: 'Marketing',
    };

    const createSpy = jest
      .spyOn(ambassadorService, 'create')
      .mockResolvedValueOnce({ ...newAmbassador, id: 'new-id' });

    // 👇 Override mock to simulate "Create mode"
    mockedUseLocation.mockReturnValue({ state: null });
    mockedUseParams.mockReturnValue({ id: undefined }); // no ID = create

    renderComponent();

    await userEvent.clear(screen.getByTestId('ambassador-name-input'));
    await userEvent.type(screen.getByTestId('ambassador-name-input'), 'Fresh Face');
    await userEvent.clear(screen.getByTestId('ambassador-email-input'));
    await userEvent.type(screen.getByTestId('ambassador-email-input'), 'fresh@uni.edu');

    await userEvent.click(screen.getByTestId('ambassador-save-button'));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Fresh Face',
        email: 'fresh@uni.edu',
      }));
    });
  });


    it('navigates back to Ambassadors page when Cancel button is clicked', async () => {
    renderComponent();

    const cancelButton = screen.getByTestId('ambassador-cancel-button');
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/ambassadors');
    });
  });

    it('shows error alert when server update fails', async () => {
    jest
      .spyOn(ambassadorService, 'update')
      .mockRejectedValueOnce(new Error('Server failed to update'));

    renderComponent();

    const saveButton = screen.getByTestId('ambassador-save-button');
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByTestId('ambassador-error-alert')).toBeInTheDocument();     
    });
  });

    it('displays loading state when fetching data for editing', () => {
    // override useQuery JUST for this test
    (ReactQuery.useQuery as jest.Mock).mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    mockedUseLocation.mockReturnValue({ state: null });

    renderComponent();
    expect(screen.getByTestId('ambassador-loading-spinner')).toBeInTheDocument();
  });

  describe('AmbassadorDetails - Dark mode rendering', () => {
    beforeEach(() => {
      document.body.classList.add('dark-theme');
    });

    afterEach(() => {
      document.body.classList.remove('dark-theme');
    });

    it('renders with dark mode styles', () => {
      renderComponent();
      expect(screen.getByTestId('ambassador-details-page')).toBeInTheDocument();
      expect(document.body).toHaveClass('dark-theme');
    });
  });

});
