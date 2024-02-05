import React from 'react'
import { useParams } from 'react-router-dom'
import { RequestService } from '../../../../services/RequestService'
import HeaderComponent from '../../../../components/shared/general/HeaderComponent'
import { useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/20/solid'

export default function AdminFacilityInternalNotes() {
  const { facilityId } = useParams()
  const [internalNotes, setInternalNotes] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [updateSuccess, setUpdateSuccess] = React.useState(false)

  const navigate = useNavigate()

  React.useEffect(() => {
    const getInternalNotes = async () => {
      try {
        const allInternalNotes = await RequestService(`facilities/${facilityId}/internal_notes`)
        setInternalNotes(allInternalNotes)
      } catch (error) {
        console.error('Error fetching facility internal notes:', error)
      } finally {
        setIsLoading(false)
      }
    }
    getInternalNotes()
  }, [facilityId])

  const handleAddInternalNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      note: { value: string }
      createdBy: { value: string }
    }
    const internalNote = {
      note: target.note.value,
      createdBy: target.createdBy.value,
    }
    RequestService(`facilities/${facilityId}/internal_notes`, 'POST', internalNote)
      .then(response => {
        if (response) {
          setUpdateSuccess(true)
          setTimeout(() => setUpdateSuccess(false), 5000)
        } else {
          throw new Error('Error showing success message.')
        }
      })
      .catch(error => {
        console.error('Error posting internal note:', error)
        setUpdateSuccess(false)
      })
  }

  return (
    <div className="w-full flex flex-col items-center p-4">
      <HeaderComponent title={'Internal Notes'} />
      <form onSubmit={handleAddInternalNote} className="w-full">
        <div className="mb-4 max-w-md">
          <label htmlFor="created-by" className="block text-sm font-medium leading-6 text-gray-900">
            Created By
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="createdBy"
              id="created-by"
              className="px-3 block w-full rounded-md border border-gray-300 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Enter creator's email"
            />
          </div>
        </div>
        <div className="mb-4 max-w-md">
          <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
            Note
          </label>
          <div className="mt-2">
            <textarea
              id="internal-notes"
              name="note"
              rows={3}
              className="px-3 block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Write notes about the facility"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-x-6">
          {updateSuccess && (
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
          )}
          <button
            type="submit"
            className="mt-4 sm:mt-0 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
            Add Note
          </button>
        </div>
      </form>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mt-8 flow-root">
            <div className="py-2 align-middle">
              <table className="w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
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
                  {internalNotes.map(singleNote => (
                    <tr key={singleNote._id}>
                      <td
                        className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                        style={{ wordWrap: 'break-word', maxWidth: '250px' }}>
                        {singleNote.note}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">{singleNote.createdBy}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {new Date(singleNote.createdAt).toLocaleDateString()}{' '}
                        {new Date(singleNote.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
