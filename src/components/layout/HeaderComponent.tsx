import { type Dispatch, Fragment, type SetStateAction, useEffect } from 'react'

import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Avatar } from 'primereact/avatar'
import { BreadCrumb } from 'primereact/breadcrumb'

import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { Bars3Icon } from '@heroicons/react/24/outline'

import { useAuth } from '../../contexts/AuthContext'
import { LogoutService } from '../../services/authService'
import { useUtils } from '../../store/useUtils'
import { cn } from '../../utils/cn'
import { roleChecker } from '../../utils/roleChecker'
import { ThemeSelector } from '../ThemeSelector'
import { LogosPack } from './LogosPack'

interface HeaderComponentProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

export interface UserNavigationItem {
  name: string
  href: string
}

export const HeaderComponent = ({ setSidebarOpen }: HeaderComponentProps) => {
  const { user, profilePath } = useAuth()
  const { avatarImageUrl, setAvatarImageUrl } = useUtils()
  const role = roleChecker()
  const location = useLocation()

  const userNavigation: UserNavigationItem[] = [{ name: 'My Profile', href: profilePath }]

  const navigate = useNavigate()

  const handleLogout = () => {
    LogoutService()
    navigate('/login')
  }

  useEffect(() => {
    if (!avatarImageUrl && user?.avatar) {
      setAvatarImageUrl(user?.avatar)
    }
  }, [avatarImageUrl, setAvatarImageUrl, user?.avatar])

  const locationPath = location.pathname.split('/', 5).splice(1)

  const breadCrumbs = locationPath.map((url, index) => {
    if (index === 0) {
      return {
        label: url,
        url: `/${role}/dashboard`,
      }
    }

    if (/^[a-f0-9]{24}$/.test(url)) {
      return {
        label: 'Detail View',
        url: ``,
      }
    }

    return {
      label: url,
      url: `/${locationPath.slice(0, index + 1).join('/')}`,
    }
  })

  return (
    <>
      <header
        id="header-shell"
        className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-gray-200 bg-[var(--surface-card)] px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 print:hidden">
        {/* Left hand side header */}
        <div className="flex items-center">
          {/* Mobile logo and sidebar toggle */}
          <div className="flex shrink-0 items-center justify-center">
            <Link to={user ? `/${role}/dashboard` : '/'}>{LogosPack('header')}</Link>
          </div>

          <h3 className="text-base font-semibold capitalize leading-6 text-gray-900">
            <BreadCrumb
              model={breadCrumbs}
              home={{ icon: 'pi pi-home p-mr-2', url: `/${role}/dashboard` }}
              className="hidden border-none lg:block"
            />
          </h3>
        </div>

        <div className="flex items-center gap-x-4">
          {role !== 'admin' ? (
            <button
              type="button"
              className="mt-2 text-gray-400 hover:text-gray-500"
              disabled={role === 'admin'}
              onClick={() => navigate(`${role}/messages`)}>
              <span className="sr-only">View notifications</span>
              <i className="pi pi-envelope p-overlay-badge" style={{ fontSize: '1.2rem' }}>
                {/* <Badge value="2" /> */}
              </i>
            </button>
          ) : null}

          {role !== 'client' ? <ThemeSelector /> : null}

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <span className="sr-only">Open user menu</span>
              {/* <Avatar
                label={user?.first_name[0]}
                image={user?.avatar}
                size="normal"
                shape="circle"
                pt={{ image: { className: 'object-cover' } }}
              /> */}
              <span className="hidden lg:flex lg:items-center">
                {user?.first_name != null ? (
                  <span className="ml-4 text-sm font-semibold leading-6" aria-hidden="true">
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
                    <button
                      type="button"
                      onClick={handleLogout}
                      className={cn(
                        active ? 'bg-gray-50' : '',
                        'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900',
                      )}>
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
          {/* Responsive Separator */}
          <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </header>
      {role !== 'admin' ? (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
              <div className="text-sm text-yellow-700">
                {role === 'employee' ? (
                  <p>
                    You will <strong>NOT</strong> be able to apply for jobs until Onboarding is complete &nbsp;
                    <span aria-hidden="true"> &rarr;</span>
                    <a
                      href="/employee/onboarding"
                      className="ml-3 font-medium text-yellow-700 underline hover:text-yellow-600">
                      Complete Onboarding
                    </a>
                  </p>
                ) : null}
                {role === 'client' ? (
                  <p>
                    You will <strong>NOT</strong> be able to create jobs until Onboarding is complete &nbsp;
                    <span aria-hidden="true"> &rarr;</span>
                    <a
                      href="/client/onboarding"
                      className="ml-3 font-medium text-yellow-700 underline hover:text-yellow-600">
                      Complete Onboarding
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <BreadCrumb
        model={breadCrumbs}
        home={{ icon: 'pi pi-home p-mr-2', url: `/${role}/dashboard` }}
        className="border-none capitalize lg:hidden print:hidden"
      />
    </>
  )
}
