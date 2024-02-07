import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from 'flowbite-react'
import { PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

import { RequestService } from '../../../services/RequestService'
import AdminFacilityHeaderInfo from './AdminFacilityHeader'

export default function AdminFacilityImages() {
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

    const response = await fetch(`${process.env.REACT_APP_PUBLIC_API}/facilities/${facilityId}/images`, {
      method: 'POST',
      body: formData,
    })

    const updatedFacility = await response.json()
    setFacility(updatedFacility)
    setFiles([])
    setUploading(false)
  }

  const pickImageHandler = () => {
    filesInputRef.current.click()
  }

  return (
    <div>
      <AdminFacilityHeaderInfo facility={facility} />
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
        <div className="flex items-center my-5">
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
      <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {facility?.images?.map((file: any) => (
          <li key={file.source} className="relative">
            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
              <img src={file.url} alt="" className="pointer-events-none object-cover h-80 group-hover:opacity-75" />
              <button type="button" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">View details for {file.title}</span>
              </button>
            </div>
            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{file.title}</p>
            <p className="pointer-events-none block text-sm font-medium text-gray-500">{file.size}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
