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
import { IoMdCog } from 'react-icons/io'
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
    // {
    //   id: 1,
    //   name: 'Messages',
    //   href: '/admin/messages',
    //   icon: <IoMdMail />,
    // },
    {
      id: 2,
      name: 'Users',
      href: '/admin/users',
      icon: <FaUserGroup />,
      subLinks: [
        { name: 'All Users', href: '/admin/users' },
        { name: 'Invite User', href: '/admin/users/invite' },
      ],
    },
    {
      id: 2,
      name: 'Companies',
      href: '/admin/companies',
      icon: <FaBusinessTime />,
      subLinks: [
        { name: 'All Companies', href: '/admin/companies' },
        { name: 'Add Company', href: '/admin/companies/new' },
      ],
    },
    {
      id: 3,
      name: 'Facilities',
      href: '/admin/facilities',
      icon: <FaBuilding />,
      subLinks: [
        { name: 'All Facilities', href: '/admin/facilities' },
        { name: 'Add Facility', href: '/admin/facilities/new' },
      ],
    },
    {
      id: 4,
      name: 'Jobs',
      href: '/admin/jobs',
      icon: <FaBriefcase />,
      subLinks: [
        { name: 'All Jobs', href: '/admin/jobs' },
        { name: 'Add Job', href: '/admin/jobs/new' },
      ],
    },
    {
      id: 5,
      name: 'HTU',
      href: '/admin/learn',
      icon: <FaUserGraduate />,
      subLinks: [
        { name: 'Categories', href: '/admin/learn/categories' },
        { name: 'Modules', href: '/admin/learn/modules' },
      ],
    },
    {
      id: 6,
      name: 'Products',
      href: '/admin/products',
      icon: <MdSchool />,
      subLinks: [
        { name: 'All Products', href: '/admin/products' },
        { name: 'New Product', href: '/admin/products', disabled: true },
        { name: 'Categories', href: '/admin/products', disabled: true },
      ],
    },
    { id: 7, name: 'Settings', href: '/admin/settings', icon: <IoMdCog /> },
    { id: 8, name: 'Orders', href: '/admin/orders', icon: <MdSchool />, disabled: true },
  ]

  const clientLinks: INavLink[] = [
    // { id: 6, name: 'Messages', href: '/client/messages', icon: <IoMdMail /> },
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
    { id: 3, name: 'Invoices', href: '/dashboard/invoices', icon: <FaFileInvoiceDollar />, disabled: true },
    {
      id: 4,
      name: 'Timesheets',
      href: '/dashboard/timesheets',
      icon: <BsFillFileEarmarkSpreadsheetFill />,
      disabled: true,
    },
    { id: 5, name: 'Reports', href: '/dashboard/reports', icon: <HiDocumentReport />, disabled: true },
    {
      id: 7,
      name: 'Facilities',
      href: `/client/facilities/`,
      icon: <FaBuilding />,
      disabled: !userIsOnboarded,
      subLinks: [
        { name: 'My Facilities', href: '/client/facilities' },
        { name: 'Add Facility', href: '/client/facilities/new' },
      ],
    },
    {
      id: 8,
      name: 'Companies',
      href: '/client/companies',
      icon: <FaBusinessTime />,
      disabled: !userIsOnboarded,
      subLinks: [
        { name: 'All Companies', href: '/client/companies' },
        { name: 'Add Company', href: '/client/companies/new' },
      ],
    },
  ]

  const employeeLinks: INavLink[] = [
    // { id: 4, name: 'Messages', href: '/employee/messages', icon: <IoMdMail /> },
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
    { id: 6, name: 'Settings', href: '/employee/settings', icon: <IoMdCog />, disabled: true },
  ]

  const salesLinks: INavLink[] = [
    { id: 1, name: 'Facilities', href: `/sales/facilities/`, icon: <FaBuilding /> },
    { id: 2, name: 'Products', href: '/sales/products', icon: <MdSchool /> },
    { id: 3, name: 'Orders', href: '/sales/orders', icon: <MdSchool />, disabled: true },
    { id: 4, name: 'Learn', href: '/learn', icon: <MdSchool /> },
    { id: 5, name: 'Reports', href: '/dashboard/reports', icon: <HiDocumentReport />, disabled: true },
    // { id: 6, name: 'Messages', href: '/sales/messages', icon: <IoMdMail /> },
  ]

  if (role === 'admin') return adminLinks
  if (role === 'client') return clientLinks
  if (role === 'employee') return employeeLinks
  if (role === 'sales') return salesLinks
  return []
}
