/* eslint-disable @typescript-eslint/no-explicit-any */

export type IRequestService = (path: string, method?: string, body?: any, dataType?: string) => Promise<any>

interface IOnboarding {
  step_number: number
  description: string
  type: string
  completed: boolean
}
export interface ITokenInfo {
  _id: string
  access_token: string
  role: string
  first_name: string
  state: string
  avatar?: string
  onboarding?: IOnboarding
}
