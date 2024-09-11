import { render } from '../../../../utils/test-utils'
import { DroppedShiftsByJob } from './DroppedShiftsByJob'

describe('Dropped Shift By Job Component', () => {
  it('should render dropped shifts by job component', () => {
    render(<DroppedShiftsByJob jobId="qet135taetwe" />)
  })

  it('should match snapshot', () => {
    const { asFragment } = render(<DroppedShiftsByJob jobId="qet135taetwe" />)
    expect(asFragment()).toMatchSnapshot()
  })
})
