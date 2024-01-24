import { useContext } from 'react'

import { AuthContext } from '../../App'

import { BsFillFileEarmarkSpreadsheetFill } from 'react-icons/bs'
import { FaBusinessTime, FaFileContract, FaFileInvoiceDollar } from 'react-icons/fa'
import { HiSearchCircle, HiDocumentReport } from 'react-icons/hi'
import { IoMdMail } from 'react-icons/io'
import { MdSchool, MdLogout } from 'react-icons/md'
import SidebarMenuItem from './SidebarMenuItem'

export interface SideBarData {
  id: number
  name: string
  href: string
  icon: React.ReactNode
}

export default function SideBar() {
  const { user } = useContext(AuthContext)

  const unread = 3 // TODO: get unread messages from API
  interface SideBarOptions {
    [key: string]: SideBarData[]
  }

  const links: SideBarOptions = {
    employee: [
      { id: 1, name: 'Jobs', href: '/employee/jobs', icon: <HiSearchCircle /> },
      {
        id: 2,
        name: 'My Jobs',
        href: '/employee/jobs/mine',
        icon: <FaBusinessTime />,
      },
      { id: 3, name: 'Learn', href: '/learn', icon: <MdSchool /> },
      { id: 4, name: 'Messages', href: '/employee/messages', icon: <IoMdMail /> },
      { id: 99, name: 'Logout', href: '/logout', icon: <MdLogout /> },
    ],
    client: [
      {
        id: 1,
        name: 'Post Job',
        href: '/dashboard/jobs/new',
        icon: <HiSearchCircle />,
      },
      {
        id: 2,
        name: 'My Jobs',
        href: '/dashboard/jobs',
        icon: <FaBusinessTime />,
      },
      {
        id: 3,
        name: 'Contracts',
        href: '/dashboard/contracts',
        icon: <FaFileContract />,
      },
      {
        id: 4,
        name: 'Invoices',
        href: '/dashboard/invoices',
        icon: <FaFileInvoiceDollar />,
      },
      {
        id: 5,
        name: 'Timesheets',
        href: '/dashboard/timesheets',
        icon: <BsFillFileEarmarkSpreadsheetFill />,
      },
      {
        id: 6,
        name: 'Reports',
        href: '/dashboard/reports',
        icon: <HiDocumentReport />,
      },
      {
        id: 7,
        name: 'Messages',
        href: '/dashboard/messages',
        icon: <IoMdMail />,
      },
      { id: 99, name: 'Logout', href: '/logout', icon: <MdLogout /> },
    ],
    admin: [
      { id: 1, name: 'Users', href: '/admin/users', icon: <HiSearchCircle /> },
      {
        id: 2,
        name: 'Facilities',
        href: '/admin/facilities',
        icon: <FaBusinessTime />,
      },
      { id: 3, name: 'Jobs', href: '/admin/jobs', icon: <MdSchool /> },
      { id: 4, name: 'Learn', href: '/admin/learn', icon: <IoMdMail /> },
      { id: 5, name: 'Messages', href: '/admin/messages', icon: <IoMdMail /> },
    ],
  }

  return (
    <aside className="w-64 h-screen transition-transform" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-zinc-50 dark:bg-zinc-800">
        <ul className="space-y-2 font-medium">
          {user &&
            user.role &&
            links[user.role].map(link => (
              <li key={link.id}>
                <SidebarMenuItem link={link} />
              </li>
            ))}
        </ul>
      </div>
    </aside>
  )
}
