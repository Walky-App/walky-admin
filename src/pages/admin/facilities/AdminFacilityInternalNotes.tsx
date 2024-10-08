import { useState, useEffect, type FormEvent, useCallback } from 'react'

import { useParams } from 'react-router-dom'

import { CheckCircleIcon } from '@heroicons/react/20/solid'

import { SubHeader } from '../../../components/shared/SubHeader'
import { useAuth } from '../../../contexts/AuthContext'
import { type IUser } from '../../../interfaces/User'
import { type IFacility } from '../../../interfaces/facility'
import { RequestService } from '../../../services/RequestService'
import { roleChecker } from '../../../utils/roleChecker'
import { clientFacilitiesLink } from '../../client/facilities/clientSubHeaderLinks'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

export const AdminFacilityInternalNotes = () => {
  const { facilityId } = useParams()
  const [facility, setFacility] = useState<IFacility>()
  const [internalNotes, setInternalNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [userFound, setUserFound] = useState<IUser>()
  const role = roleChecker()

  const { user } = useAuth()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        //@ts-ignore
        const userFound = await RequestService(`users/${user._id}`)
        setUserFound(userFound)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [user])

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const facility = await RequestService(`facilities/${facilityId}`)
        setFacility(facility)
      } catch (error) {
        console.error('Error fetching facility:', error)
      }
    }
    fetchFacility()
  }, [facilityId])

  const fetchInternalNotes = useCallback(async () => {
    setIsLoading(true)
    try {
      const allInternalNotes = await RequestService(`facilities/${facilityId}/internal_notes`)
      setInternalNotes(allInternalNotes)
    } catch (error) {
      console.error('Error fetching facility internal notes:', error)
    } finally {
      setIsLoading(false)
    }
  }, [facilityId])

  useEffect(() => {
    fetchInternalNotes()
  }, [fetchInternalNotes])

  const handleAddInternalNote = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      note: { value: string }
      createdBy: { value: string }
    }
    const internalNote = {
      note: target.note.value,
      createdBy: userFound?.email,
    }
    try {
      await RequestService(`facilities/${facilityId}/internal_notes`, 'POST', internalNote)
      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 5000)
      fetchInternalNotes()
    } catch (error) {
      console.error('Error posting internal note:', error)
      setUpdateSuccess(false)
    }
  }

  return (
    <>
      {facility ? (
        <SubHeader data={facility} links={role === 'admin' ? adminFacilitiesLinks : clientFacilitiesLink} />
      ) : null}
      <div className="flex w-full flex-col items-center p-4">
        <form onSubmit={handleAddInternalNote} className="w-full">
          <div className="mb-4 max-w-md">
            <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
              Internal Note
            </label>
            <div className="mt-2">
              <textarea
                id="internal-notes"
                name="note"
                rows={3}
                className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="Write a note about the facility"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-x-6 sm:flex-row">
            {updateSuccess ? (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Note successfully added</p>
                  </div>
                </div>
              </div>
            ) : null}
            <button
              type="submit"
              className="mt-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:mt-0">
              Add Note
            </button>
          </div>
        </form>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-600" />
          </div>
        ) : internalNotes.length === 0 ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-gray-900">No internal notes found</h2>
              <p className="mt-1 text-sm text-gray-500">Add a new note to the facility</p>
            </div>
          </div>
        ) : (
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="mt-8 flow-root">
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
                    {internalNotes.map(
                      (singleNote: { _id: string; note: string; createdBy: string; createdAt: string }) => (
                        <tr key={singleNote._id}>
                          <td
                            className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                            style={{ wordWrap: 'break-word', maxWidth: '250px' }}>
                            {singleNote.note}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">{singleNote.createdBy}</td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {new Date(singleNote.createdAt).toLocaleDateString()}
                            {new Date(singleNote.createdAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
