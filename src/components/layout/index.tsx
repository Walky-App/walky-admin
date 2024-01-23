import { LayoutRouteProps } from 'react-router-dom'

import Header from './Header'
import SideBar from './Sidebar'
import Footer from './Footer'

export default function Layout({ children }: LayoutRouteProps) {
  return (
    <div>
      <Header />
      <SideBar />
      {children}
      <Footer />
    </div>
  )
}
