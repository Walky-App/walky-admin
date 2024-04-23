/* eslint-disable @typescript-eslint/prefer-for-of */

/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useRef, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Spinner } from 'flowbite-react'
import { Badge } from 'primereact/badge'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
import { Image } from 'primereact/image'

import { Dialog, Transition } from '@headlessui/react'
import { PlusCircleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'

import { SubHeader } from '../../../components/shared/SubHeader'
import { RequestService } from '../../../services/RequestService'
import { useUtils } from '../../../store/useUtils'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

export const AdminFacilityImages = () => {
  const [facility, setFacility] = useState<any>({})
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<any>([])
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const filesInputRef = useRef<any>()
  const cancelButtonRef = useRef(null)

  const selectedImage = useRef<any>(null)

  const { showToast } = useUtils()

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

  const handleRemoveImage = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const accept = async () => {
      const updatedFacility = await RequestService(`facilities/${facilityId}/file`, 'DELETE', body)

      setFacility(updatedFacility)

      showToast({ severity: 'warn', summary: 'Confirmed', detail: 'Image removed', life: 3000 })
      setOpenDialog(false)
    }

    confirmPopup({
      target: event.currentTarget,
      message: 'Do you want to delete this image?',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept,
    })
    const body = {
      file_type: 'images',
      file_id: selectedImage.current._id,
      file_path: selectedImage.current.key,
    }
  }

  const handleFacilityUpdate = async () => {
    setOpenDialog(false)

    const updatedFacility = await RequestService(`facilities/${facilityId}`, 'PATCH', {
      ...facility,
      main_image: selectedImage.current.url,
    })

    setFacility(updatedFacility)

    showToast({
      severity: 'success',
      summary: 'Main Image Updated',
      detail: 'The main image has been updated successfully',
      life: 3000,
    })
  }

  return (
    <div>
      <ConfirmPopup />
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
        <Spinner color="success" size="lg" aria-label="Success spinner example" />
      )}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {facility?.images?.map((file: any) => (
          <li key={file._id} className="relative">
            {facility.main_image === file.url ? <Badge value="Main Image" className="absolute -m-2" /> : null}
            <div onClick={() => handleDialogOpen(file)} className="flex max-h-[300px] max-w-[400px]">
              <Image
                src={file.url}
                alt="facility"
                pt={{
                  image: { className: 'max-h-full max-w-full object-contain rounded-lg' },
                }}
              />
              <button type="button" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">View details for {file.title}</span>
              </button>
            </div>
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
                  <div className="mx-auto flex max-h-[300px] max-w-[400px]">
                    <Image
                      src={selectedImage.current?.url}
                      alt="facility"
                      preview
                      pt={{
                        image: { className: 'mx-auto max-h-full max-w-full object-contain rounded-lg' },
                      }}
                    />
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:col-start-2"
                      onClick={handleFacilityUpdate}
                      ref={cancelButtonRef}>
                      Set as Main Image
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
