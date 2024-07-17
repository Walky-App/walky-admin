import { Outlet } from 'react-router-dom'

import { Header } from './Header'

export const LayoutPublic = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto max-w-6xl">
        <Outlet />
        <footer className="bg-white py-6" aria-labelledby="footer-heading">
          <div className="pt-8 text-center md:items-center md:justify-center">
            <p className="mt-24 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
              Copyright © {new Date().getFullYear()} Hemp Temps
            </p>
            <p className="mt-24 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
              <a href="https://hemptemps.com/terms-and-conditions/" target="_blank" className="underline">
                Terms and Conditions
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
