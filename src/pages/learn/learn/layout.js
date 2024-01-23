import SideBar from '../../../components/shared/layouts/SideBar'

export default function LearnLayout({ children }) {
  return (
    <main className="relative h-screen overflow-hidden">
      <div className="mt-[80px] h-full flex items-start justify-between">
        <SideBar role={'temp'} />
        <div className="flex flex-col w-full pl-0 md:px-12 md:pt-8 md:space-y-4">
          <div className="h-screen overflow-auto md:pt-0 md:pr-0 md:pl-0">
            <div className="flex flex-col flex-wrap sm:flex-row ">{children}</div>
          </div>
        </div>
      </div>
    </main>
  )
}
