import { Link, useLocation } from 'react-router-dom'
import { SideBarData } from './Sidebar'

interface Props {
  link: SideBarData
}

export default function SidebarMenuItem({ link }: Props) {

  const { pathname } = useLocation()
  const unread = 3
  return (
    <Link
      to={link.href}
      className={`flex items-center p-2 text-zinc-200 rounded-lg dark:text-zinc-50 hover:bg-zinc-400 dark:hover:bg-zinc-800 group 
      ${pathname === link.href ? 'bg-green-600' : ''}`}>
      <span className="text-2xl w-5 h-5 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-50">
        {link.icon}
      </span>
      <span className="flex-1 ms-3">{link.name}</span>
      {link.name === 'Messages' && unread > 0 && (
        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
          {unread}
        </span>
      )}
    </Link>
  )
}
