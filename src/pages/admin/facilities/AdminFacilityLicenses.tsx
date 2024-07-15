import { useState, useRef, useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'

import { PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

import { SubHeader } from '../../../components/shared/SubHeader'
import { type IFacility } from '../../../interfaces/facility'
import { RequestService } from '../../../services/RequestService'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { roleChecker } from '../../../utils/roleChecker'
import { clientFacilitiesLink } from '../../client/facilities/clientSubHeaderLinks'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

export const AdminFacilityLicenses = () => {
  const [facility, setFacility] = useState<IFacility>()
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<FileList | never[]>([])
  const { facilityId } = useParams()
  const role = roleChecker()

  const filesInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useUtils()

  useEffect(() => {
    const getFacility = async () => {
      try {
        const facilityFound = await RequestService(`facilities/${facilityId}`)
        setFacility(facilityFound)
      } catch (error) {
        console.error('Error fetching facility data:', error)
      }
    }
    getFacility()
  }, [facilityId])

  const pickedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files)
    }
  }

  const handleImagesUpload = async () => {
    setUploading(true)
    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append('files[]', file)
    })

    const updatedFacility = await RequestService(`facilities/${facilityId}/licenses`, 'POST', formData, 'binary')

    setFacility(updatedFacility)
    setFiles([])
    setUploading(false)
  }

  const pickImageHandler = () => {
    filesInputRef?.current?.click()
  }

  const handleDelete = async (fileKey: string, licenseId: string) => {
    const body = {
      file_type: 'licenses',
      file_id: licenseId,
      file_path: fileKey,
    }
    try {
      const response = await requestService({
        path: `facilities/${facilityId}/file`,
        method: 'DELETE',
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const data = await response.json()
        setFacility(data)
        showToast({ severity: 'success', summary: 'Success', detail: 'File deleted successfully' })
      }
    } catch (error) {
      showToast({ severity: 'error', summary: 'Error', detail: 'An error occurred while deleting the file' })
    }
  }

  const handleLinkPathSplit = (link: string) => {
    const result = link.split('/')
    return result[result.length - 1]
  }

  return (
    <>
      {facility ? (
        <SubHeader data={facility} links={role === 'admin' ? adminFacilitiesLinks : clientFacilitiesLink} />
      ) : null}
      <input
        ref={filesInputRef}
        className="hidden"
        type="file"
        name="new-images"
        multiple
        id="new-images"
        onChange={pickedHandler}
      />

      {!uploading ? (
        <div className="my-5 flex items-center">
          {files.length === 0 ? (
            <Button className="relative inline-block rounded-full hover:cursor-pointer" onClick={pickImageHandler}>
              <PlusCircleIcon aria-hidden="true" />
            </Button>
          ) : (
            <button
              onClick={handleImagesUpload}
              type="button"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              Upload {files.length} files
              <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
      ) : (
        <ProgressSpinner aria-label="Loading" style={{ color: 'green' }} />
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Link
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Uploaded On
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Uploaded by
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Expires
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {facility?.licenses?.map(license => (
                  <tr key={license._id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">-</td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      <a
                        href={license.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline  hover:text-gray-600">
                        {handleLinkPathSplit(license.key)}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <time>{new Date(license.timestamp).toLocaleString()}</time>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{license.uploaded_by}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">-</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Button
                        label="Delete"
                        severity="secondary"
                        outlined
                        size="small"
                        onClick={() => handleDelete(license.key ?? '', license._id ?? '')}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
