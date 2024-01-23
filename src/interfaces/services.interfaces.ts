export interface IRequestService {
  (path: string, method?: string, body?: string): Promise<any>
}
