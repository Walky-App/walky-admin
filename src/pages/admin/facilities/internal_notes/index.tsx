import React from 'react'
import { useParams } from 'react-router-dom'
import { RequestService } from '../../../../services/RequestService'
import HeaderComponent from '../../../../components/shared/general/HeaderComponent'
import { useNavigate } from 'react-router-dom'

export default function AdminFacilityInternalNotes() {
  const { facilityId } = useParams()
  console.log('Facility ID:', facilityId)
  const [internalNotes, setInternalNotes] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const navigate = useNavigate()

  React.useEffect(() => {
    const getInternalNotes = async () => {
      try {
        const allInternalNotes = await RequestService(`facilities/${facilityId}/internal_notes`)
        console.log('allInternalNotes:', allInternalNotes)
        setInternalNotes(allInternalNotes)
      } catch (error) {
        console.error('Error fetching facility internal notes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getInternalNotes()
  }, [facilityId])


  return (
    <div className="">
      <HeaderComponent title={'Internal Notes'} />
      <button
        type="button"
        onClick={() => {
          navigate(`admin/facilities/${facilityId}/internal_notes/new`)
        }}
        className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        Add New Internal Note
      </button>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Title
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Role
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {internalNotes.map((singleNote : any) => (
                      <tr key={singleNote._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {singleNote.note}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{singleNote.createdBy}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit<span className="sr-only">,</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
