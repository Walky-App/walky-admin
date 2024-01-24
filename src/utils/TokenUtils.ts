export const GetTokenInfo = () => {
  const { user, access_token, role } = JSON.parse(localStorage.getItem('ht_usr') as any)

  console.log('user in LS', user)
  return { user, access_token, role }
}

export const SetToken = (role: string, access_token: string) => {
  localStorage.setItem('ht_usr', JSON.stringify({ role: role, access_token: access_token }))
  return true
}
