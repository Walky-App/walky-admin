import { createContext, useContext, useState } from 'react'
import { Category } from '../interfaces/Category'
import { Module } from '../interfaces/Module'
import { SelectedOptionInterface } from '../interfaces/Global'
import { Unit } from '../interfaces/Unit'

interface AdminContextType {
  category: Category | undefined,
  setCategory: (user: Category | undefined) => void
  categoryOptions: SelectedOptionInterface[],
  setCategoryOptions: (options: SelectedOptionInterface[]) => void
  module: Module | undefined,
  setModule: (user: Module | undefined) => void
  unit: Unit | undefined,
  setUnit: (user: Unit | undefined) => void
}

const AdminContext = createContext<AdminContextType>({
  category: undefined,
  setCategory: () => { },
  categoryOptions: [],
  setCategoryOptions: () => { },
  module: undefined,
  setModule: () => { },
  unit: undefined,
  setUnit: () => { },
})

const AdminProvider = ({ children }: any) => {
  const [category, setCategory] = useState<Category>()
  const [module, setModule] = useState<Module>()
  const [unit, setUnit] = useState<Unit>()
  const [categoryOptions, setCategoryOptions] = useState<SelectedOptionInterface[]>([])

  return <AdminContext.Provider value={{ category, setCategory, module, setModule, unit, setUnit, categoryOptions, setCategoryOptions }}>{children}</AdminContext.Provider>
}

const useAdmin = () => useContext(AdminContext)
export { AdminProvider, useAdmin }
