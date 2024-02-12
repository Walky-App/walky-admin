import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import FormCategory from './components/FormCategory'

export default function AdminAddCategory() {

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeaderComponent title={'Create Category'} />
      <FormCategory action="add" />
    </div>
  )
}
