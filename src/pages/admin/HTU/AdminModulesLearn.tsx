/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { EmptyState } from '../../../components/shared/general/EmptyState'
import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { useAdmin } from '../../../contexts/AdminContext'
import { type Category } from '../../../interfaces/category'
import { type SelectedOptionInterface } from '../../../interfaces/global'
import { type Module } from '../../../interfaces/module'
import { requestService } from '../../../services/requestServiceNew'
import { secondsToTimeDescription } from '../../../utils/functionUtils'

export const AdminModulesLearn = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [modules, setModules] = useState<Module[]>([])
  const { setCategoryOptions } = useAdmin()
  const [categories] = useState<SelectedOptionInterface[]>([
    {
      name: 'Select',
      code: 'select',
    },
  ])

  const categoryColumns = [
    { Header: 'Name', accessor: 'title' },
    { Header: 'Category', accessor: 'category.title' },
    {
      Header: 'Total time',
      accessor: 'total_time',
      Cell: ({ value }: { value: number }) => <span>{secondsToTimeDescription(value)}</span>,
    },
    { Header: 'Level', accessor: 'level' },
    {
      Header: 'Units',
      accessor: 'units',
      Cell: ({ value }: { value: string[] }) => <span>{value.length}</span>,
    },
    {
      Header: 'Status',
      accessor: 'is_disabled',
      Cell: ({ value }: { value: boolean }) => (!value ? <span> Active</span> : <span>Disabled</span>),
    },
  ]

  const fetchData = async () => {
    const requestModule = await requestService({ path: 'modules' })
    const responseModule: Module[] = await requestModule.json()
    if (responseModule.length !== 0) {
      setModules(responseModule)
    }
    const requestCategory = await requestService({ path: 'categories' })
    const responseCategory: Category[] = await requestCategory.json()
    if (responseCategory.length !== 0) {
      const categoriesMap = responseCategory.map(object => {
        return {
          name: object.title,
          code: object._id,
        }
      })
      setCategoryOptions([...categories, ...categoriesMap])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (categories.length === 1 && modules.length === 0) {
      fetchData()
    }
  }, [modules, categories])

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeadingComponent
        actionButton={{
          to: '/admin/learn/modules/new',
          text: 'New Module',
        }}
        title="Manage Modules"
      />
      {isLoading ? (
        <div className="flex h-96 flex-col items-center justify-center">
          <div className="text-2xl font-semibold text-black">Loading ...</div>
        </div>
      ) : (
        <>
          {modules.length === 0 && !isLoading ? <EmptyState to="/admin/learn/modules/new" type="module" /> : null}
          {modules.length > 0 && !isLoading ? (
            <div className="w-full">
              <GlobalTable allowClick columns={categoryColumns} data={modules} />
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
