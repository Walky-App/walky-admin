import { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { TabPanel, TabView } from 'primereact/tabview'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
// import { Chat } from '../../../components/shared/messages/Chat'
import { useAuth } from '../../../contexts/AuthContext'
// import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { roleChecker, roleTxt } from '../../../utils/roleChecker'
import { GetTokenInfo } from '../../../utils/tokenUtil'
// import { ProfileDetail } from './ProfileDetail'
// import { ProfileDocuments } from './ProfileDocuments'

// import { ProfileNotes } from './ProfileNotes'

export const UserProfile = () => {
  const [loading, setLoading] = useState(false)
  // const [, setLoggedInUser] = useState<IUser | undefined>(() ?? undefined)
  const [formUser, setFormUser] = useState({
    _id: '',
    access_token: '',
    active: false,
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    gender: '',
    birth_date: new Date(),
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    internal_notes: [],
    notifications: [],
    createdAt: '',
    role: '',
    verified: false,
    companies: [],
    is_active: false,
  })

  const { user } = useAuth()
  const { showToast } = useUtils()
  const { id } = useParams()
  const role = roleChecker()
  const loggedInuser_id = GetTokenInfo()._id

  useEffect(() => {
    if (!user) return
    const getUser = async () => {
      setLoading(true)
      try {
        const response = await requestService({ path: `users/${id ? id : user?._id}` })
        if (response.ok) {
          const data = await response.json()
          setFormUser(data)

          const loggedInUser = await requestService({ path: `users/${loggedInuser_id}` })
          if (loggedInUser.ok) {
            // const loggedInUserData = (await loggedInUser.json()) as IUser
            // setLoggedInUser(loggedInUserData)
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        showToast({ severity: 'error', summary: 'Error', detail: 'Error fetching user' })
      } finally {
        setLoading(false)
      }
    }
    getUser()
  }, [id, loggedInuser_id, showToast, user])

  // const handleSubmit = async (): Promise<void> => {
  //   try {
  //     const response = await requestService({
  //       path: `users/${formUser?._id}`,
  //       method: 'PATCH',
  //       body: JSON.stringify(formUser),
  //     })
  //     if (response.ok) {
  //       const data = await response.json()
  //       showToast({ severity: 'success', summary: 'Success', detail: 'User updated' })
  //       setFormUser(data)
  //     }
  //   } catch (error) {
  //     console.error('Error updating user:', error)
  //   }
  // }

  const notShowTabForClient = () => role !== 'client' && roleTxt(formUser.role) !== 'Client'

  return loading ? (
    <HTLoadingLogo />
  ) : (
    <div>
      <div className="mb-8">
        <div className="text-3xl font-bold">
          {formUser.first_name} {formUser.last_name}
        </div>
        <div>{formUser.address}</div>
      </div>
      <TabView>
        <TabPanel header="User Detail">
          {/* <ProfileDetail formUser={formUser} setFormUser={setFormUser} updateUser={handleSubmit} /> */}
        </TabPanel>
        {notShowTabForClient() ? (
          <TabPanel header="Documents">
            {/* <ProfileDocuments formUser={formUser} setFormUser={setFormUser} /> */}
          </TabPanel>
        ) : null}

        {role === 'admin' ? (
          <TabPanel header="Notes">{/* <ProfileNotes formUser={formUser} loggedInUser={loggedInUser} /> */}</TabPanel>
        ) : null}
        {role === 'admin' ? <TabPanel header="Messages">{/* <Chat formUser={formUser} /> */}</TabPanel> : null}
      </TabView>
    </div>
  )
}
