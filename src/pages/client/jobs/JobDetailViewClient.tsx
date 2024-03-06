import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookmarkIcon as BookmarkIconOutlined } from '@heroicons/react/24/outline'
import { BriefcaseIcon, MapPinIcon, CreditCardIcon, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/20/solid'
import { Card } from 'primereact/card'

import { Button } from 'primereact/button'

import { RequestService } from '../../../services/RequestService'
import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'

export default function JobDetailViewClient() {
  const [job, setJob] = useState<any>({})
  const [savedJob, setSavedJob] = useState(false)
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id
  const handleSaveJob = () => {
    setSavedJob(!savedJob)
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

  return (
    <>
      <HeaderComponent title="Job Details" />
      <Button className=" mb-4" label="Edit" onClick={() => navigate(`/client/jobs/${id}/edit`)} />
      <Card title={`${job.title}`}>
        <p className="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam
          deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque quas!
        </p>
      </Card>
      <li
        key={job.id}
        className="col-span-1 divide-y divide-gray-200 rounded-lg transition delay-150 ease-in-out hover:shadow-2xl">
        {/* Job Card */}
        <div className="flex h-full flex-col items-start justify-center rounded-lg border border-zinc-100 bg-white">
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
                <div className="text-xs font-normal text-stone-500">Job Dates</div>
                <div className="text-xs font-normal text-black">Oct 01, 2023 - Oct 20, 2023</div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                <div className="text-xs font-normal text-stone-500">Job Time</div>
                <div className="text-xs font-normal text-black">10:00 AM - 07:00 PM</div>
              </div>
            </div>
          </div>
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
    </>
  )
}
