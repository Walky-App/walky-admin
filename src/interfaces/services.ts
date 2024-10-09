/* eslint-disable @typescript-eslint/no-explicit-any */

export type IRequestService = (path: string, method?: string, body?: any, dataType?: string) => Promise<any>

export interface ITokenInfo {
  _id: string
  access_token: string
  role: string
  first_name?: string
  avatar?: string
}
