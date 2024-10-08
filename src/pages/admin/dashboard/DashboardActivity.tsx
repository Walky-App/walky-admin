import { useState } from 'react'

import { Button } from 'primereact/button'

import { type ILog } from '../../../interfaces/logs'

export const DashboardActivity = ({ data }: { data: ILog[] }) => {
  const [seeMore, setSeeMore] = useState(false)

  return (
    <>
      <h2 className="mb-5 text-xl">Activity</h2>
      <ul className="space-y-6">
        {data.slice(0, seeMore ? data.length : 20).map(activityItem => (
          <li key={activityItem._id} className="relative flex gap-x-4">
            {/* <div
              className={cn(
                activityItemIdx === activityItem.length - 1 ? 'h-6' : '-bottom-6',
                'absolute left-0 top-0 flex w-6 justify-center',
              )}>
              <div className="w-px bg-gray-200" />
            </div> */}
            {/* {activityItem.type === 'commented' ? (
              <>
                <img
                  src={activityItem.person.imageUrl}
                  alt=""
                  className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
                />
                <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                  <div className="flex justify-between gap-x-4">
                    <div className="py-0.5 text-xs leading-5 text-gray-500">
                      <span className="font-medium text-gray-900">{activityItem.person.name}</span> commented
                    </div>
                    <time dateTime={activityItem.dateTime} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
                      {activityItem.date}
                    </time>
                  </div>
                  <p className="text-sm leading-6 text-gray-500">{activityItem.comment}</p>
                </div>
              </>
            ) : ( */}
            <div className="relative flex h-6 w-6 flex-none items-center justify-center">
              {/* {activityItem.type === 'paid' ? (
                  <CheckCircleIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                )} */}
            </div>
            <p className="flex-auto py-0.5 text-xs leading-5">
              <span className="font-medium">{activityItem.user_id}</span> {activityItem.event_type} -{' '}
              {activityItem.model} {activityItem.item_id}
            </p>
            <time dateTime={activityItem.createdAt} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
              {new Date(activityItem.createdAt).toLocaleString()}
            </time>
            {/* )} */}
          </li>
        ))}
        {data.length > 9 ? (
          <Button
            text
            icon={seeMore ? 'pi pi-chevron-up' : 'pi pi-chevron-down'}
            label={seeMore ? 'See less' : 'See more'}
            size="small"
            onClick={() => setSeeMore(!seeMore)}
          />
        ) : null}
      </ul>
    </>
  )
}
