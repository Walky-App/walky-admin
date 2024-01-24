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

export const CheckSession = async () => {
  const url = `${process.env.REACT_APP_PUBLIC_API}/auth/user`

  const headers = {
    'Content-Type': 'application/json',
  }

  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers,
  }

  const response = await fetch(url, options)
  if (response.status === 401) {
    return response
  }
  return response.json()
}
