import { Card } from 'primereact/card'
import { Chip } from 'primereact/chip'

import { type IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCcVisa, faCcMastercard, faCcAmex, faCcDiscover } from '@fortawesome/free-brands-svg-icons'
import { faBank, faUniversity } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { type ICompany } from '../../../../interfaces/company'

const getCardIcon = (paymentType: string, cardType?: string): IconDefinition | null => {
  if (paymentType === 'CC') {
    switch (cardType) {
      case 'Visa':
        return faCcVisa
      case 'MasterCard':
        return faCcMastercard
      case 'AmericanExpress':
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

const createHeader = (cardIcon: IconDefinition | null) =>
  cardIcon ? <FontAwesomeIcon icon={cardIcon} size="6x" /> : null

export const PaymentCards = ({
  selectedCompanyData,
  setSelectedPaymentId,
  cc,
  ach,
}: {
  selectedCompanyData: ICompany
  setSelectedPaymentId: (paymentId: string) => void
  cc?: boolean
  ach?: boolean
}) => {
  const showAllPayments = cc === undefined && ach === undefined

  const filteredPaymentInformation =
    selectedCompanyData.payment_information?.filter(payment => {
      if (showAllPayments) {
        return true
      }
      if (cc && payment.payment_method === 'CC') {
        return true
      }
      if (ach && payment.payment_method === 'ACH') {
        return true
      }
      return false
    }) || []

  return (
    <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
      {filteredPaymentInformation?.map((payment, index) => {
        let title = ''
        let subTitle = ''
        let cardHeader = null

        if (payment?.payment_method === 'CC') {
          const cardIcon = getCardIcon(payment?.payment_method, payment.payment_info.type)

          title = `${payment.payment_info?.card_name} `
          subTitle = `${payment.payment_info?.card_number ?? ''}`
          cardHeader = createHeader(cardIcon)
        } else {
          title = `ACH Account **** ${payment.payment_info?.ach_account_number?.slice(-4) ?? ''}`
          subTitle = `${payment.payment_info?.ach_bank_name}`
          cardHeader = createHeader(getCardIcon(payment.payment_info?.type ?? 'ACH'))
        }
        return (
          <Card
            key={index}
            onClick={() => {
              setSelectedPaymentId(payment.payment_info._id ?? '')
            }}
            title={
              <div className="align-center">
                {title}
                {payment?.is_default === true ? <Chip className="ml-2" label="Default" icon="pi pi-check" /> : null}
              </div>
            }
            subTitle={<div className="align-center">{subTitle}</div>}
            header={cardHeader}
            pt={{ header: { className: 'flex items-center' } }}
            className="md:w-25rem flex cursor-pointer p-3"
          />
        )
      })}
    </div>
  )
}
