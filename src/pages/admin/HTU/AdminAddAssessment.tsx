import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { FormAssessment } from './components/FormAssessment'

export const AdminAddAssessment = () => {
  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeadingComponent title="Create Assessment" />
      <FormAssessment action="create" />
    </div>
  )
}
