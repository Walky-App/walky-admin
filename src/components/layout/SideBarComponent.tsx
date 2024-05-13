/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Dispatch, type SetStateAction, useState } from 'react'

import { NavLink, Link } from 'react-router-dom'

import cn from 'classnames'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

import { useAuth } from '../../contexts/AuthContext'
import { getCurrentUserRole } from '../../utils/UserRole'
import { userLinks } from './Links'
import { LogosPack } from './LogosPack'

interface SidebarComponentProps {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  {
    name: 'Teams',
    icon: UsersIcon,
    current: false,
    children: [
      { name: 'Engineering', href: '#' },
      { name: 'Human Resources', href: '#' },
      { name: 'Customer Success', href: '#' },
    ],
  },
  {
    name: 'Projects',
    icon: FolderIcon,
    current: false,
    children: [
      { name: 'GraphQL API', href: '#' },
      { name: 'iOS App', href: '#' },
      { name: 'Android App', href: '#' },
      { name: 'New Customer Portal', href: '#' },
    ],
  },
  { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
  { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]

export const SidebarComponent = ({ sidebarOpen, setSidebarOpen }: SidebarComponentProps) => {
  const [visible, setVisible] = useState(false)
  const { user } = useAuth()
  const role = getCurrentUserRole()

  const links = userLinks()

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
              {user?.role != null
                ? links?.map(link => (
                    <li key={link.id}>
                      {!link.disabled ? (
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
                      ) : null}
                    </li>
                  ))
                : null}
            </ul>
          </li>
          <li>
            {role === 'admin' ? <div className="text-xs font-semibold leading-6 text-gray-400">Coming Soon</div> : null}
            {role === 'client' ? (
              <div className="text-xs font-semibold leading-6 text-gray-400">Available After Onboarding</div>
            ) : null}

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
      </nav>

      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul className="-mx-2 space-y-1">
              {links.map(item => (
                <li key={item.name}>
                  {item.children ? (
                    <a
                      href={item.href}
                      className={cn(
                        // item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700',
                      )}>
                      {item.icon}
                      {item.name}
                    </a>
                  ) : (
                    <Disclosure as="div">
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={cn(
                              // item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                              'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700',
                            )}>
                            {item.icon}
                            {item.name}
                            <ChevronRightIcon
                              className={cn(
                                open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                                'ml-auto h-5 w-5 shrink-0',
                              )}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel as="ul" className="mt-1 px-2">
                            {item?.children?.map(subItem => (
                              <li key={subItem.name}>
                                {/* 44px */}
                                <Disclosure.Button
                                  as="a"
                                  href={subItem.href}
                                  className={cn(
                                    // subItem.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                    'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700',
                                  )}>
                                  {subItem.name}
                                </Disclosure.Button>
                              </li>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>

      <Button
        label="Support"
        link
        iconPos="right"
        style={{ textAlign: 'left', width: '100px' }}
        size="small"
        icon="pi pi-question-circle"
        onClick={() => setVisible(true)}
      />
      <Dialog
        blockScroll={true}
        header="New Support Ticket"
        visible={visible}
        style={{ width: '50vw' }}
        onHide={() => setVisible(false)}>
        <div className="asana-embed-container">
          <link rel="stylesheet" href="https://form.asana.com/static/asana-form-embed-style.css" />
          <iframe
            className="aspect-[4/3] w-5/6"
            height="800"
            width="800"
            src="https://form.asana.com/?k=CsJsKN7JrqEjByWiQLsh6w&d=1206274275339807&embed=true"
            title="Technical Request Form"
          />
        </div>
      </Dialog>
    </div>
  )
}
