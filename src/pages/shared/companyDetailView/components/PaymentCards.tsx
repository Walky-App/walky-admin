import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { Card } from 'primereact/card'
import { Chip } from 'primereact/chip'

import { type IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCcVisa, faCcMastercard, faCcAmex, faCcDiscover } from '@fortawesome/free-brands-svg-icons'
import { faBank, faUniversity } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { type ICompany } from '../../../../interfaces/company'
import { roleChecker } from '../../../../utils/roleChecker'

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

export const PaymentCards = ({ selectedCompanyData }: { selectedCompanyData: ICompany }) => {
  const navigate = useNavigate()
  const role = roleChecker()

  const selectedCompanyId = useParams().id

  const navigateToDetails = (paymentId: string) => {
    if (role === 'client') {
      navigate(`/client/companies/${selectedCompanyId}/payment/${paymentId}`)
    } else {
      navigate(`/admin/companies/${selectedCompanyId}/payment/${paymentId}`)
    }
  }

  // const setDefaultPayment = async (paymentId: string) => {
  //   try {
  //     const response = await requestService({
  //       path: `companies/${selectedCompanyId}/payments/set-default-payment`,
  //       method: 'POST',
  //       body: JSON.stringify({ paymentId }),
  //     })
  //     if (!response.ok) {
  //       throw new Error('Failed to set payment method as default')
  //     }
  //   } catch (error) {
  //     console.error('Error setting default payment method: ', error)
  //   }
  // }

  return (
    <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
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
            onClick={() => navigateToDetails(payment.payment_info._id)}
            title={
              <div className="align-center">
                {title}
                {payment?.payment_info.isDefault === true ? <Chip label="Default" icon="pi pi-check" /> : null}{' '}
              </div>
            }
            subTitle={<div className="align-center">{subTitle}</div>}
            header={cardHeader}
            className="md:w-25rem mx-2 flex cursor-pointer"
          />
        )
      })}
    </div>
  )
}
