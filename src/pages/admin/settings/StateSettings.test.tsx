import { render, screen } from '../../../utils/test-utils'
import { StateSettings } from './StateSettings'

describe('StatesDetailView Page', () => {
  it('should render StatesDetailView view', () => {
    render(<StateSettings />)
  })

  it('should render StatesDetailView view', async () => {
    render(<StateSettings />)

    const statesDetailView = await screen.findByTestId('state-settings')
    expect(statesDetailView).toBeInTheDocument()
  })
})
