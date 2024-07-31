import { useEffect, useState } from 'react'

import classNames from 'classnames'
import { format } from 'date-fns'
import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'

import { HtInputHelpText } from '../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'

export interface INote {
  _id: string
  note: string
  model: string
  ref_id: string
  created_by: IUser
  createdAt?: Date
}

interface INotesComponentProps {
  ref_id: string
  model: string
  created_by: string
}

export const NotesComponent = ({ ref_id, model, created_by }: INotesComponentProps) => {
  const [notes, setNotes] = useState<INote[]>([])
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await requestService({ path: `notes/${ref_id}` })
        if (response.ok) {
          const data = await response.json()
          setNotes(data)
        }
      } catch (error) {
        console.error('Error fetching notes:', error)
      }
    }
    fetchNotes()
  }, [ref_id])

  const handleAddNote = async () => {
    try {
      const noteObject = {
        note: newNote,
        model: model,
        ref_id: ref_id,
        created_by: created_by,
      }

      const response = await requestService({
        path: 'notes',
        method: 'POST',
        body: JSON.stringify(noteObject),
      })
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 border-b border-gray-900/10 pb-12 md:grid-cols-3 md:gap-y-10">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Add Internal Notes</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Previously added notes about this user.</p>
        </div>

        <div className="max-w-2xl md:col-span-2">
          <HtInputLabel htmlFor="internal_notes" labelText="Note:" />
          <div>
            <InputTextarea
              id="internal_notes"
              rows={4}
              cols={60}
              maxLength={500}
              onChange={e => setNewNote(e.target.value)}
              className={classNames({ 'p-invalid': false }, 'mt-2')}
              autoComplete="off"
            />
            <Button onClick={handleAddNote} type="submit" label="Add Note" />
          </div>
          <HtInputHelpText
            fieldName="internal_notes"
            helpText="Max 500 characters. Please do not enter contact information into this field."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 pb-12 md:grid-cols-3 md:gap-y-10">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Existing Notes</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Previously added notes about this user.</p>
        </div>
        <div className="md:col-span-2">
          {notes?.length === 0 ? (
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">No internal notes found</h2>
              <p className="mt-1 text-sm text-gray-500">Add a new note to the facility</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="flow-root">
                <div className="py-2 align-middle">
                  <table className="w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                          Note
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Created By
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {notes?.map(singleNote => {
                        return (
                          <tr key={singleNote._id}>
                            <td
                              className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                              style={{ wordWrap: 'break-word', maxWidth: '250px' }}>
                              {singleNote.note}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500">{singleNote.created_by.email}</td>
                            <td className="px-3 py-4 text-sm text-gray-500">
                              {singleNote.createdAt ? format(singleNote.createdAt, 'P') : null}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
