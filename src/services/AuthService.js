import cookies from 'js-cookie'

export const AuthService = async path => {
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
    method: 'GET',
    credentials: 'include',
    headers,
  }

  const response = await fetch(url, options)
  // if (response.status === 401) {
  //   redirect('/')
  // }
  return response.json()
}

export const LogoutService = async () => {
  const cookieStore = cookies()
  cookieStore.delete('access_token')
  // redirect('/')
}
