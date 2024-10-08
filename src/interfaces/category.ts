import type { Documents, TagsInterface } from './global'

export interface Category extends Documents {
  createdAt: Date
  description: string
  image: string
  is_disabled?: boolean
  modules_number: number
  total_units: number
  total_time: number
  progress: number
  state_tags: TagsInterface[]
  title: string
  updatedAt: Date
}

export interface CategoryTitle {
  _id: string
  title: string
}
