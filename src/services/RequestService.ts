import { IRequestService } from '../interfaces/services.interfaces'

export const RequestService = async (
  path: string,
  method: string = 'GET',
  body: any = null,
): Promise<IRequestService> => {
  const url = `${process.env.REACT_APP_PUBLIC_API}/${path}`
  const headers = {
    'Content-Type': 'application/json',
  }

  const options: RequestInit = {
    method,
    credentials: 'include' as RequestCredentials,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }

  const response = await fetch(url, options)
  return response.json()
}
