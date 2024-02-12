import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import { FileInput } from 'flowbite-react'
import TagsArray from './components/TagsArray'
import { ChangeEvent, useState } from 'react'
import { TagsInterface } from '../../../interfaces/Global'
import { useAuth } from '../../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { RequestService } from '../../../services/RequestService'

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
        `${process.env.REACT_APP_PUBLIC_API}/categories`,
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
      <form>
        <div className="space-y-12">
          <div className=" pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  Title
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      onChange={e => setTitle(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                      placeholder="category title"
                    />
                  </div>
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
                    placeholder="category description"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                  categoy photo
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
            onClick={handleUpload}
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
