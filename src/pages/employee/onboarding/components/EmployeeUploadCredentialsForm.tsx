import { useContext, useRef, useState } from 'react'

import { Button } from 'primereact/button'
import {
  FileUpload,
  type FileUploadBeforeSendEvent,
  type FileUploadErrorEvent,
  type FileUploadUploadEvent,
} from 'primereact/fileupload'
import { Panel } from 'primereact/panel'

import { HtInputHelpText } from '../../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type IUser } from '../../../../interfaces/User'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { requiredFieldsNoticeText } from '../../../../utils/formUtils'
import { GetTokenInfo } from '../../../../utils/tokenUtil'
import { type IOnboardingUpdateInfo } from '../../../client/onboarding/clientOnboardingUtils'
import { FormDataContext, steps, type StepProps } from '../employeeOnboardingUtils'
import { EmployeeFinishOnboardingDialog } from './EmployeeFinishOnboardingDialog'

export const EmployeeUploadCredentialsForm = ({ step, setStep }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const { formData, setFormData } = useContext(FormDataContext)

  const fileUploadRef = useRef<FileUpload>(null)

  const { showToast } = useUtils()

  const updatedOnboardingInfo: IOnboardingUpdateInfo = {
    step_number: 3,
    description: steps[2].label ?? 'Upload Credentials',
    type: 'employee',
    completed: true,
  }

  const userId = formData?._id

  const handleSaveButton = async () => {
    setIsLoading(true)

    if (userId != null) {
      try {
        const response = await requestService({ path: `users/${userId}` })
        const responseData = await response.json()
        if (!response.ok) throw new Error(responseData.message)
        const userFound = responseData as IUser

        if (userFound != null) {
          const updatedUser: IUser = {
            ...userFound,
            ...formData,
          }

          const response = await requestService({
            path: `users/${userId}`,
            method: 'PATCH',
            body: JSON.stringify(updatedUser),
          })
          const responseData = await response.json()
          if (!response.ok) throw new Error(responseData.message)
          setFormData(updatedUser)
        }
      } catch (error) {
        console.error('Error updating user:', error)

        showToast({
          severity: 'error',
          summary: 'Error saving changes',
          detail: `Information could not be updated.`,
          life: 2000,
        })
        setIsLoading(false)
      }
    }

    setVisible(true)
  }

  const handleBeforeSend = (event: FileUploadBeforeSendEvent) => {
    const { access_token } = GetTokenInfo()
    event.xhr.setRequestHeader('Authorization', `Bearer ${access_token}`)
  }

  const handleUploadSuccess = (event: FileUploadUploadEvent) => {
    if (event.xhr.status === 200) {
      const responseData: IUser = JSON.parse(event.xhr.response)

      showToast({
        severity: 'success',
        summary: 'File Uploaded',
        detail: `${event.files[0].name} has been uploaded successfully.`,
        life: 2000,
      })

      setFormData(responseData)
    } else {
      console.error('Error status:', event.xhr.status)
      console.error('Error status text:', event.xhr.statusText)
      console.error('Error response text:', event.xhr.responseText)
    }
  }

  const handleUploadError = async (event: FileUploadErrorEvent, uploadRef: React.RefObject<FileUpload>) => {
    console.error('Error uploading file:', event.files[0].name)
    if (event.xhr != null && event.xhr.status >= 400) {
      console.error('Upload failed:', event.xhr.status, event.xhr.statusText, event.xhr.responseText)

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

  const documents = formData?.documents ?? []
  const documentsLength = documents.length

  return (
    <>
      <EmployeeFinishOnboardingDialog
        visible={visible}
        setVisible={setVisible}
        onboardingInfo={updatedOnboardingInfo}
      />
      <div className="space-y-12">
        {/* User Documents */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Badges and Credentials</h2>
            <div className="text-balance text-sm leading-6 text-gray-600 [&>p]:mt-4">
              <p>Please upload your State-issued Badge or Background Check.</p>
              <p>If you do not have a badge or a Credential click on your state for more information:</p>
              <ul className="ml-1 space-y-2 [&>li]:mt-1 [&>li]:text-balance [&>li]:text-sm [&>li]:leading-6 [&>li]:text-gray-600 [&>li]:underline">
                <li>
                  <a
                    href="https://sbg.colorado.gov/sites/sbg/files/documents/DR%208517e%20Emp%20App%2010-2022_0.pdf"
                    target="_blank"
                    className="hover:text-primary">
                    Colorado
                  </a>
                </li>
                <li>
                  <a href="https://omma.us.thentiacloud.net/webs/omma/" target="_blank" className="hover:text-primary">
                    Oklahoma
                  </a>
                </li>
                <li>
                  <a href="https://cbadge.com/states/michigan/" target="_blank" className="hover:text-primary">
                    Michigan
                  </a>
                </li>
              </ul>
              {requiredFieldsNoticeText}
            </div>
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
              <HtInfoTooltip message="State issued badge or certifications can help in the hiring process.">
                <HtInputLabel htmlFor="documents" asterisk labelText="Upload Documents:" />
              </HtInfoTooltip>
              <div className="mt-2">
                <FileUpload
                  id="documents"
                  name="files"
                  ref={fileUploadRef}
                  maxFileSize={5242880}
                  accept="application/pdf, image/*"
                  multiple={true}
                  mode="advanced"
                  auto={true}
                  url={`${process.env.REACT_APP_PUBLIC_API}/users/${userId}/documents`}
                  onBeforeSend={handleBeforeSend}
                  onUpload={handleUploadSuccess}
                  onError={event => handleUploadError(event, fileUploadRef)}
                  emptyTemplate={
                    <p>
                      Drag and drop <u>Documents and/or prior certifications</u> PDF files or images to upload. Maximum
                      file size: 5MB
                    </p>
                  }
                  previewWidth={200}
                />
                <HtInputHelpText
                  fieldName="documents"
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
          label="Save & Continue"
          onClick={handleSaveButton}
          disabled={documentsLength === 0}
          loading={isLoading}
        />
      </div>
    </>
  )
}
