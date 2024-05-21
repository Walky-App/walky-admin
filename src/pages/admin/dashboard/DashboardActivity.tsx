// import { useState } from 'react'
import cn from 'classnames'

// import {
//   FaceFrownIcon,
//   FaceSmileIcon,
//   FireIcon,
//   HandThumbUpIcon,
//   HeartIcon,
//   XMarkIcon,
// } from '@heroicons/react/20/solid'
import { type ILog } from '../../../interfaces/logs'

const activity = [
  { id: 1, type: 'created', person: { name: 'Chelsea Hagon' }, date: '7d ago', dateTime: '2023-01-23T10:32' },
  { id: 2, type: 'edited', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:03' },
  { id: 3, type: 'sent', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:24' },
  {
    id: 4,
    type: 'commented',
    person: {
      name: 'Chelsea Hagon',
      imageUrl:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    comment: 'Called client, they reassured me the invoice would be paid by the 25th.',
    date: '3d ago',
    dateTime: '2023-01-23T15:56',
  },
  { id: 5, type: 'viewed', person: { name: 'Alex Curren' }, date: '2d ago', dateTime: '2023-01-24T09:12' },
  { id: 6, type: 'paid', person: { name: 'Alex Curren' }, date: '1d ago', dateTime: '2023-01-24T09:20' },
]
// const moods = [
//   { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
//   { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
//   { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
//   { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
//   { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
//   { name: 'I feel nothing', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
// ]

export const DashboardActivity = ({ data }: { data: ILog[] }) => {
  // const [selected, setSelected] = useState(moods[5])

  return (
    <>
      <h2 className="mb-5 text-xl">Activity</h2>
      <ul className="space-y-6">
        {data.map((activityItem, activityItemIdx) => (
          <li key={activityItem._id} className="relative flex gap-x-4">
            <div
              className={cn(
                activityItemIdx === activity.length - 1 ? 'h-6' : '-bottom-6',
                'absolute left-0 top-0 flex w-6 justify-center',
              )}>
              <div className="w-px bg-gray-200" />
            </div>
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
            <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                {/* {activityItem.type === 'paid' ? (
                  <CheckCircleIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                )} */}
              </div>
              <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                <span className="font-medium text-gray-900">{activityItem.user_id}</span> {activityItem.event_type} -{' '}
                {activityItem.model} {activityItem.item_id}
              </p>
              <time dateTime={activityItem.createdAt} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
                {new Date(activityItem.createdAt).toLocaleString()}
              </time>
            {/* )} */}
          </li>
        ))}
      </ul>
    </>
  )
}
