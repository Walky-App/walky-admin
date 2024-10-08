import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Sidebar } from 'primereact/sidebar'
import { Skeleton } from 'primereact/skeleton'
import { TabPanel, TabView } from 'primereact/tabview'

import { type ICompany } from '../../../interfaces/company'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'
import { CompanyDetailForm } from './CompanyDetailForm'
import { CompanyDocumentsView } from './CompanyDocumentsView'
import { CreditCardView } from './CreditCardView'
import { ACHAddPayment } from './components/ACHAddPayment'
import { CreditCardEditDelete } from './components/CreditCardEditDelete'
import { PaymentCards } from './components/PaymentCards'
import { RequestACHApproval } from './components/RequestACHApproval'

export const CompanyDetailView = () => {
  const [selectedCompanyData, setSelectedCompanyData] = useState<ICompany>({} as ICompany)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const role = roleChecker()

  const selectedCompanyId = useParams().id ?? ''

  useEffect(() => {
    setLoading(true)
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
      } finally {
        setLoading(false)
      }
    }
    getCompanyWithPaymentInfo()
  }, [selectedCompanyId])

  const headerSkeleton = (
    <div>
      <Skeleton width="5rem" height="2rem" className="mb-2" />
      <Skeleton width="10rem" height="2rem" className="mb-2" />
    </div>
  )

  const isAchClient = selectedCompanyData?.payment_information?.some(payment => payment.payment_method === 'ACH')

  return (
    <div>
      <Sidebar
        visible={selectedPaymentId ? true : false}
        onHide={() => setSelectedPaymentId('')}
        position="right"
        blockScroll={true}
        className="w-full sm:w-1/2">
        <CreditCardEditDelete
          companyId={selectedCompanyId}
          selectedPaymentId={selectedPaymentId}
          setSelectedPaymentId={setSelectedPaymentId}
          setSelectedCompanyData={setSelectedCompanyData}
        />
      </Sidebar>

      {loading ? (
        headerSkeleton
      ) : (
        <div className="mb-8">
          <div className="text-3xl font-bold">{selectedCompanyData.company_name}</div>
          <div>{selectedCompanyData.company_address}</div>
        </div>
      )}

      <TabView>
        <TabPanel header="Details">
          <CompanyDetailForm selectedCompanyData={selectedCompanyData} />
        </TabPanel>
        {role === 'admin' || !isAchClient ? (
          <TabPanel header="Credit Cards">
            {loading ? (
              <Skeleton height="5rem" />
            ) : (
              <PaymentCards selectedCompanyData={selectedCompanyData} cc setSelectedPaymentId={setSelectedPaymentId} />
            )}
            <CreditCardView setSelectedCompanyData={setSelectedCompanyData} />
          </TabPanel>
        ) : null}
        <TabPanel header="ACH / Terms">
          {loading ? (
            <Skeleton height="5rem" />
          ) : (
            <>
              <PaymentCards selectedCompanyData={selectedCompanyData} ach setSelectedPaymentId={setSelectedPaymentId} />
              {role === 'client' ? (
                <RequestACHApproval
                  selectedCompanyData={selectedCompanyData}
                  setSelectedCompanyData={setSelectedCompanyData}
                />
              ) : (
                <ACHAddPayment setSelectedCompanyData={setSelectedCompanyData} />
              )}
            </>
          )}
        </TabPanel>
        <TabPanel header="Documents" visible={role === 'admin' ? true : false}>
          <CompanyDocumentsView
            selectedCompanyData={selectedCompanyData}
            setSelectedCompanyData={setSelectedCompanyData}
          />
        </TabPanel>
      </TabView>
    </div>
  )
}
