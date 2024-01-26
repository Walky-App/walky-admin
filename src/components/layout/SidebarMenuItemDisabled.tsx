import { SideBarData } from './Sidebar'

interface Props {
  link: SideBarData
}

export default function SidebarMenuItem({ link }: Props) {
  const unread = 3
  return (
    <div className="flex items-center p-2 text-zinc-800 rounded-lg bg-zinc-600">
      <span className="text-2xl w-5 h-5 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-50">
        {link.icon}
      </span>
      <span className="flex-1 ms-3">{link.name}</span>
      {link.name === 'Messages' && unread > 0 && (
        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
          {unread}
        </span>
      )}
    </div>
  )
}
