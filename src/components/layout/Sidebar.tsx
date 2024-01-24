import { useContext } from 'react'

import { AuthContext } from '../../App'

import { BsFillFileEarmarkSpreadsheetFill } from 'react-icons/bs'
import { FaBusinessTime, FaFileContract, FaFileInvoiceDollar } from 'react-icons/fa'
import { HiSearchCircle, HiDocumentReport } from 'react-icons/hi'
import { IoMdMail } from 'react-icons/io'
import { MdSchool, MdLogout } from 'react-icons/md'

const links: any = {
  default: [{ id: 99, name: 'Logout', href: '/logout', icon: <MdLogout /> }],
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

export default function SideBar() {
  const { user } = useContext(AuthContext)

  const unread = 3 // TODO: get unread messages from API
  return (
    <aside className="w-64 h-screen transition-transform" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-zinc-50 dark:bg-zinc-800">
        <ul className="space-y-2 font-medium">
          {user.role &&
            links[user.role || 'default'].map((link: any) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="flex items-center p-2 text-zinc-900 rounded-lg dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-700 group">
                  <span className="text-2xl w-5 h-5 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-50">
                    {link.icon}
                  </span>
                  <span className="flex-1 ms-3">{link.name}</span>
                  {link.name === 'Messages' && unread > 0 && (
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                      {unread}
                    </span>
                  )}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </aside>
  )
}
