import { companyMock } from '../../../__mocks__/companyMock'
import { render } from '../../../utils/test-utils'
import { CompanyDetailForm } from './CompanyDetailForm'

describe('CompanyDetailForm', () => {
  it('should render company detail form', () => {
    render(<CompanyDetailForm selectedCompanyData={companyMock} />)
  })

  it('should match snapshot', () => {
    const { asFragment } = render(<CompanyDetailForm selectedCompanyData={companyMock} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
