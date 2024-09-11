import { type ChangeEvent, useEffect, useState } from 'react'

import { Editor, type EditorTextChangeEvent } from 'primereact/editor'

import { XMarkIcon } from '@heroicons/react/24/outline'

import { useAdmin } from '../../../../contexts/AdminContext'
import { type Section, type SectionProps, type Unit } from '../../../../interfaces/unit'
import { RequestService } from '../../../../services/RequestService'

export const SectionImage = ({ setSection, selectedSection, deleteSelectedSection }: SectionProps) => {
  const { unit } = useAdmin()
  const [title, setTitle] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [text, setText] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined)

  const renderHeader = () => {
    return (
      <>
        <select className="ql-header" />
        <span className="ql-formats">
          <button aria-label="Bold" className="ql-bold" type="button" />
          <button aria-label="Italic" className="ql-italic" type="button" />
          <button aria-label="Underline" className="ql-underline" type="button" />
        </span>
        <span className="ql-formats">
          <select className="ql-color" />
          <button className="ql-list" type="button" value="ordered" />
          <button className="ql-list" type="button" value="bullet" />
          <select className="ql-align" />
        </span>
      </>
    )
  }

  const header = renderHeader()

  const dataSet = async (section: Section, method: string): Promise<Unit> => {
    const body = {
      unitId: unit?._id,
      section,
    }
    try {
      const responseModule: Unit = await RequestService(`units/section`, method, body)
      if (responseModule) {
        return responseModule
      }
    } catch (error) {
      console.error('Request error:', error)
    }
    return {} as Unit
  }

  const handlerSection = async () => {
    if (title === '' || image === '' || text === '') {
      alert('Please fill the section title and image or body')
      return
    }
    const body: string = text + image
    if (selectedSection) {
      const sectionUpdate: Section = {
        _id: selectedSection._id,
        title: title,
        body: body,
        type: 'image',
      }
      const newSection: Unit = await dataSet(sectionUpdate, 'PATCH')
      setSection(newSection.sections)
      deleteSelectedSection()
    } else {
      const dataSection: Section = {
        title: title,
        body: body,
        type: 'image',
      }
      const newSection: Unit = await dataSet(dataSection, 'POST')
      setSection(newSection.sections)
      deleteSelectedSection()
    }

    setTitle('')
    setImage('')
    setText('')
    setImagePreview(undefined)
  }

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0]

      const formData = new FormData()
      formData.append('image', image as File)

      try {
        const response = await RequestService(`units/section/image/${unit?._id}`, 'POST', formData, 'form-data')
        if (response) {
          setImage(
            `<div className='w-9/12 mt-2'> <img className='object-cover rounded-2xl' src="${response.fileUrl}" alt="${response.originalname}"/></div>`,
          )
        } else {
          console.error('Error uploading data and image')
          alert('Error Details, Coming soon')
        }
      } catch (error) {
        console.error('Request error:', error)
      }
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

  const handleRemoveImage = () => {
    setImagePreview(undefined)
  }

  const handlerCancelEdit = () => {
    deleteSelectedSection()
    setTitle('')
    setText('')
    setImage('')
    setImagePreview(undefined)
  }

  useEffect(() => {
    if (selectedSection) {
      const parts = selectedSection.body.split("<div className='w-9/12 mt-2'>")
      const regex = /src="([^"]*)"/
      const regexAlt = /alt="([^"]*)"/
      const match = parts[1].match(regex)
      const matchAlt = parts[1].match(regexAlt)
      const srcAttributeValue = match ? match[1] : null
      const altAttributeValue = matchAlt ? matchAlt[1] : null
      setTitle(selectedSection.title)
      setText(parts[0])
      setImage(
        `<div className='w-9/12 mt-2'> <img className='object-cover rounded-xl' src="${srcAttributeValue}" alt="${altAttributeValue}"/></div>`,
      )
      setImagePreview(srcAttributeValue as string)
    }
  }, [selectedSection])

  return (
    <>
      <div className="my-2">
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600">
          <input
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            id="section_title"
            name="section_title"
            onChange={e => setTitle(e.target.value)}
            placeholder="Section title"
            type="text"
            value={title}
          />
        </div>
      </div>
      <div className="card">
        <Editor
          headerTemplate={header}
          onTextChange={(e: EditorTextChangeEvent) => setText(e.htmlValue as string)}
          value={text}
        />
      </div>

      {imagePreview ? (
        <div className="relative mt-4 inline-block">
          <img alt="Preview" className="max-w-52 rounded-xl object-cover object-center shadow-xl" src={imagePreview} />
          <button
            className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-red-500 p-1 text-white transition-colors duration-300 hover:bg-white hover:text-red-500"
            onClick={handleRemoveImage}
            type="button">
            <XMarkIcon className="h-4 w-4" />
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
              <button type="button" className="hover:bg-primary-dark rounded-lg bg-primary px-4 py-2 text-white">
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
      <div className="mt-2 flex justify-end gap-2">
        {selectedSection ? (
          <button
            className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold leading-6 text-black"
            onClick={handlerCancelEdit}
            type="button">
            Cancel
          </button>
        ) : null}
        <button
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          onClick={handlerSection}
          type="button">
          {selectedSection ? 'Edit' : 'Add'}
        </button>
      </div>
    </>
  )
}
