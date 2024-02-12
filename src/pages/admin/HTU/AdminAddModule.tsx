import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { RequestService } from '../../../services/RequestService'
import {  SelectedOptionInterface, TagsInterface } from '../../../interfaces/Global'


import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import FormModule from './components/FormModule'
import { Category } from '../../../interfaces/Category'

export default function AdminAddModule() {
  const [title, setTitle] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [level, setLevel] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)
  const [tags, setTags] = useState<TagsInterface[]>([])
  const [categories, setCategories] = useState<SelectedOptionInterface[]>([
    {
      name: 'Select',
      code: 'select',
    },
  ])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  const levelOptions: SelectedOptionInterface[] = [
    {
      name: 'All levels',
      code: 'all',
    },
    {
      name: 'Beginner',
      code: 'beginner',
    },
    {
      name: 'Intermediate',
      code: 'intermediate',
    },
    {
      name: 'Advanced',
      code: 'advanced',
    },
  ]

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0])
    }
  }

  const handleCreated = async () => {
    if (!image) {
      console.error('No image selected')
      return
    }
    if (category === 'select') {
      console.error('No category selected')
      return
    }
    if (level === 'all') {
      console.error('No level selected')
      return
    }

    const formData = new FormData()
    formData.append('image', image)
    formData.append('title', title)
    formData.append('category', category)
    formData.append('level', level)
    formData.append('description', description)
    formData.append('state_tags', JSON.stringify(tags))

    try {
      const response = await RequestService(`modules`, 'POST', formData, 'binary')

      if (response.ok) {
        console.log('Data and image uploaded successfully')
      } else {
        console.error('Error uploading data and image')
      }
    } catch (error) {
      console.error('Request error:', error)
    }
    navigate('/admin/learn/modules')
  }
  const fecthData = async () => {
    const response: Category[] = await RequestService('categories')
    if (response.length !== 0) {
      const categoriesMap = response.map(object => {
        return {
          name: object.title,
          code: object._id,
        }
      })
      setCategories([...categories, ...categoriesMap])
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (categories.length === 1) {
      fecthData()
    }
  }, [categories])

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeaderComponent title={'Create Module'} />
      <FormModule action="add" />
    </div>
  )
}
