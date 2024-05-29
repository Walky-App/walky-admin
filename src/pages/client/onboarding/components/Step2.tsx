import { useContext, useRef, useState } from 'react'

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
import { useUtils } from '../../../../store/useUtils'
import { GetTokenInfo } from '../../../../utils/tokenUtil'
import { FormDataContext, type IFacilityFormInputs, type StepProps } from '../ClientOnboardingPage'

export const Step2 = ({ step, setStep }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { facilitiesArray, setFacilitiesArray } = useContext(FormDataContext)

  const facilityId = facilitiesArray[0]?._id
  const fileUploadRef = useRef<FileUpload>(null)

  const { showToast } = useUtils()

  const handleSaveButton = () => {
    setIsLoading(true)

    setTimeout(() => {
      setStep(step + 1)
    }, 1000)
  }

  const handleBeforeSend = (event: FileUploadBeforeSendEvent) => {
    const { access_token } = GetTokenInfo()
    event.xhr.setRequestHeader('Authorization', `Bearer ${access_token}`)
  }

  const handleUploadSuccess = (event: FileUploadUploadEvent) => {
    if (event.xhr.status === 200) {
      const data: IFacilityFormInputs = JSON.parse(event.xhr.response)

      showToast({
        severity: 'success',
        summary: 'File Uploaded',
        detail: `${event.files[0].name} has been uploaded successfully.`,
        life: 2000,
      })

      setFacilitiesArray(prevState =>
        prevState.map((facility, index) => {
          if (index !== 0) {
            return facility
          }

          return data
        }),
      )
    } else {
      console.error('Error status:', event.xhr.status)
      console.error('Error status text:', event.xhr.statusText)
      console.error('Error response text:', event.xhr.responseText)
    }
  }

  const handleUploadError = (event: FileUploadErrorEvent) => {
    console.error('Error uploading file:', event.files[0].name)

    showToast({
      severity: 'error',
      summary: 'Error',
      detail: `Error uploading ${event.files[0].name}`,
      life: 2000,
    })
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
            {facilitiesArray[0]?.licenses.length > 0 ? (
              <div className="sm:col-span-6">
                <Panel header="Uploaded Documents">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
                    {facilitiesArray[0]?.licenses.map((license, index) => (
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
                  ref={fileUploadRef}
                  maxFileSize={5242880}
                  accept="application/pdf, image/*"
                  multiple={true}
                  mode="advanced"
                  auto={true}
                  url={`${process.env.REACT_APP_PUBLIC_API}/facilities/${facilityId}/licenses`}
                  onBeforeSend={handleBeforeSend}
                  onUpload={handleUploadSuccess}
                  onError={handleUploadError}
                  emptyTemplate={
                    <p>
                      Drag-and-drop or choose your <u>State and/or City License</u> PDF files to upload. Maximum file
                      size: 5MB
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
            <h3 className="mt-4 text-sm leading-6 text-gray-600">Please upload images of:</h3>
            <ul className="mt-3 space-y-2 [&>li]:text-balance">
              <li className="mt-1 text-sm leading-6 text-gray-600">
                Interior of the facility, showcasing the layout, equipment, and safety features.
              </li>
              <li className="mt-1 text-sm leading-6 text-gray-600">
                Exterior of the facility, including the entrance door temps will use to enter.
              </li>
            </ul>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            {facilitiesArray[0]?.images.length > 0 ? (
              <div className="sm:col-span-6">
                <Panel header="Uploaded Images">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
                    {facilitiesArray[0]?.images.map(image => {
                      const fileName = image.key.split('/').pop()
                      return (
                        <div
                          key={image.timestamp}
                          className="flex w-full flex-col items-center justify-center sm:w-auto">
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
              <label htmlFor="facilityImages" className="block text-sm font-medium leading-6 text-gray-900">
                Upload Images:
              </label>
              <HtInfoTooltip message="Images should showcase the layout, equipment, and safety features of the facility.">
                <HtInputLabel htmlFor="facilityImages" labelText="Upload Images:" />
              </HtInfoTooltip>
              <div className="mt-2">
                <FileUpload
                  id="facilityImages"
                  name="files"
                  ref={fileUploadRef}
                  maxFileSize={5242880}
                  accept="image/*"
                  multiple={true}
                  mode="advanced"
                  auto={true}
                  url={`${process.env.REACT_APP_PUBLIC_API}/facilities/${facilityId}/images`}
                  onBeforeSend={handleBeforeSend}
                  onUpload={handleUploadSuccess}
                  onError={handleUploadError}
                  emptyTemplate={
                    <p>
                      Drag-and-drop or choose your <u> Facility</u> image files to upload. Maximum file size: 5MB
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
          label={facilitiesArray[0]?.licenses.length || facilitiesArray[0]?.images.length ? 'Save' : 'Skip for now'}
          onClick={handleSaveButton}
          loading={isLoading}
        />
      </div>
    </>
  )
}
