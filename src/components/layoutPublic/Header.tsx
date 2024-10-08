import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'

import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import {
  // ArrowPathIcon,
  Bars3Icon, // BookmarkSquareIcon,
  // CalendarIcon,
  // ChartBarIcon,
  // CursorArrowRaysIcon,
  // LifebuoyIcon,
  // PhoneIcon,
  // PlayIcon,
  // ShieldCheckIcon,
  // Squares2X2Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

// import { cn } from '../../utils/cn'

// const solutions = [
//   {
//     name: 'Analytics',
//     description: 'Get a better understanding of where your traffic is coming from.',
//     href: '#',
//     icon: ChartBarIcon,
//   },
//   {
//     name: 'Engagement',
//     description: 'Speak directly to your customers in a more meaningful way.',
//     href: '#',
//     icon: CursorArrowRaysIcon,
//   },
//   { name: 'Security', description: "Your customers' data will be safe and secure.", href: '#', icon: ShieldCheckIcon },
//   {
//     name: 'Integrations',
//     description: "Connect with third-party tools that you're already using.",
//     href: '#',
//     icon: Squares2X2Icon,
//   },
//   {
//     name: 'Automations',
//     description: 'Build strategic funnels that will drive your customers to convert',
//     href: '#',
//     icon: ArrowPathIcon,
//   },
// ]
// const callsToAction = [
//   { name: 'Watch Demo', href: '#', icon: PlayIcon },
//   { name: 'Contact Sales', href: '#', icon: PhoneIcon },
// ]

// const resources = [
//   {
//     name: 'Help Center',
//     description: 'Get all of your questions answered in our forums or contact support.',
//     href: '#',
//     icon: LifebuoyIcon,
//   },
//   {
//     name: 'Guides',
//     description: 'Learn how to maximize our platform to get the most out of it.',
//     href: '#',
//     icon: BookmarkSquareIcon,
//   },
//   {
//     name: 'Events',
//     description: 'See what meet-ups and other events we might be planning near you.',
//     href: '#',
//     icon: CalendarIcon,
//   },
//   { name: 'Security', description: 'Understand how we take your privacy seriously.', href: '#', icon: ShieldCheckIcon },
// ]

export const Header = () => {
  const navigate = useNavigate()
  return (
    <Popover className="relative">
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between border-b border-green-400 border-opacity-25 py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="/">
              <span className="sr-only">HempTemps</span>
              <img
                className="h-12 w-auto sm:h-16"
                src="/assets/logos/logo-horizontal-cropped.png"
                alt="HempTemps Logo"
              />
            </a>
          </div>
          <div className="-my-2 -mr-2 md:hidden">
            <PopoverButton className="relative inline-flex items-center justify-center rounded-md p-2 text-green-300 hover:bg-green-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </PopoverButton>
          </div>
          {/* <PopoverGroup as="nav" className="hidden space-x-10 md:flex">
            <Popover className="relative">
              {({ open }) => (
                <>
                  <PopoverButton
                    className={cn(
                      open ? 'text-slate-600' : 'text-green-500',
                      'hover:text-grey inline-flex items-center rounded-md text-base font-medium focus:outline-none',
                    )}>
                    <span>Solutions</span>
                    <ChevronDownIcon
                      className={cn(open ? 'text-white' : 'text-green-500', 'group-hover:text-gray ml-2 h-5 w-5')}
                      aria-hidden="true"
                    />
                  </PopoverButton>

                  <Transition
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1">
                    <PopoverPanel className="absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {solutions.map(item => (
                            <a
                              key={item.name}
                              href={item.href}
                              className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50">
                              <item.icon className="h-6 w-6 flex-shrink-0 text-green-600" aria-hidden="true" />
                              <div className="ml-4">
                                <p className="text-base font-medium text-gray-900">{item.name}</p>
                                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                        <div className="space-y-6 bg-gray-50 px-5 py-5 sm:flex sm:space-x-10 sm:space-y-0 sm:px-8">
                          {callsToAction.map(item => (
                            <div key={item.name} className="flow-root">
                              <a
                                href={item.href}
                                className="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 hover:bg-gray-100">
                                <item.icon className="h-6 w-6 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                <span className="ml-3">{item.name}</span>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverPanel>
                  </Transition>
                </>
              )}
            </Popover>

            <a href="/pricing" className="hover:text-gray text-base font-medium text-green-500">
              Pricing
            </a>
            <a href="/" className="hover:text-gray text-base font-medium text-green-500">
              Docs
            </a>

            <Popover className="relative">
              {({ open }) => (
                <>
                  <PopoverButton
                    className={cn(
                      open ? 'text-gray' : 'text-green-500',
                      'inline-flex items-center rounded-md text-base font-medium ',
                    )}>
                    <span>More</span>
                    <ChevronDownIcon
                      className={cn(open ? 'text-gray' : 'text-green-500', 'group-hover:text-gray ml-2 h-5 w-5')}
                      aria-hidden="true"
                    />
                  </PopoverButton>

                  <Transition
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1">
                    <PopoverPanel className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {resources.map(item => (
                            <a
                              key={item.name}
                              href={item.href}
                              className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50">
                              <item.icon className="h-6 w-6 flex-shrink-0 text-green-600" aria-hidden="true" />
                              <div className="ml-4">
                                <p className="text-base font-medium text-gray-900">{item.name}</p>
                                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                        <div className="bg-gray-50 px-5 py-5 sm:px-8 sm:py-8">
                          <div>
                            <h3 className="text-base font-medium text-gray-500">Recent Posts</h3>
                            <ul className="mt-4 space-y-4">
                              {recentPosts.map(post => (
                                <li key={post.id} className="truncate text-base">
                                  <a href={post.href} className="font-medium text-gray-900 hover:text-gray-700">
                                    {post.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-5 text-sm">
                            <a href="/" className="font-medium text-green-600 hover:text-green-500">
                              View all posts
                              <span aria-hidden="true"> &rarr;</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </PopoverPanel>
                  </Transition>
                </>
              )}
            </Popover>
          </PopoverGroup> */}
          <div className="hidden items-center justify-end space-x-8 md:flex md:flex-1 lg:w-0">
            <Button text onClick={() => navigate('/login')} className="whitespace-nowrap text-base font-medium">
              Log in
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent px-4 py-2 text-base font-medium">
              Sign up
            </Button>
          </div>
        </div>
      </div>

      <Transition
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95">
        <PopoverPanel
          focus
          className="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden">
          {({ close }) => (
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="space-y-6 px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <img
                      className="h-12 w-auto sm:h-16"
                      src="/assets/logos/logo-horizontal-cropped.png"
                      alt="HempTemps Logo"
                    />
                  </div>
                  <div className="-mr-2">
                    <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </PopoverButton>
                  </div>
                </div>
                {/* <div className="mt-6">
                <nav className="grid gap-y-8">
                  {solutions.map(item => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                      <item.icon className="h-6 w-6 flex-shrink-0 text-green-600" aria-hidden="true" />
                      <span className="ml-3 text-base font-medium text-gray-900">{item.name}</span>
                    </a>
                  ))}
                </nav>
              </div> */}
              </div>
              <div className="space-y-6 px-5 py-6">
                {/* <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <a href="/" className="text-base font-medium text-gray-900 hover:text-gray-700">
                  Pricing
                </a>

                <a href="/" className="text-base font-medium text-gray-900 hover:text-gray-700">
                  Docs
                </a>

                <a href="/" className="text-base font-medium text-gray-900 hover:text-gray-700">
                  Blog
                </a>

                <a href="/" className="text-base font-medium text-gray-900 hover:text-gray-700">
                  Contact Sales
                </a>
                {resources.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-base font-medium text-gray-900 hover:text-gray-700">
                    {item.name}
                  </a>
                ))}
              </div> */}
                <div>
                  <Button
                    onClick={() => {
                      navigate('/signup')
                      close()
                    }}
                    className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md border border-transparent px-4 py-2 text-base font-medium">
                    Sign up
                  </Button>
                  <p className="mt-6 text-center text-base font-medium text-gray-500">
                    Existing customer?&nbsp;
                    <a href="/" className="text-green-600 hover:text-green-500">
                      Log in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  )
}
