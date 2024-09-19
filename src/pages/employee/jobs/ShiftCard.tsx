import { Link } from 'react-router-dom'

import { formatInTimeZone } from 'date-fns-tz'
import { Divider } from 'primereact/divider'
import { Tag } from 'primereact/tag'

import { MapPinIcon } from '@heroicons/react/20/solid'

import { roleChecker } from '../../../utils/roleChecker'
import { isJobNewWithinThreeDays } from '../../../utils/timeUtils'
import { type IShift } from './MyJobs'

interface JobListItemProps {
  shift: IShift
  status?: string
}

export const ShiftCard = ({ shift, status }: JobListItemProps) => {
  const role = roleChecker()
  return (
    <li
      key={shift._id}
      className="col-span-1 divide-y divide-gray-200 rounded-lg transition delay-150 ease-in-out hover:shadow-2xl">
      <div className="h-full flex-col items-start justify-center rounded-lg border border-zinc-100">
        <Link to={`/${role}/jobs/${shift.job_id._id}`}>
          <div className="mb-3 flex basis-1/3 flex-wrap justify-between gap-2 px-5 pt-5">
            <div className="flex flex-row">
              <span className="pi pi-users" />
              <p className="ml-1 ">1 of {shift.job_id.vacancy} Shifts</p>
            </div>
            <div className="flex flex-row space-x-2">
              {status === 'saved' ? <Tag value="Saved" rounded icon="pi pi-folder" severity="info" /> : null}
              {status === 'active' ? <Tag value="Enrolled" rounded icon="pi pi-check" severity="success" /> : null}
              {status === 'dropped' ? <Tag value="Dropped" rounded icon="pi pi-times" severity="danger" /> : null}
              {status === 'past' ? <Tag value="Old Shift" rounded icon="pi pi-lock" severity="warning" /> : null}
              {isJobNewWithinThreeDays(shift.job_id.createdAt) ? <Tag rounded value="New" /> : null}
            </div>
          </div>

          <div className="flex w-full basis-2/3 cursor-pointer flex-col items-start justify-start gap-4 px-5 pb-5">
            <div className="mt-4 flex w-full justify-between gap-3">
              <div className="flex flex-col items-start justify-start gap-1  pl-3">
                <div className="">Shift Date</div>
                <div className="text-2xl ">{new Date(shift.shift_day).toDateString()}</div>
              </div>
              <div className="flex flex-col items-end justify-start gap-1 border-l-[3px] border-zinc-100 pl-12">
                <div className="">Job Start Time</div>
                <div className="text-2xl ">
                  {formatInTimeZone(shift.shift_start_time, shift.job_id.facility?.timezone, 'p')}
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex w-full justify-between">
              <div className="flex flex-col items-start justify-start gap-1">
                <div className="">Location:</div>

                <div className="flex ">
                  <MapPinIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  <div>{shift?.job_id?.facility?.city}</div>
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="">Hours</div>
                <div className="">{shift?.job_id?.total_hours}</div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="">Job ID</div>
                <div className="">#{shift?.job_id?.uid}</div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="">Hourly Rate</div>
                <div className="">${shift?.job_id?.hourly_rate || 0} USD</div>
              </div>
            </div>
            <div className="flex w-full justify-between border-t-[1px] border-zinc-100 pt-5">
              <div className="flex flex-col items-start justify-start gap-1  pl-3">
                <div className="">Job Title</div>
                <div className="text-xl ">{shift?.job_id?.title}</div>
              </div>
              <div className="flex flex-col items-end justify-start gap-1 border-l-[3px] border-zinc-100 pl-12">
                <div className="">Facility Name: </div>
                <div className="text-xl ">{shift?.job_id?.facility?.name}</div>
              </div>
            </div>
          </div>
        </Link>

        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-bl-lg rounded-br-lg px-5 py-4">
          <div className="flex flex-wrap items-center justify-start gap-1">
            <div className="text-balance ">Posted on {new Date(shift.createdAt).toLocaleDateString()} </div>
          </div>
        </div>
      </div>
    </li>
  )
}
