import { createContext, useContext, useState } from 'react'
import { Category } from '../interfaces/Category'

interface AdminContextType {
  category: Category | undefined,
  setCategory: (user: Category) => void
}

const AdminContext = createContext<AdminContextType>({
  category: undefined,
  setCategory: () => { },
})

const AdminProvider = ({ children }: any) => {
  const [category, setCategory] = useState<Category>()

  return <AdminContext.Provider value={{ category, setCategory }}>{children}</AdminContext.Provider>
}

const useAdmin = () => useContext(AdminContext)
export { AdminProvider, useAdmin }
