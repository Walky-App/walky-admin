import ProfileForm from './ProfileForm'
import { GetTokenInfo } from '../../utils/TokenUtils'

export default function EmployeeProfile() {
  const { _id } = GetTokenInfo()

  return <ProfileForm userId={_id} />
}
