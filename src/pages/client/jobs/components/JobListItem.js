'use client'
import * as React from 'react'
import { BriefcaseIcon, PhoneIcon, MapPinIcon, CreditCardIcon, BookmarkIcon } from '@heroicons/react/20/solid'

export default function JobListItem({ job }) {
  const days = () => {
    const daysArray = []

    for (let i = 0; i < job.shift_days; i++) {
      daysArray.push([i])
    }

    console.log('daysArray', daysArray)

    // switch (job.days) {
    //   case 1:
    //     return daysArray.push('Mon')
    //   case 2:
    //     return daysArray.push('Tue')
    //   case 3:
    //     return daysArray.push('Wed')
    //   case 4:
    //     return daysArray.push('Thu')
    //   case 5:
    //     return daysArray.push('Fri')
    //   case 6:
    //     return daysArray.push('Sat')
    //   case 0:
    //     return daysArray.push('Sun')
    //   default:
    //     return 'Mon'
    // }

    return daysArray
  }

  return (
    <li
      key={job.email}
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow hover:shadow-2xl transition ease-in-out delay-150  ">
      <div className="pt-5 bg-white rounded-lg border border-zinc-100 flex-col justify-center items-start inline-flex">
        <div className="self-stretch px-5 pb-5 flex-col justify-center items-start gap-2.5 flex">
          <div className="self-stretch flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch flex-col justify-start items-start gap-4 flex">
              <div className=" justify-start items-start gap-2 inline-flex">
                {job.skills.map(skill => (
                  <div className="p-2 bg-neutral-100 rounded justify-center items-center gap-2 flex">
                    <div className="text-center text-stone-500 text-xs font-normal">{skill}</div>
                  </div>
                ))}
              </div>
              <div className="flex-col justify-start items-start gap-3 flex">
                <div className="text-black text-base font-semibold capitalize">{job.title}</div>
                <div className="justify-start items-center gap-2 inline-flex">
                  <div className="justify-start items-center gap-1 flex">
                    <div className="w-5 h-5 relative">
                      <MapPinIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-black text-xs font-medium">Anchorage</span>
                      <span className="text-black text-xs font-normal"> </span>
                      <span className="text-stone-500 text-xs font-normal">(4.2 mi)</span>
                    </div>
                  </div>
                  <div className="w-1 h-1 bg-stone-500 rounded-full" />
                  <div className="justify-start items-center gap-1 flex">
                    <div className="w-5 h-5 relative">
                      <CreditCardIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-black text-xs font-medium">Est. $ {job.salary}</span>
                      <span className="text-black text-xs font-normal"> </span>
                      <span className="text-stone-500 text-xs font-normal">($ 40/hr)</span>
                    </div>
                  </div>
                  <div className="w-1 h-1 bg-stone-500 rounded-full" />
                  <div className="justify-start items-center gap-1 flex">
                    <div className="w-5 h-5 relative">
                      <BriefcaseIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                    </div>
                    <div className="text-black text-xs font-medium">Senior</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[520px] h-px bg-zinc-100" />

            <div className="justify-start items-center gap-3 inline-flex">
              <div className="flex-col justify-start items-start gap-1 inline-flex">
                <div className="text-stone-500 text-xs font-normal">Shift Schedule</div>
                <div className="text-black text-xs font-normal">Weekly {days()}</div>
              </div>
              <div className="w-px h-7 bg-zinc-100" />
              <div className="flex-col justify-start items-start gap-1 inline-flex">
                <div className="text-stone-500 text-xs font-normal">Shift Date</div>
                <div className="text-black text-xs font-normal">Oct 01, 2023 - Oct 20, 2023</div>
              </div>
              <div className="w-px h-7 bg-zinc-100" />
              <div className="flex-col justify-start items-start gap-1 inline-flex">
                <div className="text-stone-500 text-xs font-normal">Shift Time</div>
                <div className="text-black text-xs font-normal">10:00 AM - 07:00 PM</div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[560px] h-9 relative">
          <div className="w-[560px] h-9 left-0 top-0 absolute bg-neutral-100 rounded-bl-lg rounded-br-lg" />
          <div className="left-[20px] top-[12px] absolute justify-start items-center gap-1 inline-flex">
            <div className="text-stone-500 text-xs font-normal">Posted 3 mins ago</div>
            <div className="w-1 h-1 bg-stone-500 rounded-full" />
            <div className="text-stone-500 text-xs font-normal">#{job.uid}</div>
          </div>
          <div className=" h-[18px] left-[467px] top-[9px] absolute justify-start items-center gap-1 inline-flex">
            <div className="w-5 h-5 relative">
              <BookmarkIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
            </div>
            <div className="text-stone-500 text-xs font-normal">Save Job</div>
          </div>
        </div>
      </div>
    </li>
  )
}
