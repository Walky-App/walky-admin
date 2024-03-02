import {
  FileUpload,
  FileUploadBeforeSendEvent,
  FileUploadErrorEvent,
  FileUploadSelectEvent,
  FileUploadUploadEvent,
} from 'primereact/fileupload'
import { FormDataContext, StepProps } from '.'
import { Button } from 'primereact/button'
import { useState, useRef, useContext } from 'react'
import { Toast, ToastMessage } from 'primereact/toast'
import { useAuth } from '../../../contexts/AuthContext'
import { GetTokenInfo } from '../../../utils/TokenUtils'

export const Step2 = ({ step, setStep }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const { setFacilitiesArray } = useContext(FormDataContext)

  const { user } = useAuth()

  const toast = useRef<Toast>(null)

  const showSavedToast = () => {
    setIsLoading(true)
    // @ts-ignore
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Changes saved successfully.',
      life: 2000,
    })
  }

  const onRemove = (toastData: ToastMessage) => {
    // @ts-ignore
    const severity = toastData.message ? toastData.message.severity : toastData.severity

    if (severity === 'success') {
      setStep(step + 1)
    }

    setIsLoading(false)
  }

  const fileUploadRef = useRef<FileUpload>(null)

  function setHeaders(event: FileUploadBeforeSendEvent) {
    const { access_token } = GetTokenInfo()
    event.xhr.setRequestHeader('Authorization', `Bearer ${access_token}`)
  }

  const handleSelect = async (event: FileUploadSelectEvent) => {
    const files = event.files

    const documentType = fileUploadRef.current?.props.id as string

    const facilityIndex = 0 // Replace with the actual index or use the facilityId to find the index

    for (const file of files) {
      setFacilitiesArray(prevState =>
        prevState.map((facility, index) => {
          if (index !== facilityIndex) {
            return facility
          }

          return {
            ...facility,
            [documentType]: {
              key: file.name,
              url: URL.createObjectURL(file),
              timestamp: new Date().toISOString(),
              createdBy: user?._id,
            },
          }
        }),
      )
    }
  }

  return (
    <div>
      <Toast ref={toast} onRemove={e => onRemove(e)}></Toast>
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
            <div className="sm:col-span-6">
              <label htmlFor="demo" className="block text-sm font-medium leading-6 text-gray-900">
                *Upload State License:
              </label>
              <div className="mt-2">
                <FileUpload
                  id="stateLicenseDocument"
                  name="file"
                  ref={fileUploadRef}
                  auto
                  maxFileSize={1000000}
                  accept="image/*"
                  multiple
                  mode="advanced"
                  // url={`facilities/${facilityId}/licenses`}
                  url={`facilities/licenses`}
                  onSelect={handleSelect}
                  onBeforeSend={setHeaders}
                  // onUpload={uploadComplete}
                  // onError={uploadError}
                  emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="demo" className="block text-sm font-medium leading-6 text-gray-900">
                *Upload City License:
              </label>
              <div className="mt-2">
                <FileUpload
                  // ref={fileUploadRef}
                  // id="cityLicenseDocument"
                  url="/api/upload"
                  mode="basic"
                  accept="image/*"
                  maxFileSize={1000000}
                  // onBeforeUpload={}
                  // onSelect={beforeUploadHandler}
                  // onBeforeSend={beforeSendHandler}
                  // uploadHandler={handleImagesUpload}
                  // customUpload
                  // uploadHandler={beforeUploadHandler}
                  // onUpload={onUploadToast}
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
        <Button label="Save" onClick={showSavedToast} loading={isLoading} />
      </div>
    </div>
  )
}
