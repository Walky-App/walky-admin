import { Outlet } from 'react-router-dom'

import { FooterComponent } from '../layout/FooterComponent'
import { Header } from './Header'

export const LayoutPublic = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto max-w-6xl">
        <Outlet />
        <FooterComponent />
      </div>
    </>
  )
}
