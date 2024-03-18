import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'

import {
  BriefcaseIcon,
  StarIcon,
  MapPinIcon,
  CreditCardIcon,
  BookmarkIcon,
  CheckCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/TokenUtils'

export default function JobDetailView() {
  const [job, setJob] = useState<any>({})
  const params = useParams()
  const user = GetTokenInfo()

  
  let earliestDate, latestDate
  // Get the earliest and latest date from the job_dates array
  if (job && job.job_dates) {
    earliestDate = new Date(Math.min(...job.job_dates.map((date: string) => new Date(date))))
    latestDate = new Date(Math.max(...job.job_dates.map((date: string) => new Date(date))))
  }

  //convert military time to standard time
  function convertToStandardTime(militaryTime: number) {
    if (militaryTime == null) {
      // Handle null input, for example, return a placeholder or an error message
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
        console.log(job)
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
      };
      console.log('applicant -->', applicant);
      const response = await RequestService(`jobs/${params.id}/apply`, 'POST', applicant);
      console.log('response -->', response)
  
      if (response.status === 200) {
        console.log('Application successful');
      } else {
        console.log('Application failed', response.data);
      }
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

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
                  <div className="text-xs font-normal text-stone-500">1 / {job.vacancy}</div>
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

                <div className=" rounded-full bg-stone-500" />
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
                  <div className=" text-base font-semibold text-black">{job?.facility?.name}</div>
                </div>
              </div>
              <div className="h-px w-[520px] bg-zinc-100" />
            </div>
            <div className="inline-flex items-start justify-start gap-5">
              <div className="inline-flex flex-col items-start justify-start gap-2">
                <div className="text-xs font-normal text-stone-500">Job Dates</div>
                <div className="text-sm font-medium text-black">
                  {earliestDate?.toLocaleDateString()} - {latestDate?.toLocaleDateString()}
                </div>
              </div>
              <div className="h-14 w-px bg-zinc-100" />
              <div className="inline-flex flex-col items-start justify-start gap-2">
                <div className="text-xs font-normal text-stone-500">Job Time</div>
                <div className="text-sm font-medium text-black">
                  {' '}
                  {convertToStandardTime(job.start_time)} - {convertToStandardTime(job.end_time)}
                </div>
              </div>
            </div>
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
            <div className="text-xs font-normal text-stone-500">#{job.uid}</div>
          </div>
          <div className="h-px w-[80%] bg-zinc-100" />
          <div className="left-[74px] top-[150px] text-xs font-normal text-black">
            Know someone who would be great fit?
          </div>
          <div className="w-[298px] h-12 px-4 py-3.5 left-[32px] top-[180px] rounded-lg border border-neutral-900 justify-center items-center gap-2 inline-flex">
            <div className="text-center text-neutral-900 text-sm font-normal leading-tight">Share Opportunity</div>
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
