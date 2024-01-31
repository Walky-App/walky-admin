export const GetTokenInfo = () => {
  const ls_data = JSON.parse(localStorage.getItem('ht_usr') as any)

  const { _id, access_token, role, first_name } = ls_data ? ls_data : { _id: '', access_token: '', role: '', first_name: ''}
  return { _id, access_token, role, first_name }
}

export const SetToken = (role: string, _id: string, access_token: string, first_name: string) => {
  localStorage.setItem('ht_usr', JSON.stringify({ role: role, _id: _id, first_name: first_name, access_token: access_token }))
  return true
}
