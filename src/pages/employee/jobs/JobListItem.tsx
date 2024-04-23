import { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'

import { MapPinIcon, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/20/solid'
import { BookmarkIcon as BookmarkIconOutlined } from '@heroicons/react/24/outline'

import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/tokenUtil'

interface JobListItemProps {
  job: IJob
}

export const JobListItem = ({ job }: JobListItemProps) => {
  const [savedJob, setSavedJob] = useState(false)
  const { _id } = GetTokenInfo()

  useEffect(() => {
    const isSaved = job.saved_by.includes(_id)
    setSavedJob(isSaved)
  }, [job.saved_by, _id])

  const handleSaveUnsaveClickOptimistic = async () => {
    const currentSavedState = savedJob
    setSavedJob(!savedJob)

    try {
      const responseContent = await RequestService(`jobs/${job._id}/${savedJob ? 'unsave' : 'save'}`, 'POST', {
        user_id: _id,
      })

      if (!responseContent || responseContent.message.includes('error')) {
        setSavedJob(currentSavedState)
        console.error('Failed to change save state:', responseContent.message)
      }
    } catch (error) {
      setSavedJob(currentSavedState)
      console.error('Error while changing save state:', error)
    }
  }

  let earliestDate, latestDate

  if (job) {
    const dateTimes = job.job_dates.map(dateString => new Date(dateString).getTime())
    ;[earliestDate, latestDate] = [new Date(Math.min(...dateTimes)), new Date(Math.max(...dateTimes))]
  }

  function convertToStandardTime(militaryTime: number) {
    if (militaryTime == null) {
      return 'Time not set'
    }
    const militaryTimeString = militaryTime.toString().padStart(4, '0')
    const hours = Number(militaryTimeString.slice(0, -2))
    const minutes = Number(militaryTimeString.slice(-2))
    const standardHours = ((hours + 11) % 12) + 1
    const amPm = hours >= 12 ? 'pm' : 'am'
    return `${standardHours}:${minutes < 10 ? '0' : ''}${minutes} ${amPm}`
  }

  return (
    <li
      key={job._id}
      className="col-span-1 divide-y divide-gray-200 rounded-lg transition delay-150 ease-in-out hover:shadow-2xl">
      {/* Job Card */}
      <div className="flex h-full flex-col items-start justify-center rounded-lg border border-zinc-100 bg-white">
        <Link to={`/employee/jobs/${job._id}`}>
          {/* Job Skills */}
          <div className="mb-3 flex basis-1/3 flex-wrap gap-2 px-5 pt-5">
            <span className="pi pi-users" />
            <p className="text-xs font-normal text-stone-500">
              {job.applicants.length} / {job.vacancy} Applicants
            </p>
          </div>

          {/* Job Details */}
          <div className="flex w-full basis-2/3 cursor-pointer flex-col items-start justify-start gap-4 px-5 pb-5">
            <p className="mt-4 text-balance text-base font-semibold capitalize text-black">{job.title}</p>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-start gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                <div className="mt-0.5 flex flex-col gap-1">
                  <span className="text-xs font-medium text-black">{job?.facility?.city}</span>
                  <span className="text-xs font-normal text-stone-500">{job.distance} miles</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="h-px w-full bg-zinc-100" />

            {/* Shift Schedule */}
            <div className="flex flex-wrap items-center justify-start gap-3">
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-xs font-normal text-stone-500">Job Dates</div>
                <div className="text-xs font-normal text-black">
                  {earliestDate?.toLocaleDateString()} - {latestDate?.toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-xs font-normal text-stone-500">Job Time</div>
                <div className="text-xs font-normal text-black">
                  {convertToStandardTime(job.start_time)} - {convertToStandardTime(job.end_time)}
                </div>{' '}
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-xs font-normal text-stone-500">Hours Daily</div>
                <div className="text-xs font-normal text-black">{job.total_hours}</div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-xs font-normal text-stone-500">Hourly Rate</div>
                <div className="text-xs font-normal text-black">{job.hourly_rate || 0} USD</div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-xs font-normal text-stone-500">Number of Days</div>
                <div className="text-xs font-normal text-black">{job.job_dates.length}</div>
              </div>
            </div>
          </div>
        </Link>

        {/* Job Card Footer */}
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-bl-lg rounded-br-lg bg-neutral-100 px-5 py-4">
          <div className="flex flex-wrap items-center justify-start gap-1">
            <div className="text-balance text-xs font-normal text-stone-500">
              Posted on {new Date(job.createdAt).toLocaleDateString()}{' '}
            </div>
            <div className="h-1 w-1 rounded-full bg-stone-500" />
            <div className="text-xs font-normal text-stone-500">#{job.uid}</div>
          </div>
          <div
            onClick={handleSaveUnsaveClickOptimistic}
            role="button"
            tabIndex={0}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                handleSaveUnsaveClickOptimistic()
              }
            }}
            className="flex h-4 cursor-pointer items-center justify-start gap-1">
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
