import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { FormCategory } from './components/FormCategory'

export const AdminAddCategory = () => {
  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeadingComponent title="Create Category" />
      <FormCategory action="add" />
    </div>
  )
}
