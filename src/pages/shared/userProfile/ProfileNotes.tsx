import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

import classNames from 'classnames'
import { format } from 'date-fns'
import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'

import { HtInputHelpText } from '../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { type IUserInternalNote, type IUser } from '../../../interfaces/User'

export const ProfileNotes = ({
  formUser,
  setFormUser,
  role,
  updateUser,
}: {
  formUser: IUser
  setFormUser: Dispatch<SetStateAction<IUser>>
  role: string
  updateUser: () => void
}) => {
  const [notes, setNotes] = useState<IUserInternalNote[]>(formUser.internal_notes || [])
  const [newNote, setNewNote] = useState('')

  console.log('formUser.internal_notes', formUser.internal_notes)
  console.log('notes', notes)
  console.log('newNote', newNote)

  useEffect(() => {
    setFormUser(prevFormUser => ({
      ...prevFormUser,
      internal_notes: notes,
    }))
  }, [notes, setFormUser])

  const handleAddNote = () => {
    const noteObject = { note: newNote, createdBy: 'Admin', createdAt: new Date() }
    const updatedNotes = [...notes, noteObject]
    setNotes(updatedNotes)
    // setFormUser(prevFormUser => ({
    //   ...prevFormUser,
    //   internal_notes: updatedNotes,
    // }))
    // setNewNote('')
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-5 border-b border-gray-900/10 pb-12 md:grid-cols-3 md:gap-y-10">
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
                      if (
                        singleNote != null &&
                        singleNote.note != null &&
                        singleNote.createdBy != null &&
                        singleNote.createdAt != null &&
                        singleNote._id != null
                      ) {
                        return (
                          <tr key={singleNote._id}>
                            <td
                              className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                              style={{ wordWrap: 'break-word', maxWidth: '250px' }}>
                              {singleNote.note}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500">{singleNote.createdBy}</td>
                            <td className="px-3 py-4 text-sm text-gray-500">
                              {singleNote.createdAt ? format(singleNote.createdAt, 'Pp') : null}
                            </td>
                          </tr>
                        )
                      }
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-2xl md:col-span-2">
        <HtInputLabel htmlFor="internal_notes" labelText="Note:" />
        <div>
          <InputTextarea
            id="internal_notes"
            rows={4}
            cols={30}
            maxLength={500}
            onChange={e => setNewNote(e.target.value)}
            className={classNames({ 'p-invalid': false }, 'mt-2')}
            autoComplete="off"
          />
          <Button onClick={handleAddNote} type="submit" label="+" disabled={role === 'employee'} />
          <Button onClick={updateUser} type="submit" label="Update" disabled={role === 'employee'} />
        </div>
        <HtInputHelpText
          fieldName="internal_notes"
          helpText="Max 500 characters. Please do not enter contact information into this field."
        />
      </div>
    </div>
  )
}
