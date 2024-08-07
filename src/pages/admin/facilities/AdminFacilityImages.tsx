import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Badge } from 'primereact/badge'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
import { type FileUploadHandlerEvent } from 'primereact/fileupload'
import { Image } from 'primereact/image'

import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { SubHeader } from '../../../components/shared/SubHeader'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { HtFileUpload } from '../../../components/shared/general/HtFileUpload'
import { type IFacilityFile, type IFacility } from '../../../interfaces/facility'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { roleChecker } from '../../../utils/roleChecker'
import { clientFacilitiesLink } from '../../client/facilities/clientSubHeaderLinks'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

export const AdminFacilityImages = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [facility, setFacility] = useState<IFacility>()
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const role = roleChecker()

  const cancelButtonRef = useRef(null)

  const selectedImage = useRef<IFacilityFile | null>(null)

  const { showToast } = useUtils()

  const handleDialogOpen = (file: IFacilityFile) => {
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
        const response = await requestService({ path: `facilities/${facilityId}` })
        if (!response.ok) throw new Error('Failed to fetch facility data')

        const facilityFound: IFacility = await response.json()

        setFacility(facilityFound)
      } catch (error) {
        console.error('Error fetching facility data:', error)
      }
    }
    getFacility()
  }, [facilityId])

  const handleImagesUpload = async (event: FileUploadHandlerEvent) => {
    setLoading(true)

    const files = event.files
    const formData = new FormData()

    for (const file of files) {
      formData.append('files', file)
    }

    try {
      const uploadFacilityImagesResponse = await requestService({
        path: `facilities/${facilityId}/images`,
        method: 'POST',
        body: formData,
        dataType: 'formData',
      })

      if (!uploadFacilityImagesResponse.ok) throw new Error('Failed to upload facility images')

      const facilityWithAddedImage: IFacility = await uploadFacilityImagesResponse.json()
      const images = facilityWithAddedImage.images ?? []

      if (images.length === 1) {
        const updateFacilityResponse = await requestService({
          path: `facilities/${facilityId}`,
          method: 'PATCH',
          body: JSON.stringify({
            ...images,
            main_image: images[0]?.url,
          }),
        })

        if (!updateFacilityResponse.ok) throw new Error('Failed to update facility')

        const facilityWithNewMainImage: IFacility = await updateFacilityResponse.json()

        setFacility(facilityWithNewMainImage)
      } else {
        setFacility(facilityWithAddedImage)
      }
      showToast({ severity: 'success', summary: 'Success', detail: 'Image uploaded successfully' })
    } catch (error) {
      console.error('Error uploading facility images:', error)
      showToast({ severity: 'error', summary: 'Error', detail: 'An error occurred while uploading the images' })
    } finally {
      if (event.options != null) {
        event.options.clear()
      }
      setLoading(false)
    }
  }

  const handleRemoveImage = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const accept = async () => {
      if (!selectedImage?.current) {
        showToast({ severity: 'error', summary: 'Error', detail: 'No image selected' })
        setOpenDialog(false)
        return
      }

      try {
        const body = {
          file_type: 'images',
          file_id: selectedImage?.current?._id,
          file_path: selectedImage?.current?.key,
        }

        const deleteFacilityFileResponse = await requestService({
          path: `facilities/${facilityId}/file`,
          method: 'DELETE',
          body: JSON.stringify(body),
        })

        if (!deleteFacilityFileResponse.ok) throw new Error('Failed to delete facility file')

        const updatedFacility: IFacility = await deleteFacilityFileResponse.json()

        setFacility(updatedFacility)

        const images = updatedFacility.images ?? []

        if (images.length > 0) {
          const newMainImage = images[0]
          const updateFacilityResponse = await requestService({
            path: `facilities/${facilityId}`,
            method: 'PATCH',
            body: JSON.stringify({
              ...updatedFacility,
              main_image: newMainImage.url,
            }),
          })
          if (!updateFacilityResponse.ok) throw new Error('Failed to update facility')
          const updatedFacilityWithNewMainImage: IFacility = await updateFacilityResponse.json()

          setFacility(updatedFacilityWithNewMainImage)
        } else if (images.length === 0) {
          const updateFacilityResponse = await requestService({
            path: `facilities/${facilityId}`,
            method: 'PATCH',
            body: JSON.stringify({ ...updatedFacility, main_image: '' }),
          })
          if (!updateFacilityResponse.ok) throw new Error('Failed to update facility')
          const updatedFacilityWithoutMainImage: IFacility = await updateFacilityResponse.json()

          setFacility(updatedFacilityWithoutMainImage)
        }
        showToast({ severity: 'warn', summary: 'Confirmed', detail: 'Image removed', life: 3000 })
      } catch (error) {
        console.error('Error deleting facility image:', error)
        showToast({ severity: 'error', summary: 'Error', detail: 'An error occurred while deleting the image' })
      }

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
  }

  const handleFacilityUpdateMainImage = async () => {
    if (!selectedImage?.current) {
      showToast({ severity: 'error', summary: 'Error', detail: 'No image selected' })
      setOpenDialog(false)
      return
    }

    try {
      const updatedFacilityResponse = await requestService({
        path: `facilities/${facilityId}`,
        method: 'PATCH',
        body: JSON.stringify({
          ...facility,
          main_image: selectedImage?.current?.url,
        }),
      })
      if (!updatedFacilityResponse.ok) throw new Error('Failed to update facility')
      const updatedFacility: IFacility = await updatedFacilityResponse.json()

      setFacility(updatedFacility)

      showToast({
        severity: 'success',
        summary: 'Main Image Updated',
        detail: 'The main image has been updated successfully',
        life: 3000,
      })
    } catch (error) {
      console.error('Error updating facility:', error)
      showToast({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while updating the main image',
        life: 3000,
      })
    } finally {
      setOpenDialog(false)
    }
  }

  const sortedImagesWithMainImageFirst = useMemo(() => {
    return facility?.images?.sort((a, b) => {
      if (a.url === facility.main_image) return -1
      if (b.url === facility.main_image) return 1
      return 0
    })
  }, [facility?.images, facility?.main_image])

  return (
    <div>
      {facility ? (
        <SubHeader data={facility} links={role === 'admin' ? adminFacilitiesLinks : clientFacilitiesLink} />
      ) : null}

      <div className="space-y-2">
        <HtInputLabel htmlFor="facility_images_upload" labelText="Upload Facility Images:" />
        <HtFileUpload
          inputId="facility_images_upload"
          path={`facilities/${facilityId}/images`}
          acceptMultipleFiles={true}
          mode="basic"
          customUpload
          uploadHandler={handleImagesUpload}
        />
      </div>
      {loading ? (
        <HTLoadingLogo />
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {sortedImagesWithMainImageFirst?.map(file => (
            <li key={file._id} className="relative transform transition-transform hover:scale-105 hover:shadow-xl">
              {facility?.main_image === file.url ? <Badge value="Main Image" className="absolute -m-2" /> : null}
              <div className="flex justify-center">
                <Image
                  src={file.url}
                  alt="facility"
                  onClick={() => handleDialogOpen(file)}
                  pt={{
                    image: {
                      className: 'aspect-[4/3] max-w-full object-cover rounded-lg cursor-pointer mx-auto',
                    },
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
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
                  <ConfirmPopup />
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
                      onClick={handleFacilityUpdateMainImage}
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
