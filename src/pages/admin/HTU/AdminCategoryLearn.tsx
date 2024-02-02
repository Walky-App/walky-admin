import EmptyState from '../../../components/shared/general/EmptyState'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import { SelectedOptionInterface } from '../../../interfaces/Global'

export default function AdminCategoryLearn() {
  const selectOption: SelectedOptionInterface[] = [
    {
      id: 1,
      name: 'All',
    },
    {
      id: 2,
      name: 'Active',
    },
    {
      id: 3,
      name: 'Inactive',
    },
  ]

    return (
        <div className="w-full sm:overflow-x-hidden">
            <HeaderComponent
                title={'Manage Categories'}
                search
                selectedOptions={selectOption}
                actionButton={
                    {
                        to: '/learn/categories/new',
                        text: 'New Category'
                    }
                } />
            <EmptyState type="category" to='/learn/categories/new' />
        </div>
    )
}
