import { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { TabPanel, TabView } from 'primereact/tabview'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { useAuth } from '../../../contexts/AuthContext'
import { type IUser } from '../../../interfaces/User'
import { type ITrainingData } from '../../../interfaces/training'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { roleChecker, roleTxt } from '../../../utils/roleChecker'
import { ProfileDetail } from './ProfileDetail'
import { ProfileDocuments } from './ProfileDocuments'
import { ProfileTimesheets } from './ProfileTimesheets'
import { ProfileTraining } from './ProfileTraining'

export const UserProfile = () => {
  const [loading, setLoading] = useState(false)
  const [userTraining, setUserTraining] = useState<ITrainingData>({} as ITrainingData)
  const [formUser, setFormUser] = useState<IUser>({
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
    is_approved: false,
  })

  const { user } = useAuth()
  const { showToast } = useUtils()
  const { id } = useParams()
  const role = roleChecker()

  useEffect(() => {
    if (!user) return
    const getUser = async () => {
      setLoading(true)
      try {
        const response = await requestService({ path: `users/${id ? id : user?._id}` })
        if (response.ok) {
          const data = (await response.json()) as IUser
          setFormUser(data)

          const trainingResponse = await requestService({ path: `lms/${id ? id : user?._id}` })
          if (trainingResponse.ok) {
            const trainingData = (await trainingResponse.json()) as ITrainingData
            setUserTraining(trainingData)
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
  }, [id, showToast, user])

  const showTabForClient = () => role !== 'client' && roleTxt(formUser.role) !== 'Client'

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
          <ProfileDetail formUser={formUser} setFormUser={setFormUser} />
        </TabPanel>
        {showTabForClient() ? (
          <TabPanel header="Documents">
            <ProfileDocuments formUser={formUser} setFormUser={setFormUser} />
          </TabPanel>
        ) : null}
        {showTabForClient() ? (
          <TabPanel header="Training">
            <ProfileTraining userTraining={userTraining} />
          </TabPanel>
        ) : null}
        {showTabForClient() || role === 'Admin' ? (
          <TabPanel header="TimeSheets">
            <ProfileTimesheets userId={formUser._id} />
          </TabPanel>
        ) : null}
      </TabView>
    </div>
  )
}
