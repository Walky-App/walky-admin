import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from 'flowbite-react'
import { PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import { RequestService } from '../../../services/RequestService'
import { classNames } from '../../../utils/Tailwind'
import { SubHeader } from '../../../components/shared/SubHeader'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

const statuses: any = {
  Complete: 'text-green-700 bg-green-50 ring-green-600/20',
  'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}

export default function AdminFacilityLicenses() {
  const [facility, setFacility] = React.useState<any>({})
  const [uploading, setUploading] = React.useState(false)
  const [files, setFiles] = React.useState<any>([])
  const { facilityId } = useParams()

  const filesInputRef = React.useRef<any>()

  React.useMemo(() => {
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

  const pickedHandler = (event: any) => {
    if (event.target.files.length > 0) {
      setFiles(event.target.files)
    }
  }

  const handleImagesUpload = async () => {
    setUploading(true)
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
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
      <SubHeader data={facility} links={adminFacilitiesLinks} />
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
            <>
              <span className="relative inline-block rounded-full hover:cursor-pointer" onClick={pickImageHandler}>
                <PlusCircleIcon className="h-20 w-20 text-green-500 hover:text-green-400" aria-hidden="true" />
              </span>
            </>
          ) : (
            <>
              <button
                onClick={handleImagesUpload}
                type="button"
                className="inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                Upload {files.length} files
                <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      ) : (
        <Spinner color="success" size="lg" aria-label="Success spinner example" />
      )}
      <ul role="list" className="divide-y divide-gray-100">
        {facility?.licenses?.map((license: any) => (
          <li key={license._id} className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <a href={license.url} target="_blank" className="hidden px-5 py-1.5 text-sm font-semibold sm:block">
                  <p className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-500">{license.key}</p>
                </a>
                <p
                  className={classNames(
                    statuses['Complete'],
                    'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                  )}>
                  Approved
                </p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p className="whitespace-nowrap">
                  Uploaded on <time dateTime={license.timestamp}>{license.timestamp}</time>
                </p>
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <p className="truncate">Created by {license.createdBy}</p>
              </div>
            </div>
            {/* <div className="flex flex-none items-center gap-x-4 disabled">
              <a
                href="#"
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
