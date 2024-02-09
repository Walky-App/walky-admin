import { useEffect, useState } from 'react'
import EmptyState from '../../../components/shared/general/EmptyState'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import { SelectedOptionInterface } from '../../../interfaces/Global'
import { Module } from '../../../interfaces/Module'
import { RequestService } from '../../../services/RequestService'
import GlobalTable from '../../../components/shared/GlobalTable'
import { secondsToTimeDescription } from '../../../utils/FunctionUtils'

export default function AdminModulesLearn() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [modules, setModules] = useState<Module[]>([])
  const selectOption: SelectedOptionInterface[] = [
    {
      name: 'All',
      code: 'all',
    },
    {
      name: 'Active',
      code: 'active',
    },
    {
      name: 'Disabled',
      code: 'disabled',
    },
  ]

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
    const response: Module[] = await RequestService('modules')
    if (response.length !== 0) {
      setModules(response)
      console.log(response)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (modules.length === 0) {
      fecthData()
    }
  }, [modules])

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeaderComponent
        title={'Manage Modules'}
        search
        selectedOptions={selectOption}
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

