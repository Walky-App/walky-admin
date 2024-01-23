import { Outlet } from "react-router-dom";
import Header from './Header'
import SideBar from './Sidebar'
import Footer from './Footer'
const Layout = () => {
  return (
    <>
      <Header />
      <SideBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;