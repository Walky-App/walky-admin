import { TabPanel, TabView } from 'primereact/tabview'

import { type IJob } from '../../../../interfaces/job'
import { DroppedShiftsByJob } from './DroppedShiftsByJob'
import { JobDetailApplicantTimesheetTabAdmin } from './JobDetailApplicantTimesheetTabAdmin'

export const JobDetailBottomAdmin = ({ job }: { job: IJob }) => {
  return (
    <div className="col-span-1 md:col-span-3">
      <TabView className="mt-4">
        <TabPanel header="Timesheet">
          <JobDetailApplicantTimesheetTabAdmin job={job} />
        </TabPanel>
        <TabPanel header="Facility Images">{facilityImagesTemplate(job)}</TabPanel>
        <TabPanel header="Dropped Shifts">
          <DroppedShiftsByJob jobId={job._id} />
        </TabPanel>
      </TabView>
    </div>
  )
}

const facilityImagesTemplate = (job: IJob) => {
  return (
    <section className="mt-4">
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
    </section>
  )
}
