import { useEffect, useState } from 'react'

import { Editor, type EditorTextChangeEvent } from 'primereact/editor'

import { useAdmin } from '../../../../contexts/AdminContext'
import { type SectionProps, type Section, type Unit } from '../../../../interfaces/unit'
import { RequestService } from '../../../../services/RequestService'

export const SectionEditor = ({ setSection, selectedSection, deleteSelectedSection }: SectionProps) => {
  const { unit } = useAdmin()
  const [sectionLocal, setSectionLocal] = useState<string>('')
  const [title, setTitle] = useState<string>('')

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
    if (title === '' || sectionLocal === '') {
      alert('Please fill the section title and body')
      return
    }
    if (selectedSection) {
      const sectionUpdate: Section = {
        _id: selectedSection._id,
        title: title,
        body: sectionLocal,
        type: 'text',
      }
      const newSection: Unit = await dataSet(sectionUpdate, 'PATCH')
      setSection(newSection.sections)
      deleteSelectedSection()
    } else {
      const dataSection: Section = {
        title: title,
        body: sectionLocal,
        type: 'text',
      }
      const newSection: Unit = await dataSet(dataSection, 'POST')
      setSection(newSection.sections)
      deleteSelectedSection()
    }
    setTitle('')
    setSectionLocal('')
  }

  const handlerCancelEdit = () => {
    deleteSelectedSection()
    setTitle('')
    setSectionLocal('')
  }

  const renderHeader = () => {
    return (
      <>
        <select className="ql-header" />
        <select className="ql-font" />
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
        <span className="ql-formats">
          <button className="ql-link" type="button" />
        </span>
      </>
    )
  }

  const header = renderHeader()

  useEffect(() => {
    if (selectedSection) {
      setTitle(selectedSection.title)
      setSectionLocal(selectedSection.body)
    }
  }, [selectedSection])

  return (
    <>
      <div className="mt-2">
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
      <div className="mt-4">
        <div className="card">
          <Editor
            headerTemplate={header}
            onTextChange={(e: EditorTextChangeEvent) => setSectionLocal(e.htmlValue as string)}
            value={sectionLocal}
          />

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
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500"
              onClick={handlerSection}
              type="button">
              {selectedSection ? 'Edit' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
