export type IRequestService = (path: string, method?: string, body?: unknown, dataType?: string) => Promise<unknown>

export interface ITokenInfo {
  _id: string
  access_token: string
  role: string
  first_name: string
  avatar?: string
}
