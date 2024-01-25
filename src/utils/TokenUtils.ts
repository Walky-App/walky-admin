export const GetTokenInfo = () => {
  const { _id, access_token, role } = JSON.parse(localStorage.getItem('ht_usr') as any)

  return { _id, access_token, role }
}

export const SetToken = (role: string, _id: string, access_token: string) => {
  localStorage.setItem('ht_usr', JSON.stringify({ role: role, _id: _id, access_token: access_token }))
  return true
}
