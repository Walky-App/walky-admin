import { GetTokenInfo } from '../utils/tokenUtil'

interface IRequestServiceProps {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: BodyInit | undefined
  dataType?: 'json' | 'blob' | 'text' | 'formData' | 'arrayBuffer'
}

export const requestService = async ({
  path,
  method = 'GET',
  body = undefined,
  dataType = 'json',
}: IRequestServiceProps): Promise<Response> => {
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
    body: body !== undefined ? body : undefined,
  }

  return fetch(url, options)
}
