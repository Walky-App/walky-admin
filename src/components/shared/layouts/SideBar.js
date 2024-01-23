import { BsFillFileEarmarkSpreadsheetFill } from 'react-icons/bs'
import { FaBusinessTime, FaFileContract, FaFileInvoiceDollar } from 'react-icons/fa'
import { HiSearchCircle, HiDocumentReport } from 'react-icons/hi'
import { IoMdMail } from 'react-icons/io'
import { MdSchool, MdLogout } from 'react-icons/md'
import SidebarMenuItem from './SidebarMenuItem'

const links = {
  default: [{ id: 99, name: 'Logout', href: '/logout', icon: <MdLogout /> }],
  temp: [
    { id: 1, name: 'Find Jobs', href: '/employee/jobs', icon: <HiSearchCircle /> },
    { id: 2, name: 'My Jobs', href: '/dashboard/jobs/mine', icon: <FaBusinessTime /> },
    { id: 3, name: 'Learn', href: '/learn', icon: <MdSchool /> },
    { id: 4, name: 'Messages', href: '/dashboard/messages', icon: <IoMdMail /> },
    { id: 99, name: 'Logout', href: '/logout', icon: <MdLogout /> },
  ],
  client: [
    { id: 1, name: 'Post Job', href: '/dashboard/jobs/new', icon: <HiSearchCircle /> },
    { id: 2, name: 'My Jobs', href: '/dashboard/jobs', icon: <FaBusinessTime /> },
    { id: 3, name: 'Contracts', href: '/dashboard/contracts', icon: <FaFileContract /> },
    { id: 4, name: 'Invoices', href: '/dashboard/invoices', icon: <FaFileInvoiceDollar /> },
    {
      id: 5,
      name: 'Timesheets',
      href: '/dashboard/timesheets',
      icon: <BsFillFileEarmarkSpreadsheetFill />,
    },
    { id: 6, name: 'Reports', href: '/dashboard/reports', icon: <HiDocumentReport /> },
    { id: 7, name: 'Messages', href: '/dashboard/messages', icon: <IoMdMail /> },
    { id: 99, name: 'Logout', href: '/logout', icon: <MdLogout /> },
  ],
}

const links2 = {
  default: [{ id: 99, name: 'Logout', href: '/logout', icon: <MdLogout /> }],
  temp: [
    { id: 1, name: 'Find Jobs', href: '/dashboard/jobs', icon: <HiSearchCircle /> },
    { id: 2, name: 'My Jobs', href: '/dashboard/jobs/mine', icon: <FaBusinessTime /> },
    { id: 3, name: 'Learn', href: '/dashboard/learn', icon: <MdSchool /> },
    { id: 4, name: 'Messages', href: '/dashboard/messages', icon: <IoMdMail /> },
    { id: 99, name: 'Logout', href: '/logout', icon: <MdLogout /> },
  ],
  client: [
    { id: 1, name: 'Post Job', href: '/dashboard/jobs/new', icon: <HiSearchCircle /> },
    { id: 2, name: 'My Jobs', href: '/dashboard/jobs', icon: <FaBusinessTime /> },
    { id: 3, name: 'Contracts', href: '/dashboard/contracts', icon: <FaFileContract /> },
    { id: 4, name: 'Invoices', href: '/dashboard/invoices', icon: <FaFileInvoiceDollar /> },
    {
      id: 5,
      name: 'Timesheets',
      href: '/dashboard/timesheets',
      icon: <BsFillFileEarmarkSpreadsheetFill />,
    },
    { id: 6, name: 'Reports', href: '/dashboard/reports', icon: <HiDocumentReport /> },
    { id: 7, name: 'Messages', href: '/dashboard/messages', icon: <IoMdMail /> },
    { id: 99, name: 'Logout', href: '/logout', icon: <MdLogout /> },
  ],
}

export default function SideBar({ role = 'default' }) {
  return (
    <aside className="w-64 h-screen transition-transform" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-zinc-50 dark:bg-zinc-800">
        <ul className="space-y-2 font-medium">
          {links[role].map(link => (
            <li key={link.id}>
              <SidebarMenuItem link={link} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
