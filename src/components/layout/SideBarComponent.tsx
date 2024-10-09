import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'

import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

import { Disclosure } from '@headlessui/react'
import { BugAntIcon, ChatBubbleLeftRightIcon, ChevronRightIcon, ComputerDesktopIcon } from '@heroicons/react/20/solid'

import { useAuth } from '../../contexts/AuthContext'
import { getCurrentUserRole } from '../../utils/UserRole'
import { cn } from '../../utils/cn'
import { type INavLink, userLinks } from './Links'
import { LogosPack } from './LogosPack'

interface SidebarComponentProps {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

export const SidebarComponent = ({ sidebarOpen, setSidebarOpen }: SidebarComponentProps) => {
  const [visible, setVisible] = useState(false)
  const [links, setLinks] = useState<INavLink[]>([])

  const location = useLocation()
  const { user } = useAuth()
  const role = getCurrentUserRole()

  const navigate = useNavigate()

  useEffect(() => {
    // const tokenInfo = GetTokenInfo()
    // setOnboardingCompleted(userIsOnboarded ?? false)

    const roleBasedLinks = userLinks(true, role)
    setLinks(roleBasedLinks)
  }, [location, role, links])

  return (
    <div
      className={cn('flex grow flex-col gap-y-6 overflow-y-auto bg-zinc-900 px-6 pb-4', {
        'ring-1 ring-white/10': sidebarOpen,
      })}>
      <div className="mt-4 flex shrink-0 items-center justify-center">
        <Link to={user ? `/${role}/dashboard` : '/'}>{LogosPack('sidebar')}</Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul className="-mx-2 space-y-1">
              {links.map(link => {
                if (link.disabled) return null
                return (
                  <li key={link.name}>
                    {!link.subLinks ? (
                      <NavLink
                        to={link.href}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) => {
                          return cn(
                            isActive
                              ? 'w-full bg-gray-800 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                            'group my-3 flex  gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                          )
                        }}>
                        <span className="mr-2 h-5 w-5 text-2xl">{link.icon}</span>
                        {link.name}
                      </NavLink>
                    ) : (
                      <Disclosure as="div">
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              className={cn(
                                link.current ? '' : 'hover:bg-gray-800',
                                'links-center flex w-full items-center gap-x-3 rounded-md p-2 font-semibold leading-6 text-gray-400',
                              )}>
                              <span className="h-5 w-5 text-2xl">{link.icon}</span>
                              <NavLink
                                to={link.href}
                                className={({ isActive }) => {
                                  return cn(
                                    isActive
                                      ? 'w-full bg-gray-800 text-white'
                                      : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                  )
                                }}>
                                {link.name}
                              </NavLink>
                              <ChevronRightIcon
                                className={cn(
                                  open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                                  'ml-auto h-5 w-5 shrink-0',
                                )}
                                aria-hidden="true"
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel as="ul" className="mt-1 pl-10">
                              {link?.subLinks?.map(subItem => (
                                <li key={subItem.name}>
                                  <NavLink
                                    to={subItem.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) => {
                                      return cn(
                                        isActive
                                          ? 'bg-gray-800 text-white'
                                          : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                      )
                                    }}>
                                    {subItem.name}
                                  </NavLink>
                                </li>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )}
                  </li>
                )
              })}
              <li>
                <ul className="-mx-2 mt-2 space-y-1">
                  {user?.role
                    ? links?.map(link => {
                        const unread = 3

                        if (link.disabled) {
                          return (
                            <li key={link.id}>
                              <span
                                className={cn(
                                  'bg-gray-900 text-gray-700',
                                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                )}>
                                <span className="h-5 w-5 text-2xl">{link.icon}</span>
                                {link.name}
                                {link.name === 'Messages' && unread > 0 ? (
                                  <span className="ms-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-green-100/10 p-3 text-sm font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                                    {unread}
                                  </span>
                                ) : null}
                              </span>
                            </li>
                          )
                        } else {
                          return null
                        }
                      })
                    : null}
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <Button
        disabled
        label="Need Help?"
        link
        iconPos="right"
        className="bg-gray-800 text-left text-gray-400 hover:bg-gray-700 hover:text-white"
        size="small"
        icon="pi pi-question-circle"
        onClick={() => setVisible(true)}
      />
      <Dialog
        blockScroll={true}
        header="Contact us"
        visible={visible}
        className="w-full sm:w-1/2"
        onHide={() => setVisible(false)}>
        <div className="isolate bg-white px-6 py-6 sm:py-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Need Help?</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              We're here to help. Whether you have questions about jobs, shifts, need technical support, or want to
              report a bug, we're here to help
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-lg space-y-16">
            <div className="flex gap-x-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600">
                <ChatBubbleLeftRightIcon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">HR Support</h3>
                <p className="mt-2 leading-7 text-gray-600">
                  Questions about your benefits, payroll, or other HR-related topics? We're here to help.
                </p>
                <p className="mt-4 text-sm font-semibold leading-6 text-green-600">
                  Contact us <span aria-hidden="true">&rarr;</span>{' '}
                  <a href="mailto:hr@hemptemps.com" className="hover:underline">
                    hr@hemptemps.com
                  </a>
                </p>
              </div>
            </div>
            <div className="flex gap-x-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600">
                <ComputerDesktopIcon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">Technical support</h3>
                <p className="mt-2 leading-7 text-gray-600">
                  Having trouble with the platform? Our technical support team is here to help.
                </p>
                <p className="mt-4 text-sm font-semibold leading-6 text-green-600">
                  Contact us <span aria-hidden="true">&rarr;</span>{' '}
                  <a href="mailto:support@hemptemps.com" className="hover:underline">
                    support@hemptemps.com
                  </a>
                </p>
              </div>
            </div>
            <div className="flex gap-x-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600">
                <BugAntIcon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">Bug reports</h3>
                <p className="mt-2 leading-7 text-gray-600">
                  Found a bug? Let us know so we can fix it. We appreciate your help in improving our platform.
                </p>
                <p className="mt-4 text-sm font-semibold leading-6 text-green-600">
                  Contact us <span aria-hidden="true">&rarr;</span>
                  <a href="mailto:bugs@hemptemps.com" className="hover:underline">
                    bugs@hemptemps.com
                  </a>
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setVisible(false)
                navigate(`${role}/messages`)
              }}>
              Or chat with us
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
