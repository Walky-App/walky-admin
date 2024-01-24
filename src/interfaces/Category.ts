import { Documents } from './Global'

export interface Category extends Documents {
  description: String
  image: String
  is_disabled?: Boolean
  title: String
  createdAt: Date
  updatedAt: Date
}
