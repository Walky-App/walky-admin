import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import SideBar from './Sidebar'

export default function Layout() {
  return (
    <div className="bg-zinc-50 ">
      <Header />
      <main className="relative h-screen overflow-hidden">
        <div className="mt-[80px] flex items-start justify-between">
          <SideBar />
          <div className="flex flex-col w-full pl-0 md:p-4 md:space-y-4">
            <div className="h-screen pt-2 pb-24 pl-2 pr-2 overflow-auto md:pt-0 md:pr-0 md:pl-0">
              <div className="flex flex-col flex-wrap sm:flex-row px-12 py-12 ">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
