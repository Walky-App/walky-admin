import { type Dispatch, type SetStateAction, useState } from 'react'

import { NavLink, Link } from 'react-router-dom'

import cn from 'classnames'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

import { useAuth } from '../../contexts/AuthContext'
import { getCurrentUserRole } from '../../utils/UserRole'
import { userLinks } from './Links'
import { LogosPack } from './LogosPack'

interface SidebarComponentProps {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

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
        {/* Logo */}
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
