import { Documents, TagsInterface } from './Global'
import { CategoryTitle } from './category'
import { Unit } from './unit'

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
