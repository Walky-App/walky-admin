import React from 'react'

import { useNavigate } from 'react-router-dom'

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
  const companyId = selectedCompanyData._id
  const navigate = useNavigate()

  return (
    <div className="flex flex-row">
      {selectedCompanyData.payment_information.map((payment, index) => {
        const header = payment.payment_info.method === 'CC' ? headerCC : headerACH
        const title =
          payment.payment_info.method === 'CC'
            ? `MasterCard **** ${payment.payment_info.card_number?.slice(-4)}`
            : `Account **** ${payment.payment_info.account_number?.slice(-4)}`
        const subTitle =
          payment.payment_info.method === 'CC'
            ? `Expires ${payment.payment_info.expiration_date}`
            : `${payment.payment_info.bank_name}`

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
      <Card
        subTitle=" + Add new Payment Method "
        className="md:w-25rem mx-2 flex cursor-pointer items-center"
        onClick={() => navigate(`/admin/companies/${companyId}/add-payment`)}
      />
    </div>
  )
}
