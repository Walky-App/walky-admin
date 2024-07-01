import { useState, useEffect } from 'react'

import { TabPanel, TabView } from 'primereact/tabview'

import { useAuth } from '../../../contexts/AuthContext'
import { type IUser } from '../../../interfaces/User'
import { type ITrainingData } from '../../../interfaces/training'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { ProfileDetail } from './ProfileDetail'
import { ProfileDocuments } from './ProfileDocuments'
import { ProfileTraining } from './ProfileTraining'

export const UserProfile = () => {
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
    notifications: [],
    createdAt: '',
    role: '',
    verified: false,
    is_approved: false,
  })

  const { user } = useAuth()
  const { showToast } = useUtils()

  useEffect(() => {
    if (!user) return
    const getUser = async () => {
      try {
        const response = await requestService({ path: `users/${user?._id}` })
        if (response.ok) {
          const data = (await response.json()) as IUser
          setFormUser(data)

          const trainingResponse = await requestService({ path: `lms/${user?._id}` })
          if (trainingResponse.ok) {
            const trainingData = (await trainingResponse.json()) as ITrainingData
            setUserTraining(trainingData)
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        showToast({ severity: 'error', summary: 'Error', detail: 'Error fetching user' })
      }
    }
    getUser()
  }, [user, showToast])

  return (
    <div>
      <div className="mb-8">
        <div className="text-3xl font-bold">
          {formUser.first_name} {formUser.last_name}
        </div>
        <div className="">{formUser.address}</div>
      </div>
      <TabView>
        <TabPanel header="User Detail">
          <ProfileDetail formUser={formUser} setFormUser={setFormUser} />
        </TabPanel>
        <TabPanel header="Documents">
          <ProfileDocuments formUser={formUser} setFormUser={setFormUser} />
        </TabPanel>
        <TabPanel header="Training">
          <ProfileTraining userTraining={userTraining} />
        </TabPanel>
      </TabView>
    </div>
  )
}
