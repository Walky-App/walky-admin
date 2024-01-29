import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  BriefcaseIcon,
  StarIcon,
  MapPinIcon,
  CreditCardIcon,
  BookmarkIcon,
  CheckCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid'

import { RequestService } from '../../../services/RequestService'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'

export default function JobDetailViewClient() {
  const [job, setJob] = useState<any>({})
  const params = useParams()

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

  return (
    <div className="mx-auto px-2 sm:px-6 lg:px-2">
      {/* <BreadCrumbs /> */}
      <HeaderComponent title="Job Detail" />
      <div className="flex align-bottom">
        <div className="bg-white w-2/3  rounded-2xl border border-zinc-100">
          <div className="flex-col justify-start items-start gap-6 inline-flex p-20">
            <div className="self-stretch flex-col justify-start items-start gap-4 flex">
              <div className="self-stretch justify-between items-start inline-flex">
                <div className="justify-start items-center gap-1 flex">
                  <div className="w-6 h-6 relative">
                    <UserGroupIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <div className="text-stone-500 text-xs font-normal">1 / 3</div>
                </div>
                <div className="justify-start items-center gap-1 flex">
                  <div className="w-6 h-6 relative">
                    <BookmarkIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <div className="text-stone-500 text-sm font-normal leading-tight">Save Job</div>
                </div>
              </div>
              <div className="text-black text-2xl font-bold">{job?.title}</div>
              <div className="justify-start items-center gap-3 inline-flex">
                <div className="justify-start items-center gap-1 flex">
                  <div className="w-6 h-6 relative">
                    <MapPinIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-black text-sm font-medium">Anchorage</span>
                    <span className="text-black text-sm font-normal leading-tight"> </span>
                    <span className="text-stone-500 text-sm font-normal leading-tight">(4.2 mi)</span>
                  </div>
                </div>
                <div className="w-1 h-1 bg-stone-500 rounded-full" />
                <div className="justify-start items-center gap-1 flex">
                  <div className="w-6 h-6 relative">
                    <CreditCardIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-black text-sm font-medium">Est. $ {job?.salary}</span>
                    <span className="text-black text-sm font-normal leading-tight"> </span>
                    <span className="text-stone-500 text-sm font-normal leading-tight">($ 40/hr)</span>
                  </div>
                  <div className=" relative">
                    <div className=" left-0 top-0 absolute bg-zinc-300" />
                  </div>
                </div>
                <div className=" bg-stone-500 rounded-full" />
                <div className="justify-start items-center gap-1 flex">
                  <div className=" relative">
                    <BriefcaseIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <div className="text-black text-sm font-medium">Senior</div>
                </div>
              </div>
            </div>
            <div className="flex-col justify-start items-start gap-3 flex">
              <div className="w-[520px] h-px bg-zinc-100" />
              <div className="justify-start items-center gap-3 inline-flex">
                <div className="w-12 h-12 relative">
                  <img
                    className="w-12 h-12 left-0 top-0 rounded-full"
                    src="https://randomuser.me/api/portraits/women/3.jpg"
                    alt="Rounded avatar"
                  />
                </div>
                <div className="flex-col justify-start items-start gap-2 inline-flex">
                  <div className=" text-black text-base font-semibold">Roma - Curaleaf (CURLF)</div>
                  <div className="text-stone-500 text-xs font-normal">Looking for a Labor Work</div>
                </div>
              </div>
              <div className="w-[520px] h-px bg-zinc-100" />
            </div>
            <div className="flex-col justify-start items-start gap-4 flex">
              <div className="text-stone-500 text-xs font-normal">Description</div>
              <div className="text-black text-sm font-normal leading-tight">{job?.description}</div>
            </div>
            <div className="w-[520px] h-px bg-zinc-100" />
            <div className="flex-col justify-start items-start gap-4 flex">
              <div>
                <span className="text-stone-500 text-xs font-normal">Type of Job : </span>
                <span className="text-black text-sm font-medium">{job?.employment_type}</span>
              </div>
              <div className=" justify-start items-start gap-2 inline-flex">
                {job?.skills?.map((skill: string) => (
                  <div className="p-2 bg-neutral-100 rounded justify-center items-center gap-2 flex">
                    <div className="text-center text-stone-500 text-xs font-normal">{skill}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[520px] h-px bg-zinc-100" />
            <div className="justify-start items-start gap-5 inline-flex">
              <div className="flex-col justify-start items-start gap-2 inline-flex">
                <div className="text-stone-500 text-xs font-normal">Shift Schedule</div>
                <div className="flex-col justify-start items-start gap-1 flex">
                  <div className="text-black text-sm font-medium">Weekly</div>
                  <div className="text-black text-xs font-normal">(Mon, Thu, Fri)</div>
                </div>
              </div>
              <div className="w-px h-14 bg-zinc-100" />
              <div className="flex-col justify-start items-start gap-2 inline-flex">
                <div className="text-stone-500 text-xs font-normal">Shift Date</div>
                <div className="text-black text-sm font-medium">Oct 01, 2023 - Oct 20, 2023</div>
              </div>
              <div className="w-px h-14 bg-zinc-100" />
              <div className="flex-col justify-start items-start gap-2 inline-flex">
                <div className="text-stone-500 text-xs font-normal">Shift Time</div>
                <div className="text-black text-sm font-medium">10:00 AM - 07:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* rightside */}
        <div className="w-[362px] h-[308px] flex flex-col justify-evenly text-center items-center ml-10 bg-white rounded-2xl border border-zinc-100">
          <div className="w-[298px] h-12 flex items-center justify-center bg-neutral-900 rounded-lg">
            <StarIcon className="h-4 w-4 mr-1 text-gray-100" aria-hidden="true" />
            <div className=" text-white text-sm font-normal leading-tight">Accept Now</div>
          </div>
          <div className="items-center gap-1 inline-flex">
            <div className="text-stone-500 text-xs font-normal">Posted 3 mins ago</div>
            <div className="w-1 h-1 bg-stone-500 rounded-full" />
            <div className="text-stone-500 text-xs font-normal">#54646444</div>
          </div>
          <div className="w-[80%] h-px bg-zinc-100" />
          <div className="left-[74px] top-[150px] text-black text-xs font-normal">
            Know someone who would be great fit?
          </div>
          <div className="w-[298px] h-12 px-4 py-3.5 left-[32px] top-[180px] rounded-lg border border-neutral-900 justify-center items-center gap-2 inline-flex">
            <div className="text-center text-neutral-900 text-sm font-normal leading-tight">Share Opportunity</div>
          </div>
          <div className="mt-3 items-center gap-2 inline-flex">
            <div className="w-6 h-6 relative">
              <CheckCircleIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
            </div>
            <div className="text-black text-sm font-normal leading-tight">Hurray! You got tip on this job.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
