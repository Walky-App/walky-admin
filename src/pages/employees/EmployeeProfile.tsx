import ProfileForm from '../../components/shared/forms/ProfileForm'
import { useAuth } from '../../contexts/AuthContext'

export default function EmployeeProfile() {
  const { user } = useAuth()

  console.log('user in employeeprofile', user)
  return <ProfileForm user={user} />
}
