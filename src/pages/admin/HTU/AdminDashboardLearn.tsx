import { Link } from 'react-router-dom'

import { AcademicCapIcon, TagIcon } from '@heroicons/react/24/outline'

import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { cn } from '../../../utils/cn'

export const AdminDashboardLearn = () => {
  const items = [
    {
      title: 'Categories',
      description: 'Manage categories (create, update or disable).',
      icon: TagIcon,
      background: 'bg-green-500',
      to: '/admin/learn/categories',
    },
    {
      title: 'Modules',
      description: 'Manage Modules (can create, update or disable).',
      icon: AcademicCapIcon,
      background: 'bg-green-500',
      to: '/admin/learn/modules',
    },
  ]
  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeadingComponent title="Manage HTU" />
      <ul className="grid grid-cols-1 gap-6 border-gray-200 pb-6 sm:grid-cols-2">
        {items.map((item, itemIdx) => (
          <Link key={itemIdx} to={item.to}>
            <li className="flow-root">
              <div className="relative mx-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-green-500 hover:bg-gray-50">
                <div
                  className={cn(
                    item.background,
                    'flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg',
                  )}>
                  <item.icon aria-hidden="true" className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    <div className="focus:outline-none">
                      <span aria-hidden="true" className="absolute inset-0" />
                      <span>{item.title}</span>
                      <span aria-hidden="true"> &rarr;</span>
                    </div>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}
