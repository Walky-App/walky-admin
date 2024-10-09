import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'

import { BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/20/solid'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { DashboardHeader } from '../../../components/shared/dashboard'
import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { cn } from '../../../utils/cn'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import UserAnnouncements from '../../shared/announcementsPanel/userAnnouncements'

export type Status = string

export interface ITransaction {
  id: number
  name: string
  href: string
  amount: string
  currency: string
  status: Status
  date: string
  dateTime: string
}

export const EmployeeDashboard = () => {
  const [user, setUser] = useState<IUser | null>(null)

  const { _id } = GetTokenInfo()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await requestService({ path: `users/${_id}` })
        if (response.ok) {
          const data = await response.json()

          setUser(data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchUser()
  }, [_id])

  return (
    <div className="min-h-full">
      <main className="flex-1 pb-8">
        {user ? <DashboardHeader userData={user} /> : null}

        <div className="mx-auto max-w-7xl  sm:px-6 sm:py-12 lg:px-8">
          <UserAnnouncements />
          <div className="relative isolate mb-12 overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
              <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#ffffff" />
                  <stop offset={1} stopColor="#057a55" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Start Your Training
                <br />
                and Get certified Today!
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                You will not be able to start picking up shifts until you've completed your onboarding and training.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <a
                  href="/learn"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  Get started
                </a>
                <a href="/learn" className="text-sm font-semibold leading-6 text-white">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <img
                alt="App screenshot"
                src="/assets/htu-screenshot.png"
                width={1824}
                height={1080}
                className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
              />
            </div>
          </div>
          <iframe
            width="100%"
            height="500"
            src="https://www.youtube.com/embed/PYgARhpA0FU?si=dQ8owxNXmqkfs3n-"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <div className="relative isolate my-12 overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
              <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#ffffff" />
                  <stop offset={1} stopColor="#057a55" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Free WPS training
                <br />
                and get certified Today!
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                You will not be able to start picking up shifts until you've completed your onboarding and training.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <a
                  href="https://calendly.com/shannon-3rvz/wps-free-training?month=2024-06"
                  target="_blank"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  Get started
                </a>
                <a
                  href="https://calendly.com/shannon-3rvz/wps-free-training?month=2024-06"
                  target="_blank"
                  className="text-sm font-semibold leading-6 text-white">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <img
                alt="App screenshot"
                src="https://greencultured.co/wp-content/uploads/2100/01/Environmental-Protection-Agency-EPA-Worker-Protection-Standard-Training-600x384.jpg"
                width={1824}
                height={1080}
                className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
