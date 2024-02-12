import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import FormModule from './components/FormModule'

export default function AdminAddModule() {

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeaderComponent title={'Create Module'} />
      <FormModule action="add" />
    </div>
  )
}
