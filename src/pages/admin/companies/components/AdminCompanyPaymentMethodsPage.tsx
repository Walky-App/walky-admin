import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

import { type IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCcVisa, faCcMastercard, faCcAmex, faCcDiscover } from '@fortawesome/free-brands-svg-icons'
import { faBank, faUniversity } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getCardType } from '../../../../utils/CreditCardTypeUtil'
import { useAdminCompanyPageContext } from '../AdminCompanyPage'

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
    {cardIcon ? <FontAwesomeIcon icon={cardIcon} size="8x" className="ml-2" /> : null}
  </div>
)

const footer = <Button label="Remove" severity="danger" icon="pi pi-times" style={{ marginLeft: '0.5em' }} text />

export const AdminCompanyPaymentMethodsPage = () => {
  const { selectedCompanyData } = useAdminCompanyPageContext()
  const companyId = selectedCompanyData._id
  const navigate = useNavigate()

  return (
    <div className="flex flex-col space-x-2 space-y-2 sm:flex-row sm:space-x-2 sm:space-y-2">
      {selectedCompanyData.payment_information.map((payment, index) => {
        let title = ''
        let subTitle = ''
        let cardHeader = null

        if (payment.payment_info.type === 'CC') {
          const cardType = getCardType(payment.payment_info.card_number ?? '')
          const cardIcon = getCardIcon(payment.payment_info.type, cardType)

          title = `${cardType} ending in ${payment.payment_info.card_number?.slice(-4) ?? ''}`
          subTitle = `Expires ${payment.payment_info.expiration_date}`
          cardHeader = createHeader(cardIcon)
        } else {
          title = `Account **** ${payment.payment_info.account_number?.slice(-4) ?? ''}`
          subTitle = `${payment.payment_info.bank_name}`
          cardHeader = createHeader(getCardIcon(payment.payment_info.type))
        }

        return (
          <Card
            key={index}
            title={<div className="align-center text-center">{title}</div>}
            subTitle={<div className="align-center text-center">{subTitle}</div>}
            footer={<div className="align-center text-center">{footer}</div>}
            header={cardHeader}
            className="md:w-25rem mx-2 flex cursor-pointer"
          />
        )
      })}
      <Card className="cursor-pointer" onClick={() => navigate(`/admin/companies/${companyId}/add-payment`)}>
        <div className="flex h-full items-center justify-center">
          <p>+ Add Payment Method</p>
        </div>
      </Card>
    </div>
  )
}
