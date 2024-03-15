import type { CategoryTitle } from './category'
import type { Documents, TagsInterface } from './global'
import type { Unit } from './unit'

export interface Module extends Documents {
  category: CategoryTitle
  description: string
  image: string
  is_disabled?: boolean
  level: string
  title: string
  total_time: number
  state_tags: TagsInterface[]
  units?: Unit[]
}
