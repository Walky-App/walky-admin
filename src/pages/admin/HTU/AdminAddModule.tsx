import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import { FileInput } from 'flowbite-react'
import TagsArray from './components/TagsArray'
import { ChangeEvent, useEffect, useState } from 'react'
import { SelectedOptionInterface, TagsInterface } from '../../../interfaces/Global'
import { useAuth } from '../../../contexts/AuthContext'
import SelectedOption from '../../../components/shared/general/SelectedOption'
import { Category } from '../../../interfaces/Category'
import { RequestService } from '../../../services/RequestService'
import { useNavigate } from 'react-router-dom'

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
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_API}/modules`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: formData,
      })

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
      <form>
        <div className="space-y-12">
          <div className=" pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  Title
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 ">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      onChange={e => setTitle(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                      placeholder="module title"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  Category
                </label>
                <div className="mt-2">
                  <SelectedOption
                    classStyle="w-full sm:max-w-md"
                    selectedOptions={categories}
                    setSelectedOptions={setCategory}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  Level
                </label>
                <div className="mt-2">
                  <SelectedOption
                    classStyle="w-full sm:max-w-md"
                    selectedOptions={levelOptions}
                    setSelectedOptions={setLevel}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    onChange={e => setDescription(e.target.value)}
                    placeholder="module description"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                  Module photo
                </label>
                <FileInput
                  className="mt-3"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={handleImageChange}
                  id="file-upload-helper-text"
                  helperText="PNG or JPG."
                />
              </div>

              <div className="col-span-full">
                <TagsArray tags={tags} setTags={setTags} optional />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreated}
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Create
          </button>
        </div>
      </form>
    </div>
  )
}
