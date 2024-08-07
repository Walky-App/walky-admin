import { MemoryRouter } from 'react-router-dom'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { Auth } from '.'
import { LoginForm } from './LoginForm'

describe('Auth Page', () => {
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
        <LoginForm setUserForm={() => jest.mock} />
      </MemoryRouter>,
    ).container

    const loginForm = await screen.findByTestId('login-form')
    expect(loginForm).toBeInTheDocument()
  })

  it('should render the email input field', async () => {
    render(
      <MemoryRouter>
        <LoginForm setUserForm={() => jest.mock} />
      </MemoryRouter>,
    )

    const emailInput = await screen.getByPlaceholderText('*Email')
    expect(emailInput).toBeInTheDocument()
  })
})
