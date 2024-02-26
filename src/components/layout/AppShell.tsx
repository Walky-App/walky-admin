import { Fragment, useState, useMemo } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { BsFillFileEarmarkSpreadsheetFill } from 'react-icons/bs'
import {
  FaBusinessTime,
  FaBriefcase,
  FaFileContract,
  FaFileInvoiceDollar,
  FaBuilding,
  FaUserGraduate,
} from 'react-icons/fa'
import { FaUserGroup } from 'react-icons/fa6'
import { HiSearchCircle, HiDocumentReport } from 'react-icons/hi'
import { IoMdMail } from 'react-icons/io'
import { MdSchool } from 'react-icons/md'

import { useAuth } from '../../contexts/AuthContext'
import { getCurrentUserRole } from '../../utils/UserRole'
import { LogoutService } from '../../services/AuthService'
import { cn } from '../../utils/cn'
import FooterComponent from './FooterComponent'

export interface SideBarData {
  id: number
  name: string
  href: string
  icon: React.ReactNode
  disabled?: boolean
}

export interface UserNavigationItem {
  name: string
  href: string
}

interface AppShellProps {
  children: React.ReactNode
}

const adminLinks = [
  { id: 1, name: 'Users', href: '/admin/users', icon: <FaUserGroup /> },
  { id: 2, name: 'Facilities', href: '/admin/facilities', icon: <FaBuilding /> },
  { id: 3, name: 'Jobs', href: '/admin/jobs', icon: <FaBriefcase /> },
  { id: 4, name: 'HTU', href: '/admin/learn', icon: <FaUserGraduate /> },
  { id: 5, name: 'Messages', href: '/admin/messages', icon: <IoMdMail />, disabled: true },
]

const clientLinks = [
  { id: 1, name: 'My Jobs', href: '/client/jobs', icon: <FaBriefcase /> },
  { id: 2, name: 'Contracts', href: '/dashboard/contracts', icon: <FaFileContract />, disabled: true },
  { id: 3, name: 'Invoices', href: '/dashboard/invoices', icon: <FaFileInvoiceDollar />, disabled: true },
  {
    id: 4,
    name: 'Timesheets',
    href: '/dashboard/timesheets',
    icon: <BsFillFileEarmarkSpreadsheetFill />,
    disabled: true,
  },
  { id: 5, name: 'Reports', href: '/dashboard/reports', icon: <HiDocumentReport />, disabled: true },
  { id: 6, name: 'Messages', href: '/dashboard/messages', icon: <IoMdMail />, disabled: true },
  { id: 7, name: 'Facilities', href: `/client/facilities/`, icon: <FaBuilding /> },
  { id: 8, name: 'HTU', href: '/learn', icon: <MdSchool /> },
]

const employeeLinks = [
  { id: 1, name: 'Jobs', href: '/employee/jobs', icon: <HiSearchCircle /> },
  { id: 3, name: 'Learn', href: '/learn', icon: <MdSchool /> },
  { id: 2, disabled: true, name: 'My Jobs', href: '/employee/jobs/mine', icon: <FaBusinessTime /> },
  { id: 4, disabled: true, name: 'Messages', href: '/employee/messages', icon: <IoMdMail /> },
]

const salesLinks = [
  { id: 1, name: 'Facilities', href: `/sales/facilities/`, icon: <FaBuilding /> },
  { id: 2, name: 'Products', href: '/sales/products', icon: <MdSchool /> },
  { id: 3, name: 'Learn', href: '/learn', icon: <MdSchool />, disabled: true },
  { id: 5, name: 'Reports', href: '/dashboard/reports', icon: <HiDocumentReport />, disabled: true },
]

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { user, profilePath } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    LogoutService()
    navigate('/login')
  }

  const role = getCurrentUserRole()

  const links = useMemo(() => {
    if (role === 'admin') return adminLinks
    if (role === 'client') return clientLinks
    if (role === 'employee') return employeeLinks
    if (role === 'sales') return salesLinks
    return []
  }, [role])

  const userNavigation: UserNavigationItem[] = [{ name: 'Your profile', href: profilePath }]

  const SidebarComponent = () => {
    return (
      <div
        className={cn('flex grow flex-col gap-y-6 overflow-y-auto bg-zinc-900 px-6 pb-4', {
          'ring-1 ring-white/10': sidebarOpen,
        })}>
        <div className="mt-4 flex shrink-0 items-center justify-center">
          {/* Logo */}
          <Link to={user ? `/${user.role}/dashboard` : '/'}>
            <img
              src="/assets/logos/Hemp-Temps-logo-horizontal-white_optimized.png"
              alt="Hemp-Temps"
              className="h-10 w-auto"
            />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {user?.role &&
                  links.map(link => (
                    <li key={link.id}>
                      {!link.disabled && (
                        <NavLink
                          to={link.href}
                          onClick={() => setSidebarOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                            )
                          }>
                          <span className="h-5 w-5 text-2xl">{link.icon}</span>
                          {link.name}
                        </NavLink>
                      )}
                    </li>
                  ))}
              </ul>
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">Coming Soon</div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {user?.role &&
                  links.map(link => {
                    let unread = 3

                    if (link.disabled) {
                      return (
                        <li key={link.id}>
                          <span
                            className={cn(
                              'bg-gray-900 text-gray-700 ',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                            )}>
                            <span className="h-5 w-5 text-2xl">{link.icon}</span>
                            {link.name}
                            {link.name === 'Messages' && unread > 0 && (
                              <span className="ms-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-green-100/10 p-3 text-sm font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                                {unread}
                              </span>
                            )}
                          </span>
                        </li>
                      )
                    } else {
                      return null
                    }
                  })}
              </ul>
            </li>
            {/* <li className="mt-auto">
                  <a
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white">
                    <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    Settings
                  </a>
                </li> */}
          </ul>
        </nav>
      </div>
    )
  }

  const HeaderComponent = () => {
    return (
      <header
        id="header-shell"
        className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Responsive Separator */}
        <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:justify-end lg:gap-x-6">
          {/* Search Form *OPTIONAL* */}
          {/* <form className="relative flex flex-1" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <MagnifyingGlassIcon
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              placeholder="Search..."
              type="search"
              name="search"
            />
          </form> */}

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <span className="sr-only">Open user menu</span>
                {user && user.avatar ? (
                  <img className="h-8 w-8 rounded-full" src={user.avatar} alt="" />
                ) : (
                  <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                )}
                <span className="hidden lg:flex lg:items-center">
                  {user?.first_name ? (
                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                      Hi, {user.first_name}
                    </span>
                  ) : null}
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  {userNavigation.map(item => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          to={item.href}
                          className={cn(active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}>
                          {item.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                  <Menu.Item>
                    {({ active }) => (
                      <span
                        onClick={handleLogout}
                        className={cn(active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}>
                        Sign out
                      </span>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </header>
    )
  }

  return (
    <div>
      {/* Responsive sidebar for mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full">
              <Dialog.Panel className="relative mr-16 flex w-full max-w-60 flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0">
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <SidebarComponent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <SidebarComponent />
      </div>

      {/* App Side */}
      <div className="lg:pl-60">
        {/* Header */}
        <HeaderComponent />

        {/* Main Content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>

        {/* Footer */}
        <div className="px-4 sm:px-6 lg:px-8">
          <FooterComponent />
        </div>
      </div>
    </div>
  )
}
