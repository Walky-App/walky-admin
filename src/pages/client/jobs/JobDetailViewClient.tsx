import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  BriefcaseIcon,
  StarIcon,
  MapPinIcon,
  CreditCardIcon,
  BookmarkIcon,
  CheckCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid'
import { Button } from 'primereact/button'

import { RequestService } from '../../../services/RequestService'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'

export default function JobDetailViewClient() {
  const [job, setJob] = useState<any>({})
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id
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
      <Button className=" mb-4" label="Edit" onClick={() => navigate(`/client/jobs/${id}/edit`)} />
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
                    <span className="text-sm font-medium text-black">Anchorage</span>
                    <span className="text-sm font-normal leading-tight text-black"> </span>
                    <span className="text-sm font-normal leading-tight text-stone-500">(4.2 mi)</span>
                  </div>
                </div>
                <div className="h-1 w-1 rounded-full bg-stone-500" />
                <div className="flex items-center justify-start gap-1">
                  <div className="relative h-6 w-6">
                    <CreditCardIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-black">Est. $ {job?.salary}</span>
                    <span className="text-sm font-normal leading-tight text-black"> </span>
                    <span className="text-sm font-normal leading-tight text-stone-500">($ 40/hr)</span>
                  </div>
                  <div className=" relative">
                    <div className=" absolute left-0 top-0 bg-zinc-300" />
                  </div>
                </div>
                <div className=" rounded-full bg-stone-500" />
                <div className="flex items-center justify-start gap-1">
                  <div className=" relative">
                    <BriefcaseIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <div className="text-sm font-medium text-black">Senior</div>
                </div>
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
                  <div className=" text-base font-semibold text-black">Roma - Curaleaf (CURLF)</div>
                  <div className="text-xs font-normal text-stone-500">Looking for a Labor Work</div>
                </div>
              </div>
              <div className="h-px w-[520px] bg-zinc-100" />
            </div>
            <div className="flex flex-col items-start justify-start gap-4">
              <div className="text-xs font-normal text-stone-500">Description</div>
              <div className="text-sm font-normal leading-tight text-black">
                <div className="p-editor-content ql-container ql-snow !border-0">
                  <div className="ql-editor b-0 !p-0" dangerouslySetInnerHTML={{ __html: job?.description }} />
                </div>
              </div>{' '}
            </div>
            <div className="h-px w-[520px] bg-zinc-100" />
            <div className="flex flex-col items-start justify-start gap-4">
              <div>
                <span className="text-xs font-normal text-stone-500">Type of Job : </span>
                <span className="text-sm font-medium text-black">{job?.employment_type}</span>
              </div>
              <div className=" inline-flex items-start justify-start gap-2">
                {job?.skills?.map((skill: string) => (
                  <div className="flex items-center justify-center gap-2 rounded bg-neutral-100 p-2">
                    <div className="text-center text-xs font-normal text-stone-500">{skill}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-px w-[520px] bg-zinc-100" />
            <div className="inline-flex items-start justify-start gap-5">
              <div className="inline-flex flex-col items-start justify-start gap-2">
                <div className="text-xs font-normal text-stone-500">Shift Schedule</div>
                <div className="flex flex-col items-start justify-start gap-1">
                  <div className="text-sm font-medium text-black">Weekly</div>
                  <div className="text-xs font-normal text-black">(Mon, Thu, Fri)</div>
                </div>
              </div>
              <div className="h-14 w-px bg-zinc-100" />
              <div className="inline-flex flex-col items-start justify-start gap-2">
                <div className="text-xs font-normal text-stone-500">Shift Date</div>
                <div className="text-sm font-medium text-black">Oct 01, 2023 - Oct 20, 2023</div>
              </div>
              <div className="h-14 w-px bg-zinc-100" />
              <div className="inline-flex flex-col items-start justify-start gap-2">
                <div className="text-xs font-normal text-stone-500">Shift Time</div>
                <div className="text-sm font-medium text-black">10:00 AM - 07:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
