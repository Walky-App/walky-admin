import { Documents, TagsInterface } from './Global'

export interface Module extends Documents {
  category: string
  description: string
  image: string
  is_disabled?: boolean
  level: string
  title: string
  total_time: number
  state_tags: TagsInterface[]
  units?: any[]
}
