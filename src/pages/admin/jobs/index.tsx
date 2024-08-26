import { useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { format, isToday, isYesterday } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IJob } from '../../../interfaces/job'
import { requestService } from '../../../services/requestServiceNew'

export const AdminJobs = () => {
  const [jobsData, setJobsData] = useState<IJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await requestService({ path: 'jobs/by-admin' })

        if (response.ok) {
          const allJobs = await response.json()
          setJobsData(allJobs)
        }
      } catch (error) {
        console.error('Error fetching job data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getJobs()
  }, [])

  const memoJobsData = useMemo(() => jobsData, [jobsData])

  const rowClassName = (job: IJob) => {
    return { 'p-highlight': job.is_active }
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

  const header = getHeader()

  return isLoading ? (
    <HTLoadingLogo />
  ) : (
    <div className="card text-2xl">
      <DataTable
        data-testid="states-detail-view"
        value={memoJobsData}
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
        header={header}
        resizableColumns
        showGridlines
        tableStyle={{ minWidth: '50rem' }}>
        <Column
          frozen
          field="uid"
          header="#"
          body={job => <Button text label={job.uid} onClick={() => navigate(`/admin/jobs/${job._id}`)} />}
        />
        <Column field="title" header="Title" />
        <Column field="facility.name" header="Facility" />
        <Column field="created_by" header="Created by" />
        <Column
          sortable
          field="createdAt"
          header="Created"
          body={(a: IJob) => {
            return isToday(a.createdAt) ? 'Today' : isYesterday(a.createdAt) ? 'Yesterday' : format(a.createdAt, 'P')
          }}
        />
        <Column
          header="Starts"
          body={(item: IJob) => formatInTimeZone(item.job_dates[0], item.facility.timezone, 'P')}
        />
        <Column
          header="Ends"
          body={(item: IJob) =>
            formatInTimeZone(item.job_dates[item.job_dates.length - 1], item.facility.timezone, 'P')
          }
        />
        <Column field="job_days.length" header="Days" />
        <Column field="vacancy" header="Shifts" />
        <Column field="total_hours" header="Hours" />
        <Column field="is_active" header="Status" body={(d: IJob) => (d.is_active ? 'Active' : 'Pending')} />
        <Column
          header="Filled"
          body={(d: IJob) => (d.job_days?.every(day => day.shifts_id?.user_shifts?.length === d.vacancy) ? '✅' : '❌')}
        />
      </DataTable>
    </div>
  )
}
