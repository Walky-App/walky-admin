import { MemoryRouter } from 'react-router-dom'

import '@testing-library/jest-dom'
import { render, screen, cleanup } from '@testing-library/react'

import { Auth } from '.'
import { LoginForm } from './LoginForm'

describe('Auth Page', () => {
  afterEach(() => {
    cleanup()
  })
  it('should render auth view', () => {
    render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>,
    )
  })

  it('should render the login component', async () => {
    render(
      <MemoryRouter>
        <LoginForm setUserForm={() => jest.fn()} />
      </MemoryRouter>,
    ).container

    const loginForm = await screen.findByTestId('login-form')
    expect(loginForm).toBeInTheDocument()
  })

  it('should render the email input field', async () => {
    render(
      <MemoryRouter>
        <LoginForm setUserForm={() => jest.fn()} />
      </MemoryRouter>,
    )

    const emailInput = await screen.getByPlaceholderText('*Email')
    expect(emailInput).toBeInTheDocument()
  })
})
