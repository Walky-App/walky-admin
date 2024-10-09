import { BsFillFileEarmarkSpreadsheetFill } from 'react-icons/bs'
import {
  FaBusinessTime,
  FaBriefcase,
  FaFileContract,
  FaFileInvoiceDollar,
  FaBuilding,
  FaUserGraduate,
  FaDollarSign,
} from 'react-icons/fa'
import { FaBullhorn } from 'react-icons/fa'
import { FaUserGroup } from 'react-icons/fa6'
import { HiSearchCircle, HiDocumentReport } from 'react-icons/hi'
import { HiOutlineClipboardList } from 'react-icons/hi'
import { IoMdCog, IoMdMail } from 'react-icons/io'
import { MdOutlineAccessTimeFilled, MdSchool } from 'react-icons/md'

interface INavLinkChildren {
  name: string
  href: string
  disabled?: boolean
}

export interface INavLink {
  id: number
  name: string
  href: string
  icon?: JSX.Element
  disabled?: boolean
  current?: boolean
  subLinks?: INavLinkChildren[]
}

export const userLinks = (userIsOnboarded: boolean, role: string) => {
  const adminLinks: INavLink[] = [
    {
      id: 1,
      name: 'Users',
      href: '/admin/users',
      icon: <FaUserGroup />,
      // subLinks: [
      //   { name: 'Clients', href: '/admin/users/clients' },
      //   { name: 'Invite User', href: '/admin/users/invite' },
      // ],
    },
    {
      id: 2,
      name: 'Students',
      disabled: true,
      href: '/admin/users/employees',
      icon: <FaUserGroup />,
      subLinks: [
        { name: 'Active & Approved', href: '/admin/users/employees/active' },
        { name: 'Timesheets ', href: '/admin/users/employees/timesheets' },
        { name: 'Inactive ', href: '/admin/users/employees/inactive' },
      ],
    },
    {
      id: 3,
      disabled: true,
      name: 'Schools',
      href: '/admin/companies',
      icon: <FaBusinessTime />,
      subLinks: [{ name: 'New Company', href: '/admin/companies/new' }],
    },
    // {
    //   id: 4,
    //   disabled: true,
    //   name: 'Facilities',
    //   href: '/admin/facilities',
    //   icon: <FaBuilding />,
    //   subLinks: [{ name: 'Add Facility', href: '/admin/facilities/new' }],
    // },
    {
      id: 6,
      disabled: true,
      name: 'Service Orders',
      href: '/admin/jobs/service-orders',
      icon: <FaBriefcase />,
      subLinks: [
        { name: 'Pending', href: '/admin/jobs/service-orders/pending' },
        { name: 'Authorized', href: '/admin/jobs/service-orders/authorized' },
        { name: 'Uninvoiced', href: '/admin/jobs/service-orders/authorized-uninvoiced' },
        { name: 'Invoiced', href: '/admin/jobs/service-orders/authorized-invoiced' },
      ],
    },
    {
      id: 6.2,
      name: 'Invoices',
      disabled: true,
      href: '/admin/invoices',
      icon: <FaDollarSign />,
    },

    { id: 8, disabled: true, name: 'Settings', href: '/admin/settings', icon: <IoMdCog /> },
    { id: 9, disabled: true, name: 'Announcements', href: '/admin/announcements', icon: <FaBullhorn /> },
    {
      id: 10,
      disabled: true,
      name: 'App Changelog',
      href: '/admin/changelog/app',
      icon: <HiOutlineClipboardList />,
      subLinks: [{ name: 'API Changelog', href: '/admin/changelog/api' }],
    },
    {
      id: 1,
      disabled: true,
      name: 'Messages (Beta)',
      href: '/admin/messages',
      icon: <IoMdMail />,
    },
  ]

  const clientLinks: INavLink[] = [
    {
      id: 1,
      name: 'Jobs',
      href: '/client/jobs',
      icon: <FaBriefcase />,
      disabled: !userIsOnboarded,
      subLinks: [
        { name: 'My Jobs', href: '/client/jobs' },
        { name: 'Add Job', href: '/client/jobs/new' },
      ],
    },
    { id: 2, name: 'Contracts', href: '/dashboard/contracts', icon: <FaFileContract />, disabled: true },
    {
      id: 3,
      name: 'Timesheets',
      href: '/dashboard/timesheets',
      icon: <BsFillFileEarmarkSpreadsheetFill />,
      disabled: true,
    },
    { id: 4, name: 'Reports', href: '/dashboard/reports', icon: <HiDocumentReport />, disabled: true },
    {
      id: 5,
      name: 'Service Orders',
      href: '/client/jobs/service-orders',
      icon: <FaBriefcase />,
      disabled: !userIsOnboarded,
      subLinks: [
        { name: 'Pending', href: '/client/jobs/service-orders/pending' },
        { name: 'Authorized', href: '/client/jobs/service-orders/authorized' },
        { name: 'Uninvoiced', href: '/client/jobs/service-orders/authorized-uninvoiced' },
        { name: 'Invoiced', href: '/client/jobs/service-orders/authorized-invoiced' },
      ],
    },
    { id: 6, name: 'Invoices', href: '/client/invoices', icon: <FaFileInvoiceDollar />, disabled: !userIsOnboarded },
    {
      id: 7,
      name: 'Facilities',
      href: `/client/facilities/`,
      icon: <FaBuilding />,
      disabled: !userIsOnboarded,
      subLinks: [
        { name: 'My Facilities', href: '/client/facilities' },
        { name: 'New Facility', href: '/client/facilities/new' },
      ],
    },
    {
      id: 8,
      name: 'Companies',
      href: '/client/companies',
      icon: <FaBusinessTime />,
      disabled: !userIsOnboarded,
      subLinks: [{ name: 'New Company', href: '/client/companies/new' }],
    },
    { id: 9, name: 'Messages', href: '/client/messages', icon: <IoMdMail /> },
  ]

  const employeeLinks: INavLink[] = [
    { id: 1, name: 'My Jobs', href: '/employee/myjobs', icon: <FaBusinessTime />, disabled: !userIsOnboarded },
    { id: 2, name: 'Jobs', href: '/employee/jobs', icon: <HiSearchCircle /> },
    { id: 3, name: 'Training', href: '/learn', icon: <MdSchool /> },
    {
      id: 5,
      name: 'Timesheets',
      href: '/employee/timesheets',
      icon: <MdOutlineAccessTimeFilled />,
      disabled: !userIsOnboarded,
    },
    { id: 6, name: 'Messages', href: '/employee/messages', icon: <IoMdMail /> },
    { id: 7, name: 'Settings', href: '/employee/settings', icon: <IoMdCog />, disabled: true },
  ]

  if (role === 'admin') return adminLinks
  if (role === 'client') return clientLinks
  if (role === 'employee') return employeeLinks
  return []
}
