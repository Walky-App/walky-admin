import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function Error404() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/')
  }, [user])

  const chooseLogoImage = () => {
    const currentURL = window.location.href
    if (currentURL.toLowerCase().includes('hydropallet')) {
      return '/assets/logos/hydropallet-black-logo.png'
    } else {
      return '/assets/logos/logo-horizontal-cropped.png'
    }
  }

  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex items-center space-x-10">
          <a href={user ? `/${user.role}/dashboard` : '/'}>
            <img src={chooseLogoImage()} alt="Hemp-Temps" className="mr-2 h-36 w-auto" />
          </a>
        </div>
        <div className="text-center">
          <p className="text-5xl font-semibold text-green-700">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href={user ? `/${user.role}/dashboard` : '/'}
              className="rounded-md bg-green-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
              Go back home
            </a>
            <a href="mailto:notifications@hemptemps.com" className="text-sm font-semibold text-gray-900">
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
