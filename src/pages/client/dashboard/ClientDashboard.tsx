import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import AOS from 'aos'
import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'

import { BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/20/solid'

import { DashboardHeader } from '../../../components/shared/dashboard'
import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { cn } from '../../../utils/cn'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import UserAnnouncements from '../../shared/announcementsPanel/userAnnouncements'

import 'aos/dist/aos.css'

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

export const ClientDashboard = () => {
  const [user, setUser] = useState<IUser | null>(null)

  const navigate = useNavigate()
  const { _id, onboarding, avatar } = GetTokenInfo()

  useEffect(() => {
    if (!(onboarding?.completed ?? false)) navigate('/client/onboarding')
  }, [navigate, onboarding?.completed])

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

  useEffect(() => {
    AOS.init({
      disable: 'phone',
      duration: 1000,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <div className="min-h-full">
      <main className="flex-1 pb-8">
        {user ? <DashboardHeader userData={user} /> : null}

        <div className="mx-auto max-w-7xl  sm:px-6 sm:py-12 lg:px-8">
          <UserAnnouncements />
          <div
            className="relative isolate mb-12 overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0"
            data-aos="fade-up"
            data-aos-duration="3000">
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
                Complete your Facility Profile Today!
                <br />
                Add images and details to attract more workers.
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                You will not be able to start booking jobs until you've added images, licenses and Admins have approved
                your Facility Profile.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <a
                  href="/client/facilities"
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
                src="/assets/client-screenshot.png"
                width={1824}
                height={1080}
                className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
              />
            </div>
          </div>
          <iframe
            data-aos="fade-up"
            data-aos-duration="3000"
            width="100%"
            height="500"
            src="https://www.youtube.com/embed/PYgARhpA0FU?si=dQ8owxNXmqkfs3n-"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </main>
    </div>
  )
}
