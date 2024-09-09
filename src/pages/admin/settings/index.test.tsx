import { Settings } from '.'
import { render, screen } from '../../../utils/test-utils'

describe('StateSettings Page', () => {
  it('should render StateSettings view', () => {
    render(<Settings />)
  })

  it('should match snapshot', () => {
    const { asFragment } = render(<Settings />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render StateSettings view', async () => {
    render(<Settings />)
    const stateSettings = await screen.findByTestId('states-detail-view')
    expect(stateSettings).toBeInTheDocument()
  })
})
