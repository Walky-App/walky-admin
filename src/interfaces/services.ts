export type IRequestService = (path: string, method?: string, body?: never, dataType?: string) => Promise<never>

export interface ITokenInfo {
  _id: string
  access_token: string
  role: string
  first_name: string
  avatar?: string
}
