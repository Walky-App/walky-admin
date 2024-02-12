import { useEffect, useState } from 'react'
import EmptyState from '../../../components/shared/general/EmptyState'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import { SelectedOptionInterface } from '../../../interfaces/Global'
import { Module } from '../../../interfaces/Module'
import { RequestService } from '../../../services/RequestService'
import GlobalTable from '../../../components/shared/GlobalTable'
import { secondsToTimeDescription } from '../../../utils/FunctionUtils'
import { Category } from '../../../interfaces/Category'
import { useAdmin } from '../../../contexts/AdminContext'

export default function AdminModulesLearn() {
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

  const fecthData = async () => {
    const responseModule: Module[] = await RequestService('modules')
    if (responseModule.length !== 0) {
      setModules(responseModule)
    }
    const responseCategory: Category[] = await RequestService('categories')
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
    if (categories.length === 1 && (modules.length === 0)) {
      fecthData()
    }
  }, [modules, categories])

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeaderComponent
        title={'Manage Modules'}
        actionButton={{
          to: '/admin/learn/modules/new',
          text: 'New Module',
        }}
      />
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-2xl font-semibold text-black">Loading ...</div>
        </div>
      ) : (
        <>
          {modules.length === 0 && !isLoading && <EmptyState type="module" to="/admin/learn/modules/new" />}
          {modules.length > 0 && !isLoading && (
            <div className="w-full">
              <GlobalTable data={modules} columns={categoryColumns} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
