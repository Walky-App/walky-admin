import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from 'flowbite-react'
import { BriefcaseIcon, MapPinIcon, CreditCardIcon, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/20/solid'
import { BookmarkIcon as BookmarkIconOutlined } from '@heroicons/react/24/outline'
export default function JobListItem({ job }: any) {
  const [savedJob, setSavedJob] = useState(false)

  const handleSaveJob = () => {
    setSavedJob(!savedJob)
  }

  return (
    <li
      key={job.company_id}
      className="col-span-1 divide-y divide-gray-200 rounded-lg transition delay-150 ease-in-out hover:shadow-2xl">
      {/* Job Card */}
      <div className="flex h-full flex-col items-start justify-center rounded-lg border border-zinc-100 bg-white">
        <Link to={`/employee/jobs/${job._id}`}>
          {/* Job Skills */}
          <div className="mb-3 flex basis-1/3 flex-wrap gap-2 px-5 pt-5">
            {job.skills.map((skill: string) => (
              <Badge key={skill} color="gray" size="sm">
                <p className="text-xs font-normal text-stone-500">{skill}</p>
              </Badge>
            ))}
          </div>

          {/* Job Details */}
          <div className="flex w-full basis-2/3 cursor-pointer flex-col items-start justify-start gap-4 px-5 pb-5">
            <p className="text-balance text-base font-semibold capitalize text-black">{job.title}</p>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-start gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                <div className="mt-0.5 flex flex-col gap-1">
                  <span className="text-xs font-medium text-black">Anchorage</span>
                  <span className="text-xs font-normal text-stone-500">(4.2 mi)</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CreditCardIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                <div className="mt-0.5 flex flex-col gap-1">
                  <span className="text-xs font-medium text-black">Est. ${job.salary}</span>
                  <span className="text-xs font-normal text-stone-500">($40/hr)</span>
                </div>
              </div>
              <div className="mt-0.5 flex items-start gap-2">
                <BriefcaseIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />

                <div className="text-xs font-medium text-black">Senior</div>
              </div>
            </div>

            {/* Divider */}
            <hr className="h-px w-full bg-zinc-100" />

            {/* Shift Schedule */}
            <div className="flex flex-wrap items-center justify-start gap-3">
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-xs font-normal text-stone-500">Shift Schedule</div>
                <div className="text-xs font-normal text-black">Weekly</div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-xs font-normal text-stone-500">Shift Date</div>
                <div className="text-xs font-normal text-black">Oct 01, 2023 - Oct 20, 2023</div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-xs font-normal text-stone-500">Shift Time</div>
                <div className="text-xs font-normal text-black">10:00 AM - 07:00 PM</div>
              </div>
            </div>
          </div>
        </Link>

        {/* Job Card Footer */}
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-bl-lg rounded-br-lg bg-neutral-100 px-5 py-4">
          <div className="flex flex-wrap items-center justify-start gap-1">
            <div className="text-balance text-xs font-normal text-stone-500">Posted 3 mins ago </div>
            <div className="h-1 w-1 rounded-full bg-stone-500" />
            <div className="text-xs font-normal text-stone-500">#{job.uid}</div>
          </div>
          <div onClick={handleSaveJob} className="flex h-4 cursor-pointer items-center justify-start gap-1">
            {savedJob ? (
              <BookmarkIconSolid className="h-5 w-5 text-stone-500" />
            ) : (
              <BookmarkIconOutlined className="h-5 w-5 text-stone-500" />
            )}
            <div className="text-xs font-normal text-stone-500">{savedJob ? 'Un-save' : 'Save Job'}</div>
          </div>
        </div>
      </div>
    </li>
  )
}
