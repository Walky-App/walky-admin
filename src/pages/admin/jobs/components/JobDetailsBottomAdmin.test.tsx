import { jobMock } from '../../../../__mocks__/jobMock'
import { render } from '../../../../utils/test-utils'
import { JobDetailBottomAdmin } from './JobDetailBottomAdmin'

describe('JobDetailBottomAdmin', () => {
  it('should render job detail bottom admin component', () => {
    render(<JobDetailBottomAdmin job={jobMock} />)
  })

  it('should match snapshot', () => {
    const { asFragment } = render(<JobDetailBottomAdmin job={jobMock} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
