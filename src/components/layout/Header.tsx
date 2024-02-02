import { useState, useContext, Fragment, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { LogoutService } from '../../services/AuthService'
import { useAuth } from '../../contexts/AuthContext'
import { classNames } from '../../utils/Tailwind'

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [profilePath, setProfilePath] = useState<string>('')

  const { user } = useAuth()
  const first_name = user ? user.first_name : ''
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.role) {
      switch (user.role) {
        case 'employee':
          setProfilePath('/employee/profile')
          break
        case 'client':
          setProfilePath('/client/profile')
          break
        case 'admin':
          setProfilePath('/admin/profile')
          break
        default:
          setProfilePath('/')
          break
      }
    } else {
      setProfilePath('/')
    }
  }, [user])

  const handleBurgerClick = () => {
    setShowMobileMenu(true)
  }

  const closeBurgerModal = () => {
    setShowMobileMenu(false)
  }

  const handleLogout = () => {
    LogoutService()
    navigate('/login')
  }

  return (
    <header className="fixed z-10 top-0 w-full py-4 bg-zinc-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-10">
          <a href={user ? `/${user.role}/dashboard` : '/'}>
            <img src="/assets/logos/logo-horizontal-cropped.png" alt="Hemp-Temps" className="h-12 w-auto mr-2" />
          </a>
        </div>

        {/* <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
          <div className="w-full max-w-lg lg:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>
        </div> */}

        <div className="hidden lg:ml-4 lg:flex lg:items-center">
          {first_name && <small className="mr-2 text-zinc-500 ">Hi, {first_name}</small>}
          <button
            type="button"
            disabled
            className="relative flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="relative ml-4 flex-shrink-0">
            <div>
              <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={user ? user.avatar : 'https://ui-avatars.com/api/?name=John+Doe'}
                  alt=""
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={() => navigate(profilePath)}
                      className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                      My Profile
                    </a>
                  )}
                </Menu.Item>
                {/* <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                      Settings
                    </a>
                  )}
                </Menu.Item> */}
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={handleLogout}
                      className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                      Sign out
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <div className="lg:hidden" onClick={handleBurgerClick}>
          <button className="navbar-burger flex items-center text-zinc-950 p-3">
            <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className={`navbar-menu relative ${showMobileMenu === true ? 'block' : 'hidden'}`}>
        <div className="navbar-backdrop fixed inset-0 bg-zinc-800 opacity-25"></div>
        <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-zinc-50 border-r overflow-y-auto">
          <div className="flex items-center mb-8">
            <img src="/assets/logos/logo-horizontal-cropped.png" alt="Hemp-Temps" className="h-12 w-auto mr-2" />
            <button className="navbar-close mr-4 right-0 absolute" onClick={closeBurgerModal}>
              <svg
                className="h-6 w-6 text-zinc-400 cursor-pointer hover:text-zinc-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="space-y-4 flex-col flex justify-center items-center">
            <a className="font-bold text-base" href="/">
              Services
            </a>
            <a className="font-bold text-base" href="/" onClick={closeBurgerModal}>
              Apply/Jobs
            </a>
            <a className="font-bold text-base" href="/" onClick={closeBurgerModal}>
              Employers
            </a>
            <a className="font-bold text-base" href="/" onClick={closeBurgerModal}>
              Training
            </a>
            <a className="font-bold text-base" href="/" onClick={closeBurgerModal}>
              News/Blog
            </a>
            <a className="font-bold text-base" href="/" onClick={closeBurgerModal}>
              Contact
            </a>
            <a className="font-bold text-base" href="/login" onClick={closeBurgerModal}>
              Log In
            </a>
            <a className="font-bold text-base" href="/signup" onClick={closeBurgerModal}>
              Register
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
