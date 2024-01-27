import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RequestService } from '../../../services/RequestService'

export default function AdminUserDetails() {
  const [userData, setUserState] = useState<any>({})
  const { id } = useParams()

  const fetchuser = async () => {
    const userData = await RequestService(`users/${id}`)
    setUserState(userData)
    console.log(userData)
  }

  useEffect(() => {
    fetchuser()
  }, [])

  return (
    <h2>
      User detail view {id} {userData.email}
    </h2>
  )
}
