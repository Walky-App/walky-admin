import { LoginData } from '../interfaces/Global'

export const LoginService = async (body: LoginData) => {
  const url = `${process.env.REACT_APP_PUBLIC_API}/auth/login`

  const options: RequestInit = {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }

  const response = await fetch(url, options)
  return await response.json()
}

export const LogoutService = async () => {
  localStorage.removeItem('ht_usr')

  return true
}
