import { BsFillFileEarmarkSpreadsheetFill } from 'react-icons/bs'
import {
  FaBriefcase,
  FaBuilding,
  FaBusinessTime,
  FaFileContract,
  FaFileInvoiceDollar,
  FaPlus,
  FaRegPlusSquare,
  FaUserGraduate,
} from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'
import { HiSearchCircle, HiDocumentReport } from 'react-icons/hi'
import { MdSchool, MdLogout } from 'react-icons/md'

import { useAuth } from '../../contexts/AuthContext'
import SidebarMenuItem from './SidebarMenuItem'
import SideBarMenuItemDisabled from './SidebarMenuItemDisabled'
import { FaUserGroup } from 'react-icons/fa6'

export interface SideBarData {
  id: number
  name: string
  href: string
  icon: React.ReactNode
  disabled?: boolean
}

export default function SideBar() {
  const { user } = useAuth()

  const unread = 3 // TODO: get unread messages from API
  interface SideBarOptions {
    [key: string]: SideBarData[]
  }

  const links: SideBarOptions = {
    employee: [
      { id: 1, name: 'Jobs', href: '/employee/jobs', icon: <HiSearchCircle /> },
      { id: 3, name: 'Learn', href: '/learn', icon: <MdSchool /> },
      {
        id: 2,
        disabled: true,
        name: 'My Jobs',
        href: '/employee/jobs/mine',
        icon: <FaBusinessTime />,
      },
      { id: 4, disabled: true, name: 'Messages', href: '/employee/messages', icon: <IoMdMail /> },
      // { id: 99, name: 'Logout', href: '/logout', icon: <MdLogout /> },
    ],
    client: [
      {
        id: 1,
        name: 'Post Job',
        href: '/client/jobs/new',
        icon: <FaPlus />,
      },
      {
        id: 2,
        name: 'My Jobs',
        href: '/client/jobs',
        icon: <FaBriefcase />,
      },
      {
        id: 3,
        name: 'Contracts',
        href: '/dashboard/contracts',
        icon: <FaFileContract />,
        disabled: true,
      },
      {
        id: 4,
        name: 'Invoices',
        href: '/dashboard/invoices',
        icon: <FaFileInvoiceDollar />,
        disabled: true,
      },
      {
        id: 5,
        name: 'Timesheets',
        href: '/dashboard/timesheets',
        icon: <BsFillFileEarmarkSpreadsheetFill />,
        disabled: true,
      },
      {
        id: 6,
        name: 'Reports',
        href: '/dashboard/reports',
        icon: <HiDocumentReport />,
        disabled: true,
      },
      {
        id: 7,
        name: 'Messages',
        href: '/dashboard/messages',
        icon: <IoMdMail />,
        disabled: true,
      },
      {
        id: 8,
        name: 'Facilities',
        href: `/client/facilities/`,
        icon: <FaBuilding />,
      },
      {
        id: 9,
        name: 'Add Facility',
        href: '/client/facilities/new',
        icon: <FaRegPlusSquare />,
      },
      {
        id: 10,
        name: 'HTU',
        href: '/learn',
        icon: <MdSchool />,
      },
      // { id: 99, name: 'Logout', href: '/logout', icon: <MdLogout /> },
    ],
    admin: [
      {
        id: 1,
        name: 'Users',
        href: '/admin/users',
        icon: <FaUserGroup />,
      },
      {
        id: 2,
        name: 'Facilities',
        href: '/admin/facilities',
        icon: <FaBuilding />,
      },
      {
        id: 3,
        name: 'Jobs',
        href: '/admin/jobs',
        icon: <FaBriefcase />,
      },
      {
        id: 4,
        name: 'HTU',
        href: '/admin/learn',
        icon: <FaUserGraduate />,
        disabled: true,
      },

      {
        id: 5,
        name: 'Messages',
        href: '/admin/messages',
        icon: <IoMdMail />,
        disabled: true,
      },
    ],
  }
  return (
    <aside className="w-64 h-screen transition-transform" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-zinc-50 dark:bg-zinc-800">
        <ul className="space-y-2 font-medium">
          {user?.role &&
            links[user.role].map(link => <li key={link.id}>{!link.disabled && <SidebarMenuItem link={link} />}</li>)}
        </ul>
        <h4 className="text-zinc-400 my-3">Coming soon </h4>
        <ul className="space-y-2 font-medium">
          {user?.role &&
            links[user.role].map(link => (
              <li key={link.id}>{link.disabled && <SideBarMenuItemDisabled link={link} />}</li>
            ))}
        </ul>
      </div>
    </aside>
  )
}
