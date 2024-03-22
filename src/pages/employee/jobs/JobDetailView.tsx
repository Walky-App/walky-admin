import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'

import { MapPinIcon, BookmarkIcon, CheckCircleIcon, UserGroupIcon } from '@heroicons/react/20/solid'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { IFacility } from '../../../interfaces/Facility'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/TokenUtils'
import { useUtils } from '../../../store/useUtils'

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
}

export default function JobDetailView() {
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
      <div className="flex align-bottom">
        <div className="w-2/3 rounded-2xl  border border-zinc-100 bg-white">
          <div className="inline-flex flex-col items-start justify-start gap-6 p-20">
            <div className="flex flex-col items-start justify-start gap-4 self-stretch">
              <div className="inline-flex items-start justify-between self-stretch">
                <div className="flex items-center justify-start gap-1">
                  <div className="relative h-6 w-6">
                    <UserGroupIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <div className="text-xs font-normal text-stone-500">1 / {job?.vacancy}</div>
                </div>
                <div className="flex items-center justify-start gap-1">
                  <div className="relative h-6 w-6">
                    <BookmarkIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <div className="text-sm font-normal leading-tight text-stone-500">Save Job</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-black">{job?.title}</div>
              <div className="inline-flex items-center justify-start gap-3">
                <div className="flex items-center justify-start gap-1">
                  <div className="relative h-6 w-6">
                    <MapPinIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-black">{job?.facility?.city}</span>
                    <span className="text-sm font-normal leading-tight text-black"> </span>
                    <span className="text-sm font-normal leading-tight text-stone-500">(4.2 mi)</span>
                  </div>
                </div>
                <div className="h-1 w-1 rounded-full bg-stone-500" />

                <div className="rounded-full bg-stone-500" />
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-3">
              <div className="h-px w-[520px] bg-zinc-100" />
              <div className="inline-flex items-center justify-start gap-3">
                <div className="relative h-12 w-12">
                  <img
                    className="left-0 top-0 h-12 w-12 rounded-full"
                    src="https://randomuser.me/api/portraits/women/3.jpg"
                    alt="Rounded avatar"
                  />
                </div>
                <div className="inline-flex flex-col items-start justify-start gap-2">
                  <div className="text-base font-semibold text-black">{job?.facility?.name}</div>
                </div>
              </div>
              <div className="h-px w-[520px] bg-zinc-100" />
            </div>
            <div className="inline-flex items-start justify-start gap-5">
              <div className="inline-flex flex-col items-start justify-start gap-2">
                <div className="text-xs font-normal text-stone-500">Job Dates</div>
                <div className="text-sm font-medium text-black">
                  {earliestDate?.toLocaleDateString()} - {latestDate?.toLocaleDateString()}
                  <p>{job?.job_dates ? job?.job_dates.length : 0} Days total</p>
                </div>
              </div>
              <div className="h-14 w-px bg-zinc-100" />
              <div className="inline-flex flex-col items-start justify-start gap-2">
                <div className="text-xs font-normal text-stone-500">Job Time</div>
                <div className="text-sm font-medium text-black">
                  {' '}
                  {convertToStandardTime(job?.start_time || 0)} - {convertToStandardTime(job?.end_time || 0)}
                </div>
              </div>
            </div>
            <section className="mt-12">
              <h2 className="text-base font-semibold leading-6 text-gray-900">Work Days Schedule</h2>
              <ol className="mt-2 divide-y divide-gray-200 text-sm leading-6 text-gray-500">
                <li className="py-4 sm:flex">
                  <time dateTime="2022-01-19" className="w-28 flex-none">
                    Thu, Mar 13
                  </time>
                  <p className="mt-2 flex-auto font-semibold text-gray-900 sm:mt-0">8 hours</p>
                  <p className="flex-none sm:ml-6">
                    <time dateTime="2022-01-13T14:30">5:30 AM</time> - <time dateTime="2022-01-13T16:30">3:30 PM</time>
                  </p>
                </li>
                <li className="py-4 sm:flex">
                  <time dateTime="2022-01-20" className="w-28 flex-none">
                    Fri, Mar 14
                  </time>
                  <p className="mt-2 flex-auto font-semibold text-gray-900 sm:mt-0">8 hours</p>
                  <time dateTime="2022-01-13T14:30">5:30 AM</time> - <time dateTime="2022-01-13T16:30">3:30 PM</time>
                </li>
                <li className="py-4 sm:flex">
                  <time dateTime="2022-01-20" className="w-28 flex-none">
                    Fri, Mar 15
                  </time>
                  <p className="mt-2 flex-auto font-semibold text-gray-900 sm:mt-0">8 hours</p>
                  <time dateTime="2022-01-13T14:30">5:30 AM</time> - <time dateTime="2022-01-13T16:30">3:30 PM</time>
                </li>
                <li className="py-4 sm:flex">
                  <time dateTime="2022-01-18" className="w-28 flex-none">
                    Mon, Mar 17
                  </time>
                  <p className="mt-2 flex-auto font-semibold text-gray-900 sm:mt-0">8 hours</p>
                  <p className="flex-none sm:ml-6">
                    <time dateTime="2022-01-17T10:00">5:30 AM</time> - <time dateTime="2022-01-17T10:15">3:30 PM</time>
                  </p>
                </li>
              </ol>
            </section>
          </div>
        </div>

        {/* rightside */}
        <div className="ml-10 flex h-[308px] w-[362px] flex-col items-center justify-evenly rounded-2xl border border-zinc-100 bg-white text-center">
          <div className="flex h-12 w-[298px] items-center justify-center rounded-lg bg-neutral-900">
            <Button label="Apply now" onClick={() => applyForJob(user._id)} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="inline-flex items-center gap-1">
            <div className="text-xs font-normal text-stone-500">Posted 3 mins ago</div>
            <div className="h-1 w-1 rounded-full bg-stone-500" />
            <div className="text-xs font-normal text-stone-500">#{job?.uid}</div>
          </div>
          <div className="h-px w-[80%] bg-zinc-100" />
          <div className="left-[74px] top-[150px] text-xs font-normal text-black">
            Know someone who would be great fit?
          </div>
          <div className="left-[32px] top-[180px] inline-flex h-12 w-[298px] items-center justify-center gap-2 rounded-lg border border-neutral-900 px-4 py-3.5">
            <div className="text-center text-sm font-normal leading-tight text-neutral-900">Share Opportunity</div>
          </div>
          <div className="mt-3 inline-flex items-center gap-2">
            <div className="relative h-6 w-6">
              <CheckCircleIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
            </div>
            <div className="text-sm font-normal leading-tight text-black">Hurray! You got tip on this job.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
