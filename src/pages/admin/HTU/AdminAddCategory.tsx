import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { RequestService } from '../../../services/RequestService'

import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import FormCategory from './components/FormCategory'
import { TagsInterface } from '../../../interfaces/Global'

export default function AdminAddCategory() {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)
  const [tags, setTags] = useState<TagsInterface[]>([])
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!image) {
      console.error('No image selected')
      return
    }

    const formData = new FormData()
    formData.append('image', image)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('state_tags', JSON.stringify(tags))

    try {
      const response = await RequestService(
        `categories`,
        'POST',
        formData,
        'binary',
      )

      if (response.ok) {
        console.log('Data and image uploaded successfully')
      } else {
        console.error('Error uploading data and image')
      }
    } catch (error) {
      console.error('Request error:', error)
    }

    navigate('/admin/learn/categories')
  }

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeaderComponent title={'Create Category'} />
      <FormCategory action="add" />
    </div>
  )
}
