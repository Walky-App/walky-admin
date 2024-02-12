import { IRequestService } from '../interfaces/services.interfaces'
import { GetTokenInfo } from '../utils/TokenUtils'

export const RequestService: IRequestService = async (
  path: string,
  method: string = 'GET',
  body: any = null,
  dataType: string = 'json',
): Promise<any> => {
  const { access_token } = GetTokenInfo()

  const url = `${process.env.REACT_APP_PUBLIC_API}/${path}`
  console.log('url => ', url)

  const headersJsonData = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`,
  }

  const headersBinaryData = {
    Authorization: `Bearer ${access_token}`,
  }

  const headers = dataType === 'json' ? headersJsonData : headersBinaryData

  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }

  const response = await fetch(url, options)
  return response.json()
}
