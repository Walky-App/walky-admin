export const AuthService = async (path: string) => {
  const url = `${process.env.REACT_APP_PUBLIC_API}/${path}`

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
    // redirect('/')
  }
  return response.json()
}

// export const LogoutService = async () => {
//   const cookieStore = cookies()
//   cookieStore.delete('access_token')
//   redirect('/')
// }
