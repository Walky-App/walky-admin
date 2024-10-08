import { type LoginData } from '../interfaces/global'
import { requestService } from './requestServiceNew'

export const LoginService = async (body: LoginData) => {
  try {
    const response = await requestService({ path: 'auth/login', method: 'POST', body: JSON.stringify(body) })

    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error(error)
  }
}

export const LogoutService = async () => {
  localStorage.removeItem('ht_usr')
  localStorage.clear()
  return true
}
