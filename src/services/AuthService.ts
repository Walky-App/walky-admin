import { LoginData } from '../interfaces/Global'
import { RequestService } from './RequestService'

export const LoginService = async (body: LoginData) => {
  try {
    const response = await RequestService(`auth/login`, 'POST', body)
    if (response) return response
  } catch (error) {
    console.error(error)
  }
}

export const LogoutService = async () => {
  localStorage.removeItem('ht_usr')

  return true
}
