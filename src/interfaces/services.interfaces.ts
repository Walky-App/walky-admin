export interface IRequestService {
  (path: string, method?: string, body?: string): Promise<any>
}

export interface ITokenInfo {
  _id: string
  access_token: string
  role: string
  first_name: string
  avatar?: string
}
