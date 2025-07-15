
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login';
import API from '../API';

jest.mock('../API');

describe('Walky Admin Portal - Login Component', () => {
  it('renders email and password fields and the Continue button', () => {
      render(
        <BrowserRouter>
          <Login onLogin={jest.fn()} />
        </BrowserRouter>
      );
    
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('continue-button')).toBeInTheDocument();
    });

  it('shows an error when fields are empty and Continue is clicked', () => {
    render(
        <BrowserRouter>
          <Login onLogin={jest.fn()} />
        </BrowserRouter>
      );
    
      const continueBtn = screen.getByTestId('continue-button');
      fireEvent.click(continueBtn);
    
      expect(screen.getAllByText(/invalid email or password/i)).toHaveLength(2); // one for email, one for password
    });

    
    it('clears error when user starts typing again', () => {
      render(
        <BrowserRouter>
          <Login onLogin={jest.fn()} />
        </BrowserRouter>
      );
    
      const continueBtn = screen.getByTestId('continue-button');
      fireEvent.click(continueBtn); // trigger error
    
      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'meagan@example.com' } });
    
      expect(screen.queryByText(/invalid email or password/i)).toBeNull(); // error should go away
    });

    //  it('enables "Continue" button only when both fields have input', () => {
    //   render(
    //     <BrowserRouter>
    //       <Login onLogin={jest.fn()} />
    //     </BrowserRouter>
    //   );
    
    //   const continueBtn = screen.getByTestId('continue-button');
    //   const emailInput = screen.getByTestId('email-input');
    //   const passwordInput = screen.getByTestId('password-input');
    
    //   // Button should be disabled initially
    //   expect(continueBtn).toBeDisabled();
    
    //   // Fill only one field
    //   fireEvent.change(emailInput, { target: { value: 'meagan@example.com' } });
    //   expect(continueBtn).toBeDisabled();
    
    //   // Fill both fields
    //   fireEvent.change(passwordInput, { target: { value: 'password123' } });
    //   expect(continueBtn).not.toBeDisabled();
    // });
    
    // it('shows an error when email format is invalid', () => {
    //   render(
    //     <BrowserRouter>
    //       <Login onLogin={jest.fn()} />
    //     </BrowserRouter>
    //   );
    
    //   const emailInput = screen.getByTestId('email-input');
    //   const passwordInput = screen.getByTestId('password-input');
    //   const continueBtn = screen.getByTestId('continue-button');
    
    //   // Enter invalid email and valid password
    //   fireEvent.change(emailInput, { target: { value: 'meagan@' } });
    //   fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    //   fireEvent.click(continueBtn);
    
    //   // Assert error shows up for invalid email
    //   expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    // });
    
  it('calls onLogin function upon successful login', async () => {
    const mockLogin = jest.fn();
  
    (API.post as jest.Mock).mockResolvedValue({
      data: { access_token: 'slay-token' },
    });
  
    render(
      <BrowserRouter>
        <Login onLogin={mockLogin} />
      </BrowserRouter>
    );
  
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'meagan@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
  
    fireEvent.click(screen.getByTestId('continue-button'));
  
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });
  });

  it('toggles password visibility when eye icon is clicked', () => {
    render(
      <BrowserRouter>
        <Login onLogin={jest.fn()} />
      </BrowserRouter>
    );
  
    const passwordInput = screen.getByTestId('password-input');
  
    // Should start as password
    expect(passwordInput).toHaveAttribute('type', 'password');
  
    // Click the eye icon
    const toggleIcon = screen.getByTitle(/show password/i); // uses title for accessibility
    fireEvent.click(toggleIcon);
  
    // Should now show as text
    expect(passwordInput).toHaveAttribute('type', 'text');
  
    // Click again to hide
    fireEvent.click(toggleIcon);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
    

  it('routes to Forgot Password page when link is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login onLogin={jest.fn()} />} />
          <Route path="/forgot-password" element={<div data-testid="forgot-page">Forgot Password Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('link', { name: /forgot password/i }));

    expect(screen.getByTestId('forgot-page')).toBeInTheDocument();
  });
    
  // it('submits the form when Enter key is pressed', async () => {
  //   const mockLogin = jest.fn();
  
  //   (API.post as jest.Mock).mockResolvedValue({
  //     data: { access_token: 'slay-token' },
  //   });
  
  //   render(
  //     <MemoryRouter initialEntries={['/login']}>
  //       <Routes>
  //         <Route path="/login" element={<Login onLogin={mockLogin} />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );
  
  //   fireEvent.change(screen.getByTestId('email-input'), {
  //     target: { value: 'meagan@example.com' },
  //   });
  
  //   fireEvent.change(screen.getByTestId('password-input'), {
  //     target: { value: 'password123' },
  //   });
  
  //   fireEvent.keyDown(screen.getByTestId('password-input'), { key: 'Enter', code: 'Enter' });
  
  //   await waitFor(() => {
  //     expect(mockLogin).toHaveBeenCalledTimes(1);
  //   });
  // });

  it('redirects to dashboard on successful login', async () => {
    const mockLogin = jest.fn();
    (API.post as jest.Mock).mockResolvedValue({
      data: { access_token: 'slay-token' },
    });
  
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login onLogin={mockLogin} />} />
          <Route path="/" element={<div data-testid="dashboard-page">Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );
  
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'meagan@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
  
    fireEvent.click(screen.getByTestId('continue-button'));
  
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
      expect(sessionStorage.getItem('token')).toBe('slay-token');
    });
  });
  
  
  it('renders inputs and button correctly on small screens', () => {
    // Set the screen to a mobile-ish size
    window.innerWidth = 375;
    window.innerHeight = 667;
    window.dispatchEvent(new Event('resize'));
  
    render(
      <MemoryRouter>
        <Login onLogin={jest.fn()} />
      </MemoryRouter>
    );
  
    // Verify elements are visible
    expect(screen.getByTestId('email-input')).toBeVisible();
    expect(screen.getByTestId('password-input')).toBeVisible();
    expect(screen.getByTestId('continue-button')).toBeVisible();
  });

  it('allows keyboard input and tab navigation', async () => {
    render(
      <BrowserRouter>
        <Login onLogin={jest.fn()} />
      </BrowserRouter>
    );
  
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const continueButton = screen.getByTestId('continue-button');
    const forgotLink = screen.getByRole('link', { name: /forgot password/i });
  
    emailInput.focus();
    expect(emailInput).toHaveFocus();
  
    // Tab to password
    await userEvent.tab();
    await waitFor(() => {
      expect(passwordInput).toHaveFocus();
    });
  
    // Tab to forgot password link
    await userEvent.tab();
    await waitFor(() => {
      expect(forgotLink).toHaveFocus();
    });
  
    // Tab to continue button
    await userEvent.tab();
    await waitFor(() => {
      expect(continueButton).toHaveFocus();
    });
  });
  
});
