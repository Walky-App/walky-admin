import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BookmarkIcon as BookmarkIconSolid, BriefcaseIcon, CreditCardIcon, MapPinIcon } from '@heroicons/react/20/solid'
import { BookmarkIcon as BookmarkIconOutlined } from '@heroicons/react/24/outline'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

import 'primeicons/primeicons.css'

import { ProgressSpinner } from 'primereact/progressspinner'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { RequestService } from '../../../services/RequestService'

export default function JobDetailViewClient() {
  const [job, setJob] = useState<any>({})
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id

  function convertToStandardTime(militaryTime: number) {
    const militaryTimeString = militaryTime.toString().padStart(4, '0')
    const hours = Number(militaryTimeString.slice(0, -2))
    const minutes = Number(militaryTimeString.slice(-2))
    const standardHours = ((hours + 11) % 12) + 1
    const amPm = hours >= 12 ? 'pm' : 'am'
    return `${standardHours}:${minutes < 10 ? '0' : ''}${minutes} ${amPm}`
  }

  useEffect(() => {
    const getJob = async () => {
      try {
        const job = await RequestService(`jobs/${params.id}`)
        if (job) {
          setJob(job)
          console.log(job)
        } else {
          console.log('No job found with the given id')
        }
      } catch (error) {
        console.error('Error fetching job:', error)
      }
    }

    getJob()
  }, [])

  let earliestDate, latestDate

  if (job && job.job_dates) {
    earliestDate = new Date(Math.min(...job.job_dates.map((date: string) => new Date(date))))
    latestDate = new Date(Math.max(...job.job_dates.map((date: string) => new Date(date))))
  }
  return (
    <>
      <HeaderComponent title="Job Details" />
      <div className="flex items-start justify-between">
        {job && 'start_time' in job && 'end_time' in job && 'job_dates' in job ? (
          <div className='w-1/2'>
            <Card
              title={
                <>
                  <div className="flex items-center justify-between">
                    <div className="mb-2 text-xs font-normal text-stone-500"> N / {job.vacancy} Applicants </div>
                    <Button className="px-2 py-1 text-xs mb-4" label="Edit" onClick={() => navigate(`/client/jobs/${id}/edit`)} />                  </div>

                  {job.title}
                </>
              }>
              {/* Job Facility */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col items-start justify-start gap-1">
                  <div className="flex items-center">
                    <i className="pi pi-building"></i>
                    <div className="ml-2 text-base font-normal text-black">{job.facility.name}</div>
                  </div>
                  <div className="flex items-center">
                    <i className="pi pi-map-marker"></i>
                    <div className="ml-2 text-sm font-normal text-black">
                      {job.facility.address}, {job.facility.city}, {job.facility.state}, {job.facility.zip}
                    </div>
                  </div>
                </div>
              </div>
              {/* Divider */}
              <hr className="mb-3 mt-3 h-px w-full bg-zinc-100" />
              <div className="flex flex-wrap gap-8">
                <div className="flex items-start gap-2">
                  {job.isActive === true ? <i className="pi pi-check"></i> : <i className="pi pi-times-circle"></i>}
                  <div className="mt-0.5 flex flex-col gap-1">
                    <span className="text-xs font-medium text-black">Active</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  {job.isCompleted === false ? (
                    <i className="pi pi-calendar"></i>
                  ) : (
                    <i className="pi pi-calendar-times"></i>
                  )}
                  <div className="mt-0.5 flex flex-col gap-1">
                    <span className="text-xs font-medium text-black">Live</span>
                  </div>
                </div>
                <div className="mt-0.5 flex items-start gap-2">
                  <BriefcaseIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  <div className="text-xs font-medium text-black">Open</div>
                </div>
              </div>
              {/* Divider */}
              <hr className="mt-3 h-px w-full bg-zinc-100" />
              <div className="mt-3 flex flex-wrap items-center justify-start gap-3">
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
                  </div>
                </div>
              </div>
              {/* Job Card Footer */}
              <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-3 rounded-bl-lg rounded-br-lg bg-neutral-100 px-5 py-4">
                <div className="flex flex-wrap items-center justify-start gap-1">
                  <div className="text-balance text-xs font-normal text-stone-500">
                    Posted on {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  <div className="h-1 w-1 rounded-full bg-stone-500" />
                  <div className="text-xs font-normal text-stone-500">#{job.uid}</div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <ProgressSpinner aria-label="Loading" style={{ color: 'green' }} />
        )}
      </div>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
    </>
  )
}
