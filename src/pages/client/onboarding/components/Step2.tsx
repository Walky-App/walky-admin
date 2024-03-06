import { useContext, useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import {
  FileUpload,
  FileUploadBeforeSendEvent,
  FileUploadErrorEvent,
  FileUploadUploadEvent,
} from 'primereact/fileupload'
import { Panel } from 'primereact/panel'
import { Toast, ToastMessage } from 'primereact/toast'

import { GetTokenInfo } from '../../../../utils/TokenUtils'
import { FormDataContext, IFacilityFormInputs, StepProps } from '../ClientOnboardingPage'

export const Step2 = ({ step, setStep }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showFileUploader, setShowFileUploader] = useState(false)
  const { facilitiesArray, setFacilitiesArray } = useContext(FormDataContext)

  const facilityId = facilitiesArray[0]?._id
  const toast = useRef<Toast>(null)

  useEffect(() => {
    setShowFileUploader(facilitiesArray[0]?.licenses.length < 2)
  }, [facilitiesArray])

  const showSavedToast = () => {
    setIsLoading(true)
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Changes saved successfully.',
      life: 2000,
    })
  }

  const onRemove = (toastData: ToastMessage) => {
    // @ts-expect-error toastRef.current may be null
    const severity = toastData.message ? toastData.message.severity : toastData.severity

    if (severity === 'success') {
      setStep(step + 1)
    }

    setIsLoading(false)
  }

  const fileUploadRef = useRef<FileUpload>(null)

  const handleBeforeSend = (event: FileUploadBeforeSendEvent) => {
    const { access_token } = GetTokenInfo()
    event.xhr.setRequestHeader('Authorization', `Bearer ${access_token}`)

    // Save this for document type handling in the backend:
    // const documentType = fileUploadRef.current?.props.id as string
    // const data = event.formData

    // data.set('documentType', documentType)

    // data.forEach((value, key) => {
    //   console.log('key: ', key)
    //   console.log('value: ', value)
    // })
  }

  const handleUpload = (event: FileUploadUploadEvent) => {
    if (event.xhr.status === 200) {
      const data: IFacilityFormInputs = JSON.parse(event.xhr.response)
      toast.current?.show({
        severity: 'info',
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
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: `Error uploading ${event.files[0].name}`,
      life: 2000,
    })
  }

  return (
    <div>
      <Toast ref={toast} onRemove={e => onRemove(e)} />
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business License Documents</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please upload your business license documents. Please make sure your upload is clear without any warped or
              blur portions and shows all relevant information.
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
                {!showFileUploader ? (
                  <Button
                    className="mt-3"
                    label="Upload more"
                    size="small"
                    onClick={() => setShowFileUploader(true)}
                    icon="pi pi-plus"
                  />
                ) : null}
              </div>
            ) : null}

            {showFileUploader ? (
              <>
                <div className="sm:col-span-6">
                  <label htmlFor="stateLicenseDocument" className="block text-sm font-medium leading-6 text-gray-900">
                    Upload State License:
                  </label>
                  <div className="mt-2">
                    <FileUpload
                      id="stateLicenseDocument"
                      name="files"
                      ref={fileUploadRef}
                      maxFileSize={1000000}
                      disabled={false}
                      accept="application/pdf"
                      multiple={false}
                      mode="advanced"
                      url={`${process.env.REACT_APP_PUBLIC_API}/facilities/${facilityId}/licenses`}
                      onBeforeSend={handleBeforeSend}
                      onUpload={handleUpload}
                      onError={handleUploadError}
                      emptyTemplate={
                        <p>
                          Drag and drop <u>State License</u> PDF files to upload. Max size: 1MB
                        </p>
                      }
                      previewWidth={200}
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="demo" className="block text-sm font-medium leading-6 text-gray-900">
                    Upload City License:
                  </label>
                  <div className="mt-2">
                    <FileUpload
                      id="cityLicenseDocument"
                      name="files"
                      ref={fileUploadRef}
                      maxFileSize={1000000}
                      disabled={false}
                      accept="application/pdf"
                      multiple={false}
                      mode="advanced"
                      url={`${process.env.REACT_APP_PUBLIC_API}/facilities/${facilityId}/licenses`}
                      onBeforeSend={handleBeforeSend}
                      onUpload={handleUpload}
                      onError={handleUploadError}
                      emptyTemplate={
                        <p>
                          Drag and drop <u>City License</u> PDF files to upload. Max size: 1MB
                        </p>
                      }
                    />
                  </div>
                </div>
              </>
            ) : null}
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
        <Button label={facilitiesArray[0]?.licenses.length ? "Save" : "Skip for now"} onClick={showSavedToast} loading={isLoading} />
      </div>
    </div>
  )
}
