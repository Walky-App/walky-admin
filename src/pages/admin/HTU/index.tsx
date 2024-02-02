import HeaderComponent from "../../../components/shared/general/HeaderComponent";
import {
    AcademicCapIcon,
    CalendarIcon,
    TagIcon,
} from '@heroicons/react/24/outline'
import { classNames } from "../../../utils/Tailwind";
import { Link } from "react-router-dom";

export default function AdminDashboardLearn() {
    const items = [
        {
            title: 'Categories',
            description: 'Manager categories you can create, update or disable.',
            icon: TagIcon,
            background: 'bg-blue-500',
            to: '/admin/learn/categories'
        },
        {
            title: 'Modules',
            description: 'Manager Modules you can create, update or disable.',
            icon: AcademicCapIcon,
            background: 'bg-yellow-500',
            to: '/admin/learn/modules'
        },
    ]
    return (
        <div className="w-full sm:overflow-x-hidden">
            <HeaderComponent title={'Manage HTU'} />
            <ul role="list" className="grid grid-cols-1 gap-6 border-b border-gray-200 pb-6 sm:grid-cols-2">
                {items.map((item, itemIdx) => (
                    <Link key={itemIdx} to={item.to} >
                        <li className="flow-root">
                            <div className="relative mx-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-green-500 hover:bg-gray-50">
                                <div
                                    className={classNames(
                                        item.background,
                                        'flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg'
                                    )}
                                >
                                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        <div className="focus:outline-none">
                                            <span className="absolute inset-0" aria-hidden="true" />
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
        </div >
    )
}
