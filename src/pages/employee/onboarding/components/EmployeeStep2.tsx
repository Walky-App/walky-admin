import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { Button } from 'primereact/button'
import {
  FileUpload,
  type FileUploadBeforeSendEvent,
  type FileUploadErrorEvent,
  type FileUploadUploadEvent,
} from 'primereact/fileupload'
import { Panel } from 'primereact/panel'
import { type ToastMessage } from 'primereact/toast'

import { type IToastData } from '../../../../interfaces/global'
import { type IUser } from '../../../../interfaces/user'
import { useUtils } from '../../../../store/useUtils'
import { GetTokenInfo } from '../../../../utils/TokenUtils'
import { FormDataContext, type StepProps } from '../EmployeeOnboardingPage'
import { EmployeeFinishOnboardingDialog } from './EmployeeFinishOnboardingDialog'

export const EmployeeStep2 = ({ step, setStep }: StepProps) => {
  const [visible, setVisible] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState(false)
  const { currentUser, setCurrentUser } = useContext(FormDataContext)

  const userId = currentUser?._id

  const fileUploadRef = useRef<FileUpload>(null)

  const { setRemoveToastCallback, showToast } = useUtils()

  const handleRemoveToast = useCallback((toastData: ToastMessage | IToastData) => {
    let severity
    if ('message' in toastData) {
      severity = toastData.message.severity
    } else {
      severity = toastData.severity
    }

    if (severity === 'success') {
      setIsLoading(false)

      setVisible(true)

      // This line is commented out to prevent the page from navigating to the next step
      // setStep(step + 1)
    }
  }, [])

  useEffect(() => {
    setRemoveToastCallback(handleRemoveToast)
  }, [handleRemoveToast, setRemoveToastCallback])

  const handleSaveButton = () => {
    setIsLoading(true)
    showToast({
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
      const response: IUser = JSON.parse(event.xhr.response)

      showToast({
        severity: 'info',
        summary: 'File Uploaded',
        detail: `${event.files[0].name} has been uploaded successfully.`,
        life: 2000,
      })

      setCurrentUser(response)
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

  const documents = currentUser?.documents ?? []
  const documentsLength = documents.length

  return (
    <>
      <EmployeeFinishOnboardingDialog visible={visible} setVisible={setVisible} />
      <div className="space-y-12">
        {/* User Documents */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business License Documents</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please upload your business license documents. Please make sure your upload is clear without any warped or
              blur portions and shows all relevant information.
            </p>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            {documentsLength > 0 ? (
              <div className="sm:col-span-6">
                <Panel header="Uploaded Documents">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
                    {documents.map((document, index) => (
                      <p
                        key={index}
                        className="cursor-default px-5 py-1.5 text-sm font-semibold leading-6 text-gray-900 hover:text-gray-500">
                        {document.key.split('/').pop()}
                      </p>
                    ))}
                  </div>
                </Panel>
              </div>
            ) : null}

            <div className="sm:col-span-6">
              <label htmlFor="stateLicenseDocument" className="block text-sm font-medium leading-6 text-gray-900">
                Upload Documents:
              </label>
              <div className="mt-2">
                <FileUpload
                  id="userDocument"
                  name="files"
                  ref={fileUploadRef}
                  maxFileSize={1000000}
                  accept="application/pdf, image/*"
                  multiple={true}
                  mode="advanced"
                  url={`${process.env.REACT_APP_PUBLIC_API}/users/${userId}/documents`}
                  onBeforeSend={handleBeforeSend}
                  onUpload={handleUploadSuccess}
                  onError={handleUploadError}
                  emptyTemplate={
                    <p>
                      Drag and drop <u>Documents and/or prior certification</u> PDF or image files to upload. Max size:
                      1MB
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
        <Button label={documentsLength ? 'Save' : 'Skip for now'} onClick={handleSaveButton} loading={isLoading} />
      </div>
    </>
  )
}
