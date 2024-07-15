import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TabPanel, TabView } from 'primereact/tabview'

import { type ICompany } from '../../../interfaces/company'
import { requestService } from '../../../services/requestServiceNew'
import { AdminCompanyAddPaymentMethod } from './AdminCompanyAddPaymentMethod'
import { CompanyDetailForm } from './CompanyDetailForm'

export const CompanyDetailView = () => {
  const [selectedCompanyData, setSelectedCompanyData] = useState<ICompany>({} as ICompany)

  const selectedCompanyId = useParams().id
  useEffect(() => {
    const getCompany = async () => {
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
    getCompany()
  }, [selectedCompanyId])
  return (
    <div>
      <div className="mb-8">
        <div className="text-3xl font-bold">{selectedCompanyData.company_name}</div>
        <div className="">{selectedCompanyData.company_address}</div>
      </div>
      <TabView>
        <TabPanel header="Details">
          <CompanyDetailForm selectedCompanyData={selectedCompanyData} />
        </TabPanel>
        <TabPanel header="Credit Card">
          <AdminCompanyAddPaymentMethod setSelectedCompanyData={setSelectedCompanyData} />
        </TabPanel>
      </TabView>
    </div>
  )
}
