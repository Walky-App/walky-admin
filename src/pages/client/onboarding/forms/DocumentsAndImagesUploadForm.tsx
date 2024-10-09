import { useContext, useRef } from 'react'

import { Button } from 'primereact/button'
import {
  FileUpload,
  type FileUploadBeforeSendEvent,
  type FileUploadErrorEvent,
  type FileUploadUploadEvent,
} from 'primereact/fileupload'
import { Image } from 'primereact/image'
import { Panel } from 'primereact/panel'

import { HtInputHelpText } from '../../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type IFacility } from '../../../../interfaces/facility'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { GetTokenInfo } from '../../../../utils/tokenUtil'
// import { clientOnboardingSteps } from '../ClientOnboardingPage'
import {
  type StepProps,
  FormDataContext,
  type IClientOnboardingFormInputs,
  // useUpdateOnboardingStatus, // type IOnboardingUpdateInfo,
} from '../clientOnboardingUtils'

export const DocumentsAndImagesUploadForm = ({ step, setStep }: StepProps) => {
  const { formData, setFormData } = useContext(FormDataContext)

  const facilityId = formData?.facilities[0]
  const licenseUploadRef = useRef<FileUpload>(null)
  const imageUploadRef = useRef<FileUpload>(null)

  const { showToast } = useUtils()

  // const { updateOnboardingStatus, isLoading } = useUpdateOnboardingStatus()

  // const updateOnboardingInfo: IOnboardingUpdateInfo = {
  //   step_number: 3,
  //   description: clientOnboardingSteps[2].label ?? 'Documents and Images',
  //   type: 'client',
  //   completed: false,
  // }

  const handleSaveButton = async () => {
    // const success = await updateOnboardingStatus(updateOnboardingInfo)
    // if (success === true) {
    //   setStep(step + 1)
    // }
  }

  const handleBeforeSend = (event: FileUploadBeforeSendEvent) => {
    const { access_token } = GetTokenInfo()
    event.xhr.setRequestHeader('Authorization', `Bearer ${access_token}`)
  }

  const handleUploadSuccess = async (event: FileUploadUploadEvent) => {
    if (event.xhr.status >= 200 && event.xhr.status < 300) {
      try {
        const facilityData: IClientOnboardingFormInputs = JSON.parse(event.xhr.response)
        const firstImageUrl = facilityData.images?.[0]?.url
        const licensesUploaded = facilityData.licenses

        if (facilityId != null) {
          if (firstImageUrl != null) {
            const response = await requestService({
              path: `facilities/${facilityId}`,
              method: 'PATCH',
              body: JSON.stringify({ main_image: firstImageUrl }),
            })

            if (!response.ok) throw new Error('Failed to update facility.')

            const updatedFacility: IFacility = await response.json()
            setFormData(prev => ({
              ...prev,
              ...updatedFacility,
            }))
          } else if (licensesUploaded) {
            setFormData(prev => ({
              ...prev,
              ...facilityData,
            }))
          }
        }

        showToast({
          severity: 'success',
          summary: 'File Uploaded',
          detail: `${event.files[0].name} has been uploaded successfully.`,
          life: 2000,
        })
      } catch (error) {
        console.error('Error:', error)
        showToast({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred. Please try again.',
          life: 3000,
        })
      }
    } else {
      console.error('Upload failed:', event.xhr.status, event.xhr.statusText, event.xhr.responseText)
      showToast({
        severity: 'error',
        summary: 'Upload Failed',
        detail: 'Failed to upload file due to server error. Please try again.',
        life: 3000,
      })
    }
  }

  const handleUploadError = async (event: FileUploadErrorEvent, uploadRef: React.RefObject<FileUpload>) => {
    console.error('Error uploading file:', event.files[0].name)
    if (event.xhr != null && event.xhr.status >= 400) {
      console.error('HTTP Status:', event.xhr.status)
      console.error('Status Text:', event.xhr.statusText)
      console.error('Response Text:', event.xhr.responseText)

      let errorMessage = 'An error occurred while uploading the files.'
      try {
        const responseJson = JSON.parse(event.xhr.responseText)
        if (responseJson != null && responseJson.message != null) {
          errorMessage = responseJson.message
        }
      } catch (error) {
        console.error('Error parsing response:', error)
        errorMessage = 'An unexpected error occurred.'
      }

      try {
        await showToast({
          severity: 'error',
          summary: 'Error uploading files',
          detail: errorMessage,
          life: 3000,
        })
      } catch (error) {
        console.error('Error showing toast:', error)
      }

      if (uploadRef.current) {
        uploadRef.current.clear()
      }
    }
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-12">
        {/* Business License Documents */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business License Documents</h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Upload a copy of the facility's valid business license issued by the appropriate regulatory authority.
            </p>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            {formData?.licenses?.length ?? 0 > 0 ? (
              <div className="sm:col-span-6">
                <Panel header="Uploaded Documents">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
                    {formData?.licenses?.map((license, index) => (
                      <p
                        key={index}
                        className="cursor-default px-5 py-1.5 text-sm font-semibold leading-6 text-gray-900 hover:text-gray-500">
                        {license.key.split('/').pop()}
                      </p>
                    ))}
                  </div>
                </Panel>
              </div>
            ) : null}

            <div className="sm:col-span-6">
              <HtInfoTooltip message="A valid business license is crucial for verifying legitimacy.">
                <HtInputLabel htmlFor="stateLicenseDocument" labelText="Upload Licenses:" />
              </HtInfoTooltip>
              <div className="mt-2">
                <FileUpload
                  id="stateLicenseDocument"
                  name="files"
                  ref={licenseUploadRef}
                  maxFileSize={5242880}
                  accept="application/pdf, image/*"
                  multiple={true}
                  mode="advanced"
                  auto={true}
                  url={`${process.env.REACT_APP_PUBLIC_API}/facilities/${facilityId}/licenses`}
                  onBeforeSend={handleBeforeSend}
                  onUpload={handleUploadSuccess}
                  onError={event => handleUploadError(event, licenseUploadRef)}
                  emptyTemplate={
                    <p>
                      Drag-and-drop or choose your{' '}
                      <strong>
                        <u>State and/or City License</u>
                      </strong>{' '}
                      document image files to upload. Maximum file size: 5MB
                    </p>
                  }
                  previewWidth={200}
                  pt={{ actions: { className: 'hidden' } }}
                />
                <HtInputHelpText
                  fieldName="stateLicenseDocument"
                  helpText="Please make sure your upload is clear without any warped or blur portions and shows all relevant
                        information."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Facility Images */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Facility Images</h2>
            <h3 className="mt-4 text-sm leading-6 text-gray-600">Upload images of:</h3>
            <ul className="ml-1 space-y-2 [&>li]:text-balance">
              <li className="mt-1 text-sm leading-6 text-gray-600">
                <strong>Interior of the facility</strong>, showcasing the layout, equipment (e.g., fire extinguisher,
                first aid kit), and safety features (e.g., emergency exits).
              </li>
              <li className="mt-1 text-sm leading-6 text-gray-600">
                <strong>Exterior of the facility</strong>, including the entrance door temps will use to enter. Please
                ensure the building number is visible.
              </li>
            </ul>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            {formData?.images?.length ?? 0 > 0 ? (
              <div className="sm:col-span-6">
                <Panel header="Uploaded Images">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
                    {formData?.images?.map(image => {
                      const fileName = image.key.split('/').pop()
                      return (
                        <div key={image._id} className="flex w-full flex-col items-center justify-center sm:w-auto">
                          <Image src={image.url} alt={fileName} preview pt={{ image: { className: 'h-16 w-auto' } }} />
                          <p className="cursor-default px-5 py-1.5 text-sm font-semibold leading-6 text-gray-900 hover:text-gray-500">
                            {fileName}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </Panel>
              </div>
            ) : null}

            <div className="sm:col-span-6">
              <HtInfoTooltip message="Images should showcase the layout, equipment, and safety features of the facility.">
                <HtInputLabel htmlFor="facilityImages" labelText="Upload Images:" />
              </HtInfoTooltip>
              <div className="mt-2">
                <FileUpload
                  id="facilityImages"
                  name="files"
                  ref={imageUploadRef}
                  maxFileSize={5242880}
                  accept="image/*"
                  multiple={true}
                  mode="advanced"
                  auto={true}
                  url={`${process.env.REACT_APP_PUBLIC_API}/facilities/${facilityId}/images`}
                  onBeforeSend={handleBeforeSend}
                  onUpload={handleUploadSuccess}
                  onError={event => handleUploadError(event, imageUploadRef)}
                  emptyTemplate={
                    <p>
                      Drag-and-drop or choose your{' '}
                      <strong>
                        <u>Facility image</u>
                      </strong>{' '}
                      files to upload. Maximum file size: 5MB
                    </p>
                  }
                  previewWidth={200}
                  pt={{ actions: { className: 'hidden' } }}
                />
                <HtInputHelpText
                  fieldName="facilityImages"
                  helpText="Please make sure your upload is clear without any warped or blur portions and shows all relevant information."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button
          severity="secondary"
          label="Back"
          outlined
          onClick={() => {
            setStep(step - 1)
          }}
        />
        <Button
          label={formData?.licenses?.length || formData?.images?.length ? 'Save & Continue' : 'Skip for now'}
          onClick={handleSaveButton}
          // loading={isLoading}
        />
      </div>
    </>
  )
}
