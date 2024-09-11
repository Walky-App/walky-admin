import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { formatInTimeZone } from 'date-fns-tz'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'

import { type IJob } from '../../../interfaces/job'
import { exportToExcelTable } from '../../../utils/primeReactUtils'

export const JobsListView = ({ jobs, role }: { jobs: IJob[]; role: string }) => {
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const navigate = useNavigate()

  const handleIsShiftsFilled = (job: IJob) =>
    job.job_days?.every(jobDay => (jobDay.shifts_id?.user_shifts?.length || 0) >= job.vacancy)

  const rowClassName = (job: IJob) => {
    if (job.is_active && !handleIsShiftsFilled(job)) {
      return 'bg-red-100 text-gray-700'
    } else if (job.is_active) {
      return 'bg-green-100 text-gray-700 '
    } else if (!job.is_active) {
      return 'bg-none'
    }
  }

  const getHeader = () => {
    return (
      <div className="justify-content-end flex">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
          />
        </IconField>
      </div>
    )
  }

  const paginatorRight = (
    <Button type="button" icon="pi pi-download" text onClick={() => exportToExcelTable(jobs, 'jobs')} />
  )

  return (
    <div className="card text-2xl">
      <DataTable
        data-testid="states-detail-view"
        value={jobs}
        paginator
        rows={20}
        rowsPerPageOptions={[20, 40, 50]}
        rowClassName={rowClassName}
        sortOrder={-1}
        sortField="createdAt"
        scrollable
        scrollHeight="calc(100vh - 300px)"
        frozenWidth="200px"
        dataKey="_id"
        className="text-lg"
        globalFilter={globalFilter}
        header={getHeader()}
        resizableColumns
        showGridlines
        paginatorLeft={`Total ${jobs.length} jobs`}
        paginatorRight={paginatorRight}
        tableStyle={{ minWidth: '50rem' }}>
        <Column
          frozen
          field="uid"
          header="#"
          body={job => <Button text label={job.uid} onClick={() => navigate(`/${role}/jobs/${job._id}`)} />}
        />
        <Column field="facility.name" header="Facility" />
        <Column
          sortable
          field="job_dates[0]"
          header="Starts"
          body={(item: IJob) => {
            return formatInTimeZone(item.job_dates[0], item.facility.timezone, 'MMM d')
          }}
        />
        <Column
          header="Ends"
          body={(item: IJob) =>
            formatInTimeZone(item.job_dates[item.job_dates.length - 1], item.facility.timezone, 'MMM d')
          }
        />
        <Column field="job_days.length" header="Days" />
        <Column field="vacancy" header="Shifts" />
        <Column field="total_hours" header="Hours" />
        <Column field="is_active" header="Status" sortable body={(d: IJob) => (d.is_active ? 'Active' : 'Pending')} />
        <Column
          header="Filled"
          body={(singleJob: IJob) => {
            const totalShifts = singleJob.vacancy * singleJob.job_days.length
            const filledShifts = singleJob.job_days.reduce((acc, jobDay) => {
              return acc + (jobDay?.shifts_id?.user_shifts?.length || 0)
            }, 0)

            if (filledShifts === totalShifts) {
              return '✅'
            } else if (filledShifts > totalShifts) {
              return `${filledShifts} / ${totalShifts} ✅⚠️`
            } else {
              return `${filledShifts} / ${totalShifts} ❌`
            }
          }}
        />
        <Column field="title" header="Title" />
        <Column field="created_by" header="Created by" />
      </DataTable>
    </div>
  )
}
