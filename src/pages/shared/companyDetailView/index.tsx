import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TabPanel, TabView } from 'primereact/tabview'

import { type ICompany } from '../../../interfaces/company'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'
import { CompanyDetailForm } from './CompanyDetailForm'
import { CompanyDocumentsView } from './CompanyDocumentsView'
import { CreditCardView } from './CreditCardView'
import { ACHAddPayment } from './components/ACHAddPayment'
import { PaymentCards } from './components/PaymentCards'

export const CompanyDetailView = () => {
  const [selectedCompanyData, setSelectedCompanyData] = useState<ICompany>({} as ICompany)

  const role = roleChecker()

  const selectedCompanyId = useParams().id
  useEffect(() => {
    const getCompanyWithPaymentInfo = async () => {
      try {
        const response = await requestService({ path: `companies/${selectedCompanyId}/payments` })
        if (!response.ok) {
          throw new Error('Failed to fetch company data')
        }
        const companyFound: ICompany = await response.json()
        setSelectedCompanyData(companyFound)
      } catch (error) {
        console.error('Error fetching company data: ', error)
      }
    }
    getCompanyWithPaymentInfo()
  }, [selectedCompanyId])

  return (
    <div>
      <div className="mb-8">
        <div className="text-3xl font-bold">{selectedCompanyData.company_name}</div>
        <div>{selectedCompanyData.company_address}</div>
      </div>
      <TabView>
        <TabPanel header="Details">
          <CompanyDetailForm selectedCompanyData={selectedCompanyData} />
        </TabPanel>
        <TabPanel header="Credit Cards">
          <PaymentCards selectedCompanyData={selectedCompanyData} />
          <CreditCardView setSelectedCompanyData={setSelectedCompanyData} />
        </TabPanel>
        <TabPanel header="ACH / Terms">
          <PaymentCards selectedCompanyData={selectedCompanyData} />
          <ACHAddPayment setSelectedCompanyData={setSelectedCompanyData} />
        </TabPanel>
        <TabPanel header="Documents" visible={role === 'admin' ? true : false}>
          <CompanyDocumentsView selectedCompanyData={selectedCompanyData} />
        </TabPanel>
      </TabView>
    </div>
  )
}
