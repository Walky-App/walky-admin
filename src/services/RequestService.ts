import { IRequestService } from '../interfaces/services.interfaces'
import { GetTokenInfo } from '../utils/TokenUtils'

export const RequestService = async (
  path: string,
  method: string = 'GET',
  body: any = null,
): Promise<IRequestService> => {
  
  const { access_token } = GetTokenInfo()

  const url = `${process.env.REACT_APP_PUBLIC_API}/${path}`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`,
  }

  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }

  const response = await fetch(url, options)
  return response.json()
}
