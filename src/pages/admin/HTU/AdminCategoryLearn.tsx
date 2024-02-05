import EmptyState from '../../../components/shared/general/EmptyState'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import { SelectedOptionInterface } from '../../../interfaces/Global'

export default function AdminCategoryLearn() {
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
        title={'Manage Categories'}
        search
        selectedOptions={selectOption}
        actionButton={
          {
            to: '/admin/learn/category/new',
            text: 'New Category'
          }
        } />
      <EmptyState type="category" to='/admin/learn/category/new' />
    </div>
  )
}
