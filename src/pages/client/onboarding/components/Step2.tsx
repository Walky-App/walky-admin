import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { Button } from 'primereact/button'
import {
  FileUpload,
  type FileUploadBeforeSendEvent,
  type FileUploadErrorEvent,
  type FileUploadUploadEvent,
} from 'primereact/fileupload'
import { Image } from 'primereact/image'
import { Panel } from 'primereact/panel'
import { type ToastMessage } from 'primereact/toast'

import { type IToastParameters, type IToastData } from '../../../../interfaces/global'
import { RequestService } from '../../../../services/RequestService'
import { useUtils } from '../../../../store/useUtils'
import { GetTokenInfo } from '../../../../utils/TokenUtils'
import {
  FormDataContext,
  type IGetAcceptRecipient,
  type IFacilityFormInputs,
  type StepProps,
} from '../ClientOnboardingPage'

export const Step2 = ({ step, setStep }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [toastData, setToastData] = useState<IToastParameters | null>(null)
  const [requestLoading, setRequestLoading] = useState(false)
  const { facilitiesArray, setFacilitiesArray, setDocumentData, prevDocRecipient, setPrevDocRecipient } =
    useContext(FormDataContext)

  const facilityId = facilitiesArray[0]?._id
  const fileUploadRef = useRef<FileUpload>(null)

  const { setRemoveToastCallback, showToast } = useUtils()

  useEffect(() => {
    const docRecipient: IGetAcceptRecipient = {
      email: facilitiesArray[0]?.contacts[0].email,
      first_name: facilitiesArray[0]?.contacts[0].first_name,
      last_name: facilitiesArray[0]?.contacts[0].last_name,
      company_name: facilitiesArray[0]?.corp_name,
      company_number: facilitiesArray[0]?.phone_number,
      mobile: facilitiesArray[0]?.contacts[0].phone_number,
    }

    if (JSON.stringify(docRecipient) !== JSON.stringify(prevDocRecipient)) {
      setRequestLoading(true)
      const sendDocumentFromTemplate = async () => {
        const body = {
          name: 'HempTemps Client Agreement',
          type: 'sales',
          template_id: '5vy2kbjyevk8',
          email: docRecipient.email,
          first_name: docRecipient.first_name,
          last_name: docRecipient.last_name,
          company_name: docRecipient.company_name,
          company_number: docRecipient.company_number,
          mobile: docRecipient.mobile,
        }
        try {
          const response = await RequestService('getaccept', 'POST', body)
          if (response.error) {
            throw response.error
          } else {
            setDocumentData(response)
          }
        } catch (error) {
          console.error('Error sending document:', error)
        } finally {
          setRequestLoading(false)
        }
      }

      sendDocumentFromTemplate()

      setPrevDocRecipient(docRecipient)
    }
  }, [facilitiesArray, prevDocRecipient, setDocumentData, setPrevDocRecipient])

  const handleRemoveToast = useCallback(
    (toastData: ToastMessage | IToastData) => {
      let severity
      if ('message' in toastData) {
        severity = toastData.message.severity
      } else {
        severity = toastData.severity
      }

      if (severity === 'success') {
        setIsLoading(false)
        setStep(step + 1)
      }
    },
    [setStep, step],
  )

  useEffect(() => {
    setRemoveToastCallback(handleRemoveToast)
  }, [handleRemoveToast, setRemoveToastCallback])

  useEffect(() => {
    if (!requestLoading && toastData) {
      showToast(toastData)
      setToastData(null)
    }
  }, [requestLoading, toastData, showToast])

  const handleSaveButton = () => {
    setIsLoading(true)
    setToastData({
      severity: 'success',
      summary: 'Success',
      detail: 'Changes saved successfully.',
      life: 2000,
    })
  }

  const handleBeforeSend = (event: FileUploadBeforeSendEvent) => {
    const { access_token } = GetTokenInfo()
    event.xhr.setRequestHeader('Authorization', `Bearer ${access_token}`)
  }

  const handleUploadSuccess = (event: FileUploadUploadEvent) => {
    if (event.xhr.status === 200) {
      const data: IFacilityFormInputs = JSON.parse(event.xhr.response)

      showToast({
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

    showToast({
      severity: 'error',
      summary: 'Error',
      detail: `Error uploading ${event.files[0].name}`,
      life: 2000,
    })
  }

  return (
    <>
      <div className="space-y-12">
        {/* Business License Documents */}
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
              </div>
            ) : null}

            <div className="sm:col-span-6">
              <label htmlFor="stateLicenseDocument" className="block text-sm font-medium leading-6 text-gray-900">
                Upload Licenses:
              </label>
              <div className="mt-2">
                <FileUpload
                  id="stateLicenseDocument"
                  name="files"
                  ref={fileUploadRef}
                  maxFileSize={1000000}
                  accept="application/pdf, image/*"
                  multiple={true}
                  mode="advanced"
                  url={`${process.env.REACT_APP_PUBLIC_API}/facilities/${facilityId}/licenses`}
                  onBeforeSend={handleBeforeSend}
                  onUpload={handleUploadSuccess}
                  onError={handleUploadError}
                  emptyTemplate={
                    <p>
                      Drag and drop <u>State and/or City License</u> PDF files to upload. Max size: 1MB
                    </p>
                  }
                  previewWidth={200}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Facility Images */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Facility Images</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please upload your business license documents. Please make sure your upload is clear without any warped or
              blur portions and shows all relevant information.
            </p>
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
              <div className="mt-2">
                <FileUpload
                  id="facilityImages"
                  name="files"
                  ref={fileUploadRef}
                  maxFileSize={2000000}
                  accept="image/*"
                  multiple={true}
                  mode="advanced"
                  url={`${process.env.REACT_APP_PUBLIC_API}/facilities/${facilityId}/images`}
                  onBeforeSend={handleBeforeSend}
                  onUpload={handleUploadSuccess}
                  onError={handleUploadError}
                  emptyTemplate={
                    <p>
                      Drag and drop <u>Facility Image</u> files to upload. Max file size: 2MB
                    </p>
                  }
                  previewWidth={200}
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
