import { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'

import { formatInTimeZone, format } from 'date-fns-tz'
import { Tag } from 'primereact/tag'

import { MapPinIcon, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/20/solid'
import { BookmarkIcon as BookmarkIconOutlined } from '@heroicons/react/24/outline'

import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'
import { isJobNewWithinThreeDays } from '../../../utils/timeUtils'
import { GetTokenInfo } from '../../../utils/tokenUtil'

interface JobListItemProps {
  job: IJob
  handleSaveUnsaveJob?: (jobId: string, isSaved: boolean) => void
  status?: string
}

export const JobCard = ({ job, handleSaveUnsaveJob, status }: JobListItemProps) => {
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
      } else {
        if (handleSaveUnsaveJob) {
          handleSaveUnsaveJob(job._id, !savedJob)
        }
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

  return (
    <li
      key={job._id}
      className="col-span-1 divide-y divide-gray-200 rounded-lg transition delay-150 ease-in-out hover:shadow-2xl">
      {/* Job Card */}
      <div className="h-full flex-col items-start justify-center rounded-lg border border-zinc-100 bg-white">
        <Link to={`/employee/jobs/${job._id}`}>
          {/* Job Skills */}
          <div className="mb-3 flex basis-1/3 flex-wrap justify-between gap-2 px-5 pt-5">
            <div className="flex flex-row">
              <span className="pi pi-users" />
              <p className="ml-1 text-stone-500">{job.job_days.length * job.vacancy} Shifts</p>
            </div>
            <div className="flex flex-row space-x-2">
              {status === 'saved' ? <Tag value="Saved" rounded icon="pi pi-folder" severity="info" /> : null}
              {status === 'active' ? <Tag value="Enrolled" rounded icon="pi pi-check" severity="success" /> : null}
              {status === 'dropped' ? <Tag value="Dropped" rounded icon="pi pi-times" severity="danger" /> : null}
              {status === 'past' ? <Tag value="Old Shift" rounded icon="pi pi-lock" severity="warning" /> : null}
              {isJobNewWithinThreeDays(job.createdAt) ? <Tag rounded value="New" /> : null}
            </div>
          </div>

          {/* Job Details */}
          <div className="flex w-full basis-2/3 cursor-pointer flex-col items-start justify-start gap-4 px-5 pb-5">
            <p className="mt-4 text-balance text-base font-semibold capitalize text-black">
              {job.title} - #{job.uid}
            </p>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-start gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                <div className="mt-0.5 flex flex-col gap-1">
                  <span className="font-medium text-black">{job?.facility?.city}</span>
                  {job.distance ? <span className="text-stone-500">{job.distance} miles</span> : null}
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="h-px w-full bg-zinc-100" />

            {/* Shift Schedule */}
            <div className="flex flex-wrap items-center justify-start gap-3">
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-stone-500">Job Dates</div>
                <div className="text-black">
                  {earliestDate ? formatInTimeZone(earliestDate, job.facility?.timezone, 'P') : null} -
                  {latestDate ? formatInTimeZone(latestDate, job.facility?.timezone, 'P') : null}
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-stone-500">Job Time</div>
                <div className="text-black">
                  {formatInTimeZone(job.start_time, job.facility?.timezone, 'hh:mm a')} &nbsp;-&nbsp;
                  {formatInTimeZone(job.end_time, job.facility?.timezone, 'hh:mm a')}(
                  {format(new Date(), 'zzz', { timeZone: job.facility?.timezone })})
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-stone-500">Hours Daily</div>
                <div className="text-black">{job.total_hours}</div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-stone-500">Hourly Rate</div>
                <div className="text-black">${job.hourly_rate || 0} USD</div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-stone-500">Number of Days</div>
                <div className="text-black">{job.job_dates.length}</div>
              </div>
            </div>
          </div>
        </Link>

        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-bl-lg rounded-br-lg bg-neutral-100 px-5 py-4">
          <div className="flex flex-wrap items-center justify-start gap-1">
            <div className="text-balance text-stone-500">Posted on {new Date(job.createdAt).toLocaleDateString()} </div>
          </div>
          {status !== 'active' ? (
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
              <div className="text-stone-500">{savedJob ? 'Un-save' : 'Save Job'}</div>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  )
}
