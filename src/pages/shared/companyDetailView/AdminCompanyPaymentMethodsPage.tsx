import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

import { type IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCcVisa, faCcMastercard, faCcAmex, faCcDiscover } from '@fortawesome/free-brands-svg-icons'
import { faBank, faUniversity } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type ICompany } from '../../../interfaces/company'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'

const getCardIcon = (paymentType: string, cardType?: string): IconDefinition | null => {
  if (paymentType === 'CC') {
    switch (cardType) {
      case 'Visa':
        return faCcVisa
      case 'MasterCard':
        return faCcMastercard
      case 'Amex':
        return faCcAmex
      case 'Discover':
        return faCcDiscover
      default:
        return null
    }
  } else if (paymentType === 'ACH') {
    return faBank
  } else if (paymentType === 'ECheck') {
    return faUniversity
  }
  return null
}

const createHeader = (cardIcon: IconDefinition | null) => (
  <div className="mt-2 flex justify-center">
    {cardIcon ? <FontAwesomeIcon icon={cardIcon} size="6x" className="ml-2" /> : null}
  </div>
)

export const AdminCompanyPaymentMethodsPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCompanyData, setSelectedCompanyData] = useState<ICompany>({} as ICompany)
  const role = roleChecker()

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
      } finally {
        setIsLoading(false)
      }
    }
    getCompany()
  }, [selectedCompanyId])

  const navigateToDetails = (paymentId: string) => {
    if (role === 'client') {
      navigate(`/client/companies/${selectedCompanyId}/payment/${paymentId}`)
    } else {
      navigate(`/admin/companies/${selectedCompanyId}/payment/${paymentId}`)
    }
  }

  const footer = (paymentId: string) => (
    <>
      <Button
        label="More details"
        icon="pi pi-info-circle"
        style={{ marginLeft: '0.5em' }}
        text
        onClick={() => navigateToDetails(paymentId)}
      />
      {/* <Button
      label="Set as default"
      icon="pi pi-check-circle"
      style={{ marginLeft: '0.5em' }}
      text
      onClick={() => setDefaultPayment(paymentId)}
    /> */}
    </>
  )

  if (isLoading) {
    return <HTLoadingLogo />
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {selectedCompanyData.payment_information?.map((payment, index) => {
        let title = ''
        let subTitle = ''
        let cardHeader = null

        if (payment?.payment_method === 'CC') {
          const cardIcon = getCardIcon(payment?.payment_method, payment.payment_info.type)

          title = `${payment.payment_info?.card_name} `
          subTitle = `${payment.payment_info?.card_number ?? ''}`
          cardHeader = createHeader(cardIcon)
        } else {
          title = `Account **** ${payment.payment_info?.account_number?.slice(-4) ?? ''}`
          subTitle = `${payment.payment_info?.bank_name}`
          cardHeader = createHeader(getCardIcon(payment.payment_info?.type))
        }
        return (
          <Card
            key={index}
            title={<div className="align-center">{title}</div>}
            subTitle={<div className="align-center">{subTitle}</div>}
            footer={<div className="align-center text-center">{footer(payment.payment_info?._id)}</div>}
            header={cardHeader}
            className="md:w-25rem mx-2 flex cursor-pointer"
          />
        )
      })}
      <Card
        className="cursor-pointer"
        onClick={() => {
          if (role === 'client') {
            navigate(`/client/companies/${selectedCompanyId}/add-payment`)
          } else {
            navigate(`/admin/companies/${selectedCompanyId}/add-payment`)
          }
        }}>
        <div className="flex h-full items-center justify-center">
          <p>+ Add Payment Method</p>
        </div>
      </Card>
    </div>
  )
}
