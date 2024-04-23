import { Fragment, useState } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { FooterComponent } from './FooterComponent'
<<<<<<< HEAD
import { HeaderComponent } from './HeaderComponent'
import { SidebarComponent } from './SideBarComponent'
=======
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
  { id: 8, name: 'Support', href: '/support', icon: <MdPhone /> },
  { id: 9, name: 'Orders', href: '/admin/orders', icon: <MdSchool />, disabled: true },
]

const clientLinks: INavLink[] = [
  { id: 1, name: 'My Jobs', href: '/client/jobs', icon: <FaBriefcase /> },
  { id: 2, name: 'Facilities', href: `/client/facilities/`, icon: <FaBuilding /> },
  { id: 3, name: 'Contracts', href: '/dashboard/contracts', icon: <FaFileContract />, disabled: true },
  { id: 4, name: 'Invoices', href: '/dashboard/invoices', icon: <FaFileInvoiceDollar />, disabled: true },
  {
    id: 5,
    name: 'Timesheets',
    href: '/dashboard/timesheets',
    icon: <BsFillFileEarmarkSpreadsheetFill />,
    disabled: true,
  },
  { id: 6, name: 'Reports', href: '/dashboard/reports', icon: <HiDocumentReport />, disabled: true },
  { id: 7, name: 'Messages', href: '/client/messages', icon: <IoMdMail /> },
  { id: 8, name: 'Support', href: '/support', icon: <MdPhone /> },
]

const employeeLinks: INavLink[] = [
  { id: 1, name: 'My Jobs', href: '/employee/myjobs', icon: <FaBusinessTime /> },
  { id: 2, name: 'Jobs', href: '/employee/jobs', icon: <HiSearchCircle /> },
  { id: 3, name: 'Learn', href: '/learn', icon: <MdSchool /> },
  { id: 4, name: 'Messages', href: '/employee/messages', icon: <IoMdMail /> },
  { id: 5, name: 'Support', href: '/support', icon: <MdPhone /> },
]

const salesLinks: INavLink[] = [
  { id: 1, name: 'Facilities', href: `/sales/facilities/`, icon: <FaBuilding /> },
  { id: 2, name: 'Products', href: '/sales/products', icon: <MdSchool /> },
  { id: 3, name: 'Orders', href: '/sales/orders', icon: <MdSchool />, disabled: true },
  { id: 4, name: 'Learn', href: '/learn', icon: <MdSchool />, disabled: true },
  { id: 5, name: 'Reports', href: '/dashboard/reports', icon: <HiDocumentReport />, disabled: true },
  { id: 6, name: 'Messages', href: '/sales/messages', icon: <IoMdMail /> },
  { id: 7, name: 'Support', href: '/support', icon: <MdPhone /> },
]
>>>>>>> staging

export interface SideBarData {
  id: number
  name: string
  href: string
  icon: React.ReactNode
  disabled?: boolean
}

export interface UserNavigationItem {
  name: string
  href: string
}

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Responsive sidebar for mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full">
              <Dialog.Panel className="relative mr-16 flex w-full max-w-60 flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0">
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarComponent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
        <SidebarComponent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* App Side */}
      <div className="lg:pl-60">
        <HeaderComponent setSidebarOpen={setSidebarOpen} />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
        <div className="px-4 sm:px-6 lg:px-8">
          <FooterComponent />
        </div>
      </div>
    </>
  )
}
