import { Documents } from './Global'

export interface Module extends Documents {
  category: string
  description: string
  image: string
  is_disabled?: boolean
  level: string
  title: string
  total_time: number
  units?: any[]
}
