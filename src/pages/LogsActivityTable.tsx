import { format } from 'date-fns'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import { type ILog } from '../interfaces/logs'

export const LogsActivityTable = ({ data }: { data: ILog[] }) => {
  return (
    <div className="card my-24 text-2xl print:hidden">
      <h1 className="border-t border-gray-200 py-12 text-xl font-bold">Activity Logs</h1>
      {data.length > 0 ? (
        <DataTable
          value={data}
          sortOrder={-1}
          sortField="createdAt"
          scrollable
          scrollHeight="calc(100vh - 300px)"
          dataKey="_id"
          className="text-lg"
          showGridlines
          tableStyle={{ minWidth: '50rem' }}>
          <Column field="event_type" header="Event Type" />
          <Column field="user_id" header="User" />
          <Column
            field="createdAt"
            sortable
            header="Created At"
            body={(log: ILog) => <span>{format(log.createdAt, 'MMM d, yyyy - h:mm a')}</span>}
          />
        </DataTable>
      ) : (
        <h2 className="text-3xl">No Activity Log</h2>
      )}
    </div>
  )
}
