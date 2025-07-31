jest.mock('../utils/env', () => ({
  getEnv: () => ({
    VITE_API_BASE_URL: 'http://localhost:8081/api',
  }),
}));

// ✅ Must be before the import to work correctly
jest.mock('../API');
import API from '../API';

// src/tests/ForgotPassword.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import ForgotPassword from '../pages/ForgotPassword'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import userEvent from '@testing-library/user-event'


// Reusable render function
const renderForgotPasswordPage = () => {
  return render(
    <BrowserRouter>
      <ForgotPassword />
    </BrowserRouter>
  )
}



jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom')
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  }
})

const mockedPost = (API.post as unknown) as jest.Mock;
const mockedNavigate = useNavigate as jest.Mock

describe('Walky Admin - ForgotPassword Page', () => {
  it('renders the Forgot Password page with layout and styling', () => {
    renderForgotPasswordPage()

    expect(screen.getByTestId('forgot-password-page')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /walky logo/i })).toHaveAttribute(
      'src',
      '/Walky Logo_Duotone.svg'
    )
    expect(screen.getByTestId('forgot-password-heading')).toHaveTextContent(
      'Forgot your password?'
    )
    expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument()
    expect(
      screen.getByTestId('forgot-password-email-input')
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('forgot-password-submit-button')
    ).toHaveTextContent('Send Reset Link')
    expect(
      screen.getByTestId('forgot-password-back-button')
    ).toHaveTextContent(/back to login/i)
  })

  it('displays title/header: Forgot your password?', () => {
    renderForgotPasswordPage()

    const heading = screen.getByTestId('forgot-password-heading')
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Forgot your password?')
    })

    it('renders the form when submitted is false', () => {
        renderForgotPasswordPage()

        // Email input
        const emailInput = screen.getByTestId('forgot-password-email-input')
        expect(emailInput).toBeInTheDocument()
        expect(emailInput).toHaveAttribute('type', 'email')
        expect(emailInput).toHaveAttribute('placeholder', 'Enter your email')
        expect(emailInput).toBeRequired()

        // Submit button
        const submitButton = screen.getByTestId('forgot-password-submit-button')
        expect(submitButton).toBeInTheDocument()
        expect(submitButton).toHaveTextContent('Send Reset Link')

        // Back button
        const backButton = screen.getByTestId('forgot-password-back-button')
        expect(backButton).toBeInTheDocument()
        expect(backButton).toHaveTextContent(/back to login/i)

        // Error should not appear initially
        expect(screen.queryByTestId('forgot-password-error')).not.toBeInTheDocument()
        })

    it('shows confirmation message when submitted is true', async () => {
        renderForgotPasswordPage()

        const emailInput = screen.getByTestId('forgot-password-email-input')
        const submitButton = screen.getByTestId('forgot-password-submit-button')

        // Mock successful API response
        mockedPost.mockResolvedValueOnce({})

        // Fill and submit form
        await userEvent.type(emailInput, 'user@example.com')
        await userEvent.click(submitButton)

        // Wait for success message to appear
        const successMessage = await screen.findByTestId(
            'forgot-password-success-message'
        )

        expect(successMessage).toBeInTheDocument()
        expect(successMessage).toHaveTextContent(
            'If your email is registered, you’ll receive reset instructions shortly.'
        )

        // Optional: check styling
        expect(successMessage).toHaveStyle({
            backgroundColor: '#1e293b',
            borderRadius: '8px',
            color: '#22c55e',
            fontWeight: '500',
        })
        })

    it('calls API.post and navigates to /verify-code with email in state', async () => {
        const navigateSpy = jest.fn()
        mockedNavigate.mockReturnValue(navigateSpy)

        renderForgotPasswordPage()

        const emailInput = screen.getByTestId('forgot-password-email-input')
        const submitButton = screen.getByTestId('forgot-password-submit-button')

        const testEmail = 'test@example.com'
        mockedPost.mockResolvedValueOnce({})

        await userEvent.type(emailInput, testEmail)
        await userEvent.click(submitButton)

        await waitFor(() => {
            expect(mockedPost).toHaveBeenCalledWith('/forgot-password', {
            email: testEmail,
            })
            expect(navigateSpy).toHaveBeenCalledWith('/verify-code', {
            state: { email: testEmail },
            })
        })
        })

    it('handles API failure and displays fallback error', async () => {
        renderForgotPasswordPage()

        const emailInput = screen.getByTestId('forgot-password-email-input')
        const submitButton = screen.getByTestId('forgot-password-submit-button')

        // 💣 Mock rejected API call (no message from backend)
        mockedPost.mockRejectedValueOnce(new Error('Network error'))

        await userEvent.type(emailInput, 'fail@example.com')
        await userEvent.click(submitButton)

        // Wait for error message to appear
        const errorMessage = await screen.findByTestId('forgot-password-error')

        expect(errorMessage).toBeInTheDocument()
        expect(errorMessage).toHaveTextContent('Something went wrong. Please try again.')
        })

})
