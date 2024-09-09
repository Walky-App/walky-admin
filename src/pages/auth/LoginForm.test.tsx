import { Auth } from '.'
import { cleanup, render, screen } from '../../utils/test-utils'
import { LoginForm } from './LoginForm'

describe('Auth Page', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render auth view', () => {
    render(<Auth />)
  })

  it('should match snapshot', () => {
    const { asFragment, container } = render(<Auth />)

    const imageComponent = container.querySelector('[data-testid="hero-image"]')
    imageComponent?.setAttribute('src', 'https://hemptemps-prod.s3.amazonaws.com/web-images/mock-image.png')

    expect(asFragment()).toMatchSnapshot()
  })

  it('should render the login component', async () => {
    render(<LoginForm setUserForm={() => jest.fn()} />).container

    const loginForm = await screen.findByTestId('login-form')
    expect(loginForm).toBeInTheDocument()
  })

  it('should render the email input field', async () => {
    render(<LoginForm setUserForm={() => jest.fn()} />)

    const emailInput = await screen.getByPlaceholderText('*Email')
    expect(emailInput).toBeInTheDocument()
  })
})
