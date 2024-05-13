// todo: Create a skeleton component to show loading state of the table

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Skeleton } from 'primereact/skeleton'

export const Skeletons = (columns: any) => {
  // const items: number[] = Array.from({ length: 5 }, (v, i) => i)

  return (
    <div className="card">
      {/* @ts-ignore */}
      <DataTable value={columns} className="p-datatable-striped">
        {columns?.map((column: any) => (
          <Column key={column.Header} field="code" header="Code" style={{ width: '25%' }} body={<Skeleton />} />
        ))}
        // <Column field="name" header="Name" style={{ width: '25%' }} body={<Skeleton />} />
        // <Column field="category" header="Category" style={{ width: '25%' }} body={<Skeleton />} />
        // <Column field="quantity" header="Quantity" style={{ width: '25%' }} body={<Skeleton />} />
      </DataTable>
    </div>
  )
}
