import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { CurrencyDollarIcon, CursorArrowRaysIcon, UsersIcon } from '@heroicons/react/24/outline'

import { cn } from '../../../../utils/cn'

const stats = [
  { id: 1, name: 'Total Users', stat: '71,897', icon: UsersIcon, change: '122', changeType: 'increase' },
  { id: 2, name: 'Total Jobs', stat: '58.16%', icon: CurrencyDollarIcon, change: '5.4%', changeType: 'increase' },
  { id: 3, name: 'Total Invoices', stat: '24.57%', icon: CursorArrowRaysIcon, change: '3.2%', changeType: 'decrease' },
]

export const SummaryHeader = () => {
  return (
    <div className="my-12">
      <h3 className="font-semibold leading-6 ">Last 14 days</h3>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(item => (
          <div key={item.id} className="relative overflow-hidden rounded-lg  px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-green-700 p-3">
                <item.icon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold">{item.stat}</p>
              <p
                className={cn(
                  item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                  'ml-2 flex items-baseline text-sm font-semibold',
                )}>
                {item.changeType === 'increase' ? (
                  <ArrowUpIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 self-center text-green-700" />
                ) : (
                  <ArrowDownIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 self-center text-red-500" />
                )}

                <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                {item.change}
              </p>
              <div className="absolute inset-x-0 bottom-0 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="/" className="font-medium text-green-600 hover:text-green-700">
                    View all<span className="sr-only"> {item.name} stats</span>
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
