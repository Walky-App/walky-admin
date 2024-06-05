import React from 'react'

import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

import { useAdminCompanyPageContext } from '../AdminCompanyPage'

const headerCC = (
  <img
    alt="Credit Card"
    src="https://primefaces.org/cdn/primereact/images/usercard.png"
    className="w-15 h-10 object-cover"
  />
)
const headerACH = (
  <img
    alt="ACH"
    src="https://www.creativefabrica.com/wp-content/uploads/2021/08/07/Bank-Graphics-15604957-1-1-580x436.jpg"
    className="w-15 h-10 object-cover"
  />
)
const footer = (
  <>
    <Button label="Edit" icon="pi pi-check" text />
    <Button label="Disable" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} text />
  </>
)

export const AdminCompanyPaymentMethodsPage = () => {
  const { selectedCompanyData } = useAdminCompanyPageContext()

  return (
    <div className="flex flex-row">
      {selectedCompanyData.payment_information.map((payment, index) => {
        const header = payment.method === 'CC' ? headerCC : headerACH
        const title =
          payment.method === 'CC'
            ? `MasterCard **** ${payment.card_number?.slice(-4)}`
            : `Checking **** ${payment.account_number?.slice(-4)}`
        const subTitle = payment.method === 'CC' ? `Expires ${payment.expiration_date}` : `${payment.bank_name}`

        return (
          <Card
            key={index}
            title={title}
            subTitle={subTitle}
            footer={footer}
            header={header}
            className="md:w-25rem mx-2"
          />
        )
      })}
      <Card subTitle=" + Add new Payment Method " className="md:w-25rem mx-2 flex items-center" />
    </div>
  )
}
