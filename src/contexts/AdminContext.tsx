import { createContext, useContext, useState } from 'react'
import { Category } from '../interfaces/Category'
import { Module } from '../interfaces/Module'
import { SelectedOptionInterface } from '../interfaces/Global'

interface AdminContextType {
  category: Category | undefined,
  setCategory: (user: Category) => void
  categoryOptions: SelectedOptionInterface[],
  setCategoryOptions: (options: SelectedOptionInterface[]) => void
  module: Module | undefined,
  setModule: (user: Module) => void
}

const AdminContext = createContext<AdminContextType>({
  category: undefined,
  setCategory: () => { },
  categoryOptions: [],
  setCategoryOptions: () => { },
  module: undefined,
  setModule: () => { },
})

const AdminProvider = ({ children }: any) => {
  const [category, setCategory] = useState<Category>()
  const [module, setModule] = useState<Module>()
  const [categoryOptions, setCategoryOptions] = useState<SelectedOptionInterface[]>([])

  return <AdminContext.Provider value={{ category, setCategory, module, setModule, categoryOptions, setCategoryOptions }}>{children}</AdminContext.Provider>
}

const useAdmin = () => useContext(AdminContext)
export { AdminProvider, useAdmin }
