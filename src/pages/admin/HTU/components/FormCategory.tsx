import { type ChangeEvent, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { XMarkIcon } from '@heroicons/react/20/solid'

import { type Category } from '../../../../interfaces/category'
import { type TagsInterface } from '../../../../interfaces/global'
import { RequestService } from '../../../../services/RequestService'
import { getModifiedProperties } from '../../../../utils/functionUtils'
import { TagsArray } from './TagsArray'

interface Props {
  action: 'add' | 'edit'
  category?: Category
}

export const FormCategory = ({ action, category }: Props) => {
  const [title, setTitle] = useState<string>(category?.title || '')
  const [description, setDescription] = useState<string>(category?.description || '')
  const [image, setImage] = useState<File | null>(null)
  const [tags, setTags] = useState<TagsInterface[]>(category?.state_tags || [])
  const [imagePreview, setImagePreview] = useState<string | undefined>(category?.image || undefined)
  const navigate = useNavigate()

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0])
    }
    const file = event.target.files && event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(undefined)
    }
  }

  const handleUpload = async () => {
    if (!image && action === 'add') {
      console.error('No image selected')
      alert('No image selected')
      return
    }

    const formData = new FormData()

    if (action === 'edit') {
      const differences: Partial<Category> = getModifiedProperties(category, {
        title,
        description,
        state_tags: tags,
        image,
      })

      for (const key of Object.keys(differences)) {
        if (key === 'state_tags') {
          formData.append('state_tags', JSON.stringify(tags))
        } else if (key === 'image') {
          formData.append('image', image as File)
        } else {
          formData.append(key, String(differences[key as keyof Category]))
        }
      }
    } else {
      formData.append('image', image as File)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('state_tags', JSON.stringify(tags))
    }

    try {
      const url = action === 'add' ? `categories` : `categories/${category?._id}`
      const method = action === 'add' ? 'POST' : 'PATCH'
      const response = await RequestService(url, method, formData, 'form-data')

      if (response) {
        navigate('/admin/learn/categories')
      } else {
        console.error('Error uploading data and image')
        alert('Error Details, Coming soon')
      }
    } catch (error) {
      console.error('Request error:', error)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(undefined)
  }

  return (
    <form>
      <div className="space-y-12">
        <div className=" pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="title">
                Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md">
                  <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    id="title"
                    name="title"
                    onChange={e => setTitle(e.target.value)}
                    placeholder="category title"
                    type="text"
                    value={title}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="description">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  id="description"
                  name="description"
                  onChange={e => setDescription(e.target.value)}
                  placeholder="category description"
                  rows={3}
                  value={description}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label className="mb-3 block text-sm font-medium leading-6 text-gray-900" htmlFor="cover-photo">
                categoy photo
              </label>
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    alt="Preview"
                    className="max-w-52 rounded-xl object-cover object-center shadow-xl"
                    src={imagePreview}
                  />
                  <button
                    className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-red-500 p-1 text-white transition-colors duration-300 hover:bg-white hover:text-red-500"
                    onClick={handleRemoveImage}
                    type="button">
                    <XMarkIcon className=" h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <div className="relative w-10/12">
                    <input
                      id="file-upload"
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      onChange={handleImageChange}
                    />
                    <div className="flex items-center justify-start rounded-lg border border-gray-300 bg-white shadow-sm">
                      <button
                        type="button"
                        className="hover:bg-primary-dark rounded-lg bg-primary px-4 py-2 text-white">
                        Choose file
                      </button>
                      <span className="pl-2 text-gray-500">No file chosen</span>
                    </div>

                    <label id="file-accept" htmlFor="file-upload" className="text-gray-400">
                      .PNG or .JPG
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-full">
              <TagsArray optional setTags={setTags} tags={tags} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => {
            navigate('/admin/learn/categories')
          }}
          type="button">
          Cancel
        </button>
        <button
          className={`${title === '' || description === '' || imagePreview === undefined ? 'bg-zinc-300' : 'bg-green-600 hover:bg-green-500 '} rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
          onClick={handleUpload}
          disabled={title === '' || description === '' || imagePreview === undefined}
          type="button">
          {action === 'add' ? 'Create' : 'Update'}
        </button>
      </div>
    </form>
  )
}
