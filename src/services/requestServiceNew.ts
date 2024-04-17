import { GetTokenInfo } from '../utils/TokenUtils'

type IRequestService = (path: string, method?: string, body?: BodyInit, dataType?: string) => Promise<Response>

export const requestService: IRequestService = async (
  path: string,
  method = 'GET',
  body: BodyInit | undefined,
  dataType = 'json',
): Promise<Response> => {
  const { access_token } = GetTokenInfo()
  const url = `${process.env.REACT_APP_PUBLIC_API}/${path}`

  let headers: HeadersInit = {
    Authorization: `Bearer ${access_token}`,
  }

  if (dataType === 'json') {
    headers = { ...headers, 'Content-Type': 'application/json' }
  }

  const options: RequestInit = {
    method,
    headers,
    body: body !== undefined && dataType === 'json' ? JSON.stringify(body) : null,
  }

  return fetch(url, options)
}
