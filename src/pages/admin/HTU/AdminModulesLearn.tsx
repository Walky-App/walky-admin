import EmptyState from '../../../components/shared/general/EmptyState'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import { SelectedOptionInterface } from '../../../interfaces/Global'

export default function AdminModulesLearn() {
  const selectOption: SelectedOptionInterface[] = [{
    name: 'All',
    code: 'all'
  }, {
    name: 'Active',
    code: 'active'
  }, {
    name: 'Inactive',
    code: 'inactive'
  }]

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeaderComponent
        title={'Manage Modules'}
        search
        selectedOptions={selectOption}
        actionButton={{
          to: '/learn/modules/new',
          text: 'New Module',
        }}
      />
      <EmptyState type="module" to="/learn/modules/new" />
    </div>
  )
}
