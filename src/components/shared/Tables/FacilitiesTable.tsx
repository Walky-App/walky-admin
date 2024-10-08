import React from 'react'

import { ProgressSpinner } from 'primereact/progressspinner'

import { GlobalTable } from '../GlobalTable'

interface FacilitiesTableProps {
  columns: unknown[]
  data: unknown[]
}

export const FacilitiesTable: React.FC<FacilitiesTableProps> = ({ columns, data }) => {
  return !data ? (
    <div className="flex items-center justify-center">
      <ProgressSpinner aria-label="Loading" style={{ color: 'green' }} />
    </div>
  ) : (
    <>
      <h2 className="prose text-gray-500"> Total Facilities {data.length}</h2>
      <GlobalTable data={data} columns={columns} allowClick />
    </>
  )
}
