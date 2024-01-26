import ProfileForm from './AdminProfile'
import { GetTokenInfo } from '../../../utils/TokenUtils'

export default function AdminProfile() {
  const { _id } = GetTokenInfo()

  return <ProfileForm userId={_id} />
}
