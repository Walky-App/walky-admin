import { useEffect, useMemo, useState } from 'react'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { TabPanel, TabView } from 'primereact/tabview'

import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import {
  type IPunchPairWithTotalTime,
  createPunchPairsWithTotalTime,
  getAllPunches,
  sortPunches,
} from '../../../../components/shared/timesheets/timesheetsUtils'
import { type IJob } from '../../../../interfaces/job'
import { type ITimeSheet } from '../../../../interfaces/timesheet'
import { requestService } from '../../../../services/requestServiceNew'
import { formatToDate, formatToTime, isTodaySameAsTimeStamp, isValidDate } from '../../../../utils/timeUtils'

const timesheetTableTemplate = (punchPairsAndTotalTime: IPunchPairWithTotalTime[]) => {
  return (
    <>
      <h2 className="text-base font-semibold leading-6 text-gray-900">Timesheet</h2>
      <DataTable value={punchPairsAndTotalTime} stripedRows paginator rows={7} rowsPerPageOptions={[7, 14, 30]}>
        <Column
          field="punchIn.time_stamp"
          header="Date"
          body={(rowData: IPunchPairWithTotalTime) =>
            isValidDate(rowData.punchIn.time_stamp) ? formatToDate(rowData.punchIn.time_stamp) : 'No Timestamp'
          }
        />
        <Column header="Time In" body={rowData => formatToTime(rowData.punchIn.time_stamp)} />
        <Column
          header="Time Out"
          body={(rowData: IPunchPairWithTotalTime) =>
            rowData.punchOut
              ? formatToTime(rowData.punchOut.time_stamp)
              : isTodaySameAsTimeStamp(rowData.punchIn.time_stamp)
                ? 'Clocked In'
                : 'Clock Out not recorded'
          }
        />
        <Column header="Total Time" body={(rowData: IPunchPairWithTotalTime) => rowData.totalTime ?? ''} />
      </DataTable>
    </>
  )
}

const facilityImagesTemplate = (job: IJob) => {
  return (
    <>
      <h2 className="text-base font-semibold leading-6 text-gray-900">Facility Images</h2>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {job?.facility?.images?.map(image => (
          <li key={image._id} className="relative">
            <div className="aspect-h-7 aspect-w-10 group block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
              <img src={image.url} alt="" className="pointer-events-none h-80 object-cover group-hover:opacity-75" />
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export const JobDetailBottomAdmin = ({ job }: { job: IJob }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>()
  const [timesheets, setTimesheets] = useState<ITimeSheet[] | null>(null)

  useEffect(() => {
    if (selectedUserId == null) return
    const getCurrentJobTimeSheets = async () => {
      try {
        const response = await requestService({
          path: `timesheets/employee/${selectedUserId}?job_id=${job?._id}`,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (response.status === 200) {
          const data: ITimeSheet[] = await response.json()

          setTimesheets(data)
        }
      } catch (error) {
        console.error('Failed to fetch timesheet:', error)
        setTimesheets(null)
      }
    }

    getCurrentJobTimeSheets()
  }, [job?._id, selectedUserId])

  const punchPairsAndTotalTime: IPunchPairWithTotalTime[] = useMemo(() => {
    if (!timesheets) {
      return []
    }

    const allPunches = getAllPunches(timesheets)
    const sortedPunches = sortPunches(allPunches)

    return createPunchPairsWithTotalTime(sortedPunches)
  }, [timesheets])

  const userDropdownOptions = () => {
    return job.applicants.map(applicant => ({
      label: `${applicant.user.first_name} ${applicant.user.last_name}`,
      value: applicant.user._id,
    }))
  }

  return (
    <div className="col-span-1 md:col-span-3">
      <TabView className="mt-4">
        <TabPanel header="Timesheet">
          <section className="mt-4 space-y-6">
            <div>
              <HtInputLabel htmlFor="working_applicant" labelText="Working applicant:" />
              <Dropdown
                value={selectedUserId}
                name="working_applicant"
                placeholder="Select an applicant"
                onChange={event => setSelectedUserId(event.value)}
                options={userDropdownOptions()}
                filter
                className="w-full sm:max-w-xs"
              />
            </div>
            <div>{timesheetTableTemplate(punchPairsAndTotalTime)}</div>
          </section>
        </TabPanel>
        <TabPanel header="Facility Images">
          <section className="mt-4">{facilityImagesTemplate(job)}</section>
        </TabPanel>
      </TabView>
    </div>
  )
}
