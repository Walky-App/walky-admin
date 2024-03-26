/* eslint-disable */
import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { ProgressSpinner } from 'primereact/progressspinner'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { type IFacility } from '../../../interfaces/Facility'
import { RequestService } from '../../../services/RequestService'
import { useUtils } from '../../../store/useUtils'
import { GetTokenInfo } from '../../../utils/TokenUtils'

interface IApplicant {
  user: string
  is_approved: boolean
  is_working: boolean
}
interface Job {
  uid: string
  created_by: string
  facility: IFacility
  title: string
  start_time: number
  end_time: number
  total_hours: number
  lunch_break: number
  job_dates: string[]
  job_tips: string[]
  vacancy: number
  applicants: IApplicant[]
  dnr: { email: string; reason: string }[]
  is_completed: boolean
  is_full: boolean
  is_active: boolean
  createdAt: Date
  updatedAt: Date
}

export const JobDetailView = () => {
  const [job, setJob] = useState<Job | null>(null)
  const { showToast } = useUtils()
  const params = useParams()
  const user = GetTokenInfo()

  let earliestDate, latestDate
  if (job && job.job_dates) {
    earliestDate = new Date(Math.min(...job.job_dates.map((date: string) => new Date(date).getTime())))
    latestDate = new Date(Math.max(...job.job_dates.map((date: string) => new Date(date).getTime())))
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

  useEffect(() => {
    const getJob = async () => {
      const job = await RequestService(`jobs/${params.id}`)
      if (job) {
        setJob(job)
      } else {
        console.error('Job not found')
      }
    }
    getJob()
  }, [])

  const applyForJob = async (userId: string) => {
    try {
      const applicant = {
        user: userId,
        is_approved: false,
        is_working: false,
      }
      await RequestService(`jobs/${params.id}/apply`, 'POST', applicant)
      showToast({ severity: 'success', summary: 'Success', detail: 'You have successfully applied for the job' })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="mx-auto px-2 sm:px-6 lg:px-2">
      {/* <BreadCrumbs /> */}
      <HeaderComponent title="Job Detail" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-3">
          <div>
            {job ? (
              <div>
                {/* Job Card Start*/}
                <Card
                  title={
                    <>
                      <div className="flex items-center justify-between">
                        <div className="mb-2 text-xs font-normal text-stone-500"> N / {job.vacancy} Applicants </div>
                      </div>
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
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-start gap-2">
                      {job.is_active === true ? (
                        <i className="pi pi-check"></i>
                      ) : (
                        <i className="pi pi-times-circle"></i>
                      )}
                      <div className="mt-0.5 flex flex-col gap-1">
                        <span className="text-xs font-medium text-black">
                          {job.is_active === true ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      {job.is_completed === false ? (
                        <i className="pi pi-calendar"></i>
                      ) : (
                        <i className="pi pi-calendar-times"></i>
                      )}
                      <div className="mt-0.5 flex flex-col gap-1">
                        <span className="text-xs font-medium text-black">
                          {job.is_completed === false ? 'Live' : 'Archived'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-0.5 flex items-start gap-2">
                      {job.is_full === false ? <i className="pi pi-briefcase"></i> : <i className="pi pi-ban"></i>}
                      <div className="text-xs font-medium text-black">{job.is_full === false ? 'Open' : 'Full'}</div>
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
                    <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                      <div className="text-xs font-normal text-stone-500">Lunch Break</div>
                      <div className="text-xs font-normal text-black">
                        {job.lunch_break === 0 ? 'No' : job.lunch_break + ' Minutes'}
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                      <div className="text-xs font-normal text-stone-500">Total Hours per day</div>
                      <div className="text-xs font-normal text-black">{job.total_hours} hours </div>
                    </div>
                  </div>
                  {/* Job Card Footer */}
                  <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-3 rounded-bl-lg rounded-br-lg bg-neutral-100 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-start gap-1">
                      <div className="text-balance text-xs font-normal text-stone-500">
                        Last update on {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <div className="h-1 w-1 rounded-full bg-stone-500" />
                      <div className="text-xs font-normal text-stone-500">#{job.uid}</div>
                    </div>
                  </div>
                </Card>
                {/* Job Card End*/}
                <section className="mt-12">
                  <h2 className="text-base font-semibold leading-6 text-gray-900">
                    Schedule ({job.job_dates.length} days)
                  </h2>
                  <ol className="mt-2 divide-y divide-gray-200 text-sm leading-6 text-gray-500">
                    {job.job_dates.map((date, index) => {
                      const dateObj = new Date(date)
                      const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
                      const formattedDate = dateObj.toLocaleDateString()
                      return (
                        <li key={index} className="py-4 sm:flex">
                          <time dateTime={date} className="w-28 flex-none">
                            {dayOfWeek}, {formattedDate}
                          </time>
                          <p className="flex-none sm:ml-6">
                            <time dateTime={date}>{convertToStandardTime(job.start_time)}</time> -
                            <time dateTime={date}>{convertToStandardTime(job.end_time)}</time>
                          </p>
                          <p className="mt-2 ml-2 flex-auto font-semibold text-gray-900 sm:mt-0">
                            Lunch: {job.lunch_break} minutes
                          </p>
                          <p className='text-green-500'>Confirmed</p>
                        </li>
                      )
                    })}
                  </ol>
                </section>
              </div>
            ) : (
              <ProgressSpinner aria-label="Loading" style={{ color: 'green' }} />
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="md:col-span-1">
          <div className="flew-row flex md:flex-col">
            <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-md bg-white shadow">
              <ul className="w-full divide-y divide-gray-200">
                <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                  <Button
                    label="Apply now"
                    onClick={() => applyForJob(user._id)}
                    style={{ width: '100%', height: '100%' }}
                  />
                </li>
                <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                  <p className="py-4 sm:flex">Do you have someone who might be interested in this job?</p>
                  <Button
                    label="Share Opportunity"
                    severity="secondary"
                    style={{ width: '100%', height: '100%' }}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Control Buttons end */}
      </div>
    </div>
  )
}
