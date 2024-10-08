import { type ITokenInfo } from '../interfaces/services'

export const GetTokenInfo = (): ITokenInfo => {
  const ls_data = JSON.parse(localStorage.getItem('ht_usr') as string)

  const { _id, access_token, role, first_name, avatar, state, onboarding }: ITokenInfo = ls_data
    ? ls_data
    : { _id: '', access_token: '', role: '', first_name: '', avatar: '', state: '' }
  return { _id, access_token, role, first_name, avatar, state, onboarding }
}

export const SetToken = (ls_info: ITokenInfo) => {
  localStorage.setItem('ht_usr', JSON.stringify(ls_info))
  return true
}
