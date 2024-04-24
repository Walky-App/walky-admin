import { type Dispatch, type SetStateAction, useState } from 'react'

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
import { NavLink, Link } from 'react-router-dom'

import cn from 'classnames'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

import { Cog6ToothIcon } from '@heroicons/react/20/solid'

import { useAuth } from '../../contexts/AuthContext'
import { getCurrentUserRole } from '../../utils/UserRole'
import { LogosPack } from './LogosPack'

interface INavLink {
  id: number
  name: string
  href: string
  icon?: JSX.Element
  disabled?: boolean
}

const adminLinks: INavLink[] = [
  { id: 1, name: 'Users', href: '/admin/users', icon: <FaUserGroup /> },
  { id: 2, name: 'Facilities', href: '/admin/facilities', icon: <FaBuilding /> },
  { id: 3, name: 'Jobs', href: '/admin/jobs', icon: <FaBriefcase /> },
  { id: 4, name: 'HTU', href: '/admin/learn', icon: <FaUserGraduate /> },
  { id: 5, name: 'Products', href: '/admin/products', icon: <MdSchool /> },
  { id: 6, name: 'Messages', href: '/admin/messages', icon: <IoMdMail /> },
  { id: 7, name: 'Settings', href: '/admin/holidays', icon: <Cog6ToothIcon /> },
  { id: 8, name: 'Orders', href: '/admin/orders', icon: <MdSchool />, disabled: true },
]

const clientLinks: INavLink[] = [
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
  { id: 6, name: 'Messages', href: '/client/messages', icon: <IoMdMail /> },
  { id: 7, name: 'Facilities', href: `/client/facilities/`, icon: <FaBuilding /> },
]

const employeeLinks: INavLink[] = [
  { id: 1, name: 'My Jobs', href: '/employee/myjobs', icon: <FaBusinessTime /> },
  { id: 2, name: 'Jobs', href: '/employee/jobs', icon: <HiSearchCircle /> },
  { id: 3, name: 'Learn', href: '/learn', icon: <MdSchool /> },
  { id: 4, name: 'Messages', href: '/employee/messages', icon: <IoMdMail /> },
]

const salesLinks: INavLink[] = [
  { id: 1, name: 'Facilities', href: `/sales/facilities/`, icon: <FaBuilding /> },
  { id: 2, name: 'Products', href: '/sales/products', icon: <MdSchool /> },
  { id: 3, name: 'Orders', href: '/sales/orders', icon: <MdSchool />, disabled: true },
  { id: 4, name: 'Learn', href: '/learn', icon: <MdSchool />, disabled: true },
  { id: 5, name: 'Reports', href: '/dashboard/reports', icon: <HiDocumentReport />, disabled: true },
  { id: 6, name: 'Messages', href: '/sales/messages', icon: <IoMdMail /> },
]

interface SidebarComponentProps {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

export const SidebarComponent = ({ sidebarOpen, setSidebarOpen }: SidebarComponentProps) => {
  const [visible, setVisible] = useState(false)
  const { user } = useAuth()
  const role = getCurrentUserRole()

  const getLinksByRole = () => {
    switch (role) {
      case 'admin':
        return adminLinks
      case 'client':
        return clientLinks
      case 'employee':
        return employeeLinks
      case 'sales':
        return salesLinks
      default:
        return []
    }
  }

  const links = getLinksByRole()

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
            {role !== 'employee' ? (
              <div className="text-xs font-semibold leading-6 text-gray-400">Coming Soon</div>
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
