import { useState } from 'react'

import { Dropdown } from 'primereact/dropdown'

import { InvoiceTable } from './components/InvoiceTable'

const transactions = [
  {
    id: 'AAPS0L',
    company: 'Chase & Co.',
    share: 'CAC',
    commission: '+$4.37',
    price: '$3,509.00',
    quantity: '12.00',
    netAmount: '$4,397.00',
  },
]

const reports = [
  { name: 'All Invoices', code: 'all_invoices' },
  // { name: 'Rome', code: 'RM' },
  // { name: 'London', code: 'LDN' },
  // { name: 'Istanbul', code: 'IST' },
  // { name: 'Paris', code: 'PRS' },
]

export const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState(null)

  return (
    <div className="w-full">
      <h1>AdminReports</h1>
      <div className="flex items-start">
        <Dropdown
          className=" w-1/5"
          value={selectedReport}
          onChange={e => setSelectedReport(e.value)}
          options={reports}
          optionLabel="name"
        />
        <InvoiceTable data={transactions} />
      </div>
    </div>
  )
}
