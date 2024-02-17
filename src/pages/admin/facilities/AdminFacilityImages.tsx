import { Fragment, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Dialog, Transition } from '@headlessui/react'
import { Spinner } from 'flowbite-react'
import { PlusCircleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { RequestService } from '../../../services/RequestService'
import { SubHeader } from '../../../components/shared/SubHeader'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

export default function AdminFacilityImages() {
  const [facility, setFacility] = useState<any>({})
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<any>([])
  const filesInputRef = useRef<any>()

  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const cancelButtonRef = useRef(null)

  const selectedImage = useRef<any>(null)

  const handleDialogOpen = (file: any) => {
    selectedImage.current = file
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const { facilityId } = useParams()

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

    const updatedFacility = await RequestService(`facilities/${facilityId}/images`, 'POST', formData, 'binary')

    setFacility(updatedFacility)
    setFiles([])
    setUploading(false)
  }

  const pickImageHandler = () => {
    filesInputRef.current.click()
  }

  const handleRemoveImage = async () => {
    setOpenDialog(false)
    const body = {
      file_type: 'images',
      file_id: selectedImage.current._id,
      file_path: selectedImage.current.key,
    }

    const updatedFacility = await RequestService(`facilities/${facilityId}/file`, 'DELETE', body)

    setFacility(updatedFacility)
  }

  const handleFacilityUpdate = async () => {
    setOpenDialog(false)

    const updatedFacility = await RequestService(`facilities/${facilityId}`, 'PATCH', {
      ...facility,
      main_image: selectedImage.current.url,
    })

    setFacility(updatedFacility)
  }

  return (
    <div>
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
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {facility?.images?.map((file: any) => (
          <li key={file._id} className="relative">
            <div
              onClick={() => handleDialogOpen(file)}
              className="aspect-h-7 aspect-w-10 group block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
              <img src={file.url} alt="" className="pointer-events-none h-80 object-cover group-hover:opacity-75" />
              <button type="button" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">View details for {file.title}</span>
              </button>
            </div>
            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{file.title}</p>
            <p className="pointer-events-none block text-sm font-medium text-gray-500">{file.size}</p>
          </li>
        ))}
      </ul>
      <Transition.Root show={openDialog} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={handleDialogClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute right-0 top-0 hidden pb-4 pl-4 pr-1 pt-1 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      onClick={() => setOpenDialog(false)}>
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="aspect-h-7 aspect-w-10 group block w-full overflow-hidden rounded-lg bg-gray-100">
                    <img src={selectedImage.current?.url} alt="facility" className="h-full object-cover" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Facility Image
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius aliquam laudantium explicabo
                        pariatur iste dolorem animi vitae error totam. At sapiente aliquam accusamus facere veritatis.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:col-start-2"
                      onClick={handleFacilityUpdate}
                      ref={cancelButtonRef}>
                      Set as Default
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={handleRemoveImage}
                      ref={cancelButtonRef}>
                      Remove
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}
