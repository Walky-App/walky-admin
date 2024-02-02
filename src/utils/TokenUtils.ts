import { ITokenInfo } from '../interfaces/services.interfaces'

export const GetTokenInfo = () => {
  const ls_data = JSON.parse(localStorage.getItem('ht_usr') as any)

  const { _id, access_token, role, first_name } = ls_data
    ? ls_data
    : { _id: '', access_token: '', role: '', first_name: '' }
  return { _id, access_token, role, first_name }
}

export const SetToken = (ls_info: ITokenInfo) => {
  localStorage.setItem('ht_usr', JSON.stringify(ls_info))
  return true
}
