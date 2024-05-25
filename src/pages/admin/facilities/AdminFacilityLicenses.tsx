/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useRef, useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { ProgressSpinner } from 'primereact/progressspinner'

import { PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

import { SubHeader } from '../../../components/shared/SubHeader'
import { type IFacilityFile, type IFacility } from '../../../interfaces/Facility'
import { RequestService } from '../../../services/RequestService'
import { cn } from '../../../utils/cn'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

const statuses = {
  Complete: 'text-green-700 bg-green-50 ring-green-600/20',
  'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}

export const AdminFacilityLicenses = () => {
  const [facility, setFacility] = useState<IFacility>()
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<any>([])
  const { facilityId } = useParams()

  const filesInputRef = useRef<any>()

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
    for (const file of files) {
      formData.append('files', file)
    }

    const updatedFacility = await RequestService(`facilities/${facilityId}/licenses`, 'POST', formData, 'binary')

    setFacility(updatedFacility)
    setFiles([])
    setUploading(false)
  }

  const pickImageHandler = () => {
    filesInputRef.current.click()
  }

  return (
    <>
      {facility ? <SubHeader data={facility} links={adminFacilitiesLinks} /> : null}
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
            <span className="relative inline-block rounded-full hover:cursor-pointer" onClick={pickImageHandler}>
              <PlusCircleIcon className="h-20 w-20 text-green-500 hover:text-green-400" aria-hidden="true" />
            </span>
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
      <ul className="divide-y divide-gray-100">
        {facility?.licenses?.map((license: IFacilityFile) => (
          <li key={license._id} className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <a href={license.url} target="_blank" className="hidden px-5 py-1.5 text-sm font-semibold sm:block">
                  <p className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-500">{license.key}</p>
                </a>
                <p
                  className={cn(
                    statuses['Complete'],
                    'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                  )}>
                  Approved
                </p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p className="whitespace-nowrap">
                  Uploaded on <time>{new Date(license.timestamp).toLocaleString()}</time>
                </p>

                {license.uploaded_by ? (
                  <>
                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <p className="truncate">Uploaded by {license.uploaded_by}</p>
                  </>
                ) : null}
              </div>
            </div>
            {/* <div className="disabled flex flex-none items-center gap-x-4">
              <a
                href="/"
                target="_blank"
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block">
                Delete
              </a>
            </div> */}
          </li>
        ))}
      </ul>
    </>
  )
}
