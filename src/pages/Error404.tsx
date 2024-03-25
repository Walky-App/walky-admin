import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { LogosPack } from '../components/layout/LogosPack'
import { useAuth } from '../contexts/AuthContext'
import { getCurrentUserRole } from '../utils/UserRole'

export const Error404 = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const role = getCurrentUserRole()

  useEffect(() => {
    if (!user) navigate('/Error404')
  }, [user])

  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="flex items-center space-x-10">
        <a href={user ? `/${role}/dashboard` : '/'}>{LogosPack('error')}</a>
      </div>
      <div className="text-center">
        <p className="text-5xl font-semibold text-green-700">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href={user ? `/${role}/dashboard` : '/'}
            className="rounded-md bg-green-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            Go back home
          </a>
          <a href="mailto:notifications@hemptemps.com" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  )
}
