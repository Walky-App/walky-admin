import { ReactNode, createContext, useContext, useState } from 'react'
import { Category } from '../interfaces/category'
import { Module } from '../interfaces/module'
import { SelectedOptionInterface } from '../interfaces/global'
import { Assessment, Unit } from '../interfaces/unit'

interface AdminContextType {
  category: Category | undefined,
  setCategory: (user: Category | undefined) => void
  categoryOptions: SelectedOptionInterface[],
  setCategoryOptions: (options: SelectedOptionInterface[]) => void
  module: Module | undefined,
  setModule: (user: Module | undefined) => void
  unit: Unit | undefined,
  setUnit: (user: Unit | undefined) => void
  assessment: Assessment | undefined,
  setAssessment: (user: Assessment | undefined) => void
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
  assessment: undefined,
  setAssessment: () => { },
})

interface AdminProviderProps {
  children: ReactNode;
}

const AdminProvider = ({ children }: AdminProviderProps) => {
  const [category, setCategory] = useState<Category>()
  const [module, setModule] = useState<Module>()
  const [unit, setUnit] = useState<Unit>()
  const [assessment, setAssessment] = useState<Assessment>()
  const [categoryOptions, setCategoryOptions] = useState<SelectedOptionInterface[]>([])

  return <AdminContext.Provider value={{ category, setCategory, module, setModule, unit, setUnit, categoryOptions, setCategoryOptions, assessment, setAssessment }}>{children}</AdminContext.Provider>
}

const useAdmin = () => useContext(AdminContext)
export { AdminProvider, useAdmin }
