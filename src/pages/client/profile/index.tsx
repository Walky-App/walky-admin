import ProfileForm from './ClientProfile'
import { GetTokenInfo } from '../../../utils/TokenUtils'

export default function ClientProfile() {
  const { _id } = GetTokenInfo()

  return <ProfileForm userId={_id} />
}
