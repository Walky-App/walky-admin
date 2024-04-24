/* eslint-disable @typescript-eslint/no-explicit-any */
import { type IRequestService } from '../interfaces/services'
import { GetTokenInfo } from '../utils/tokenUtil'

export const RequestService: IRequestService = async (
  path: string,
  method = 'GET',
  body: any = null,
  dataType = 'json',
): Promise<any> => {
  const { access_token } = GetTokenInfo()

  const url = `${process.env.REACT_APP_PUBLIC_API}/${path}`

  const headersJsonData = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`,
  }

  const headersBinaryData = {
    Authorization: `Bearer ${access_token}`,
  }

  const headers = dataType === 'json' ? headersJsonData : headersBinaryData

  const bodyData = dataType === 'json' ? JSON.stringify(body) : body

  const options: RequestInit = {
    method,
    headers,
    body: body ? bodyData : undefined,
  }

  const response = await fetch(url, options)
  return response.json()
}
