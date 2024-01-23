'use server'
import { cookies } from 'next/headers'

export const RequestService = async (path, method = 'GET', body = null) => {
  const cookieStore = cookies()
  const access_token = cookieStore.get('access_token')
  const url = `${process.env.REACT_APP_PUBLIC_API}/${path}`
  const headers = {
    'Content-Type': 'application/json',
  }

  if (access_token) {
    headers.Authorization = `Bearer ${access_token.value}`
  }
  const options = {
    method,
    credentials: 'include',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }

  const response = await fetch(url, options)
  return response.json()
}
