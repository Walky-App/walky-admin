import { useMemo } from 'react'

import { TabPanel, TabView } from 'primereact/tabview'

import { applicantTimesheetTableTemplate } from '../../../../components/shared/jobDetail/jobDetailUtils'
import {
  type IPunchPairsWithData,
  type ITimesheetWithJobAndShiftDetails,
  processPunchPairsWithData,
} from '../../../../components/shared/timesheets/timesheetsUtils'
import { type IJob } from '../../../../interfaces/job'

export const JobDetailBottomComponents = ({
  timesheets,
  job,
  userWorkingInThisJob,
}: {
  timesheets: ITimesheetWithJobAndShiftDetails[] | null
  job: IJob
  userWorkingInThisJob: boolean
}) => {
  const punchPairsAndData: IPunchPairsWithData[] = useMemo(() => {
    if (!timesheets) {
      return []
    }

    const processedPunchPairsWithData = timesheets.map(timesheet => {
      return processPunchPairsWithData(timesheet)
    })

    return processedPunchPairsWithData
  }, [timesheets])

  return (
    <div className="col-span-1 md:col-span-3">
      <TabView className="mt-4">
        <TabPanel header="Timesheet">
          <section className="mt-4">
            {applicantTimesheetTableTemplate(punchPairsAndData, job.facility.timezone)}
          </section>
        </TabPanel>
        {userWorkingInThisJob ? (
          <TabPanel header="Facility Images">
            <section className="mt-4">{facilityImagesTemplate(job)}</section>
          </TabPanel>
        ) : null}
      </TabView>
    </div>
  )
}

const facilityImagesTemplate = (job: IJob) => {
  return (
    <>
      <h2 className="text-base font-semibold leading-6">Facility Images</h2>
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
