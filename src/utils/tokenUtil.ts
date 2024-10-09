import { type ITokenInfo } from '../interfaces/services'

export const GetTokenInfo = (): ITokenInfo => {
  const ls_data = JSON.parse(localStorage.getItem('walky_usr') as string)

  const { _id, access_token, role, first_name, avatar }: ITokenInfo = ls_data
    ? ls_data
    : { _id: '', access_token: '', role: '', first_name: '', avatar: '', state: '' }
  return { _id, access_token, role, first_name, avatar }
}

export const SetToken = (ls_info: ITokenInfo) => {
  localStorage.setItem('walky_usr', JSON.stringify(ls_info))
  return true
}
