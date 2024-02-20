import { Documents, TagsInterface } from './Global'

export interface Category extends Documents {
  description: string
  image: string
  is_disabled?: boolean
  title: string
  createdAt: Date
  updatedAt: Date
  progress: number
  state_tags: TagsInterface[]
}


export interface CategoryTitle {
  title: string
  _id: string
}