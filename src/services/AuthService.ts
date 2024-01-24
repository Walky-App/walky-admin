import { loginData } from '@/interfaces/Login'

export const LoginService = async (body: loginData) => {
  const url = `${process.env.REACT_APP_PUBLIC_API}/auth/login`

  const headers = {
    'Content-Type': 'application/json',
  }

  const options: RequestInit = {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(body),
  }

  const response = await fetch(url, options)
  return response.json()
}

export const LogoutService = async () => {
  const url = `${process.env.REACT_APP_PUBLIC_API}/auth/logout`

  const headers = {
    'Content-Type': 'application/json',
  }

  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers,
  }

  const response = await fetch(url, options)
  return response.json()
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
