import { type Dispatch, type SetStateAction, useRef } from 'react'

import {
  FileUpload,
  type FileUploadBeforeSendEvent,
  type FileUploadUploadEvent,
  type FileUploadErrorEvent,
} from 'primereact/fileupload'
import { Panel } from 'primereact/panel'

import { HtInputHelpText } from '../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { type IUserPopulated, type IUser } from '../../../interfaces/User'
import { useUtils } from '../../../store/useUtils'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export const ProfileDocuments = ({
  formUser,
  setFormUser,
}: {
  formUser: IUserPopulated
  setFormUser: Dispatch<SetStateAction<IUserPopulated>>
}) => {
  const fileUploadRef = useRef<FileUpload>(null)

  const userId = formUser?._id
  const { showToast } = useUtils()

  const handleBeforeSend = (event: FileUploadBeforeSendEvent) => {
    const { access_token } = GetTokenInfo()
    event.xhr.setRequestHeader('Authorization', `Bearer ${access_token}`)
  }

  const handleUploadSuccess = (event: FileUploadUploadEvent) => {
    if (event.xhr.status === 200) {
      const response: IUser = JSON.parse(event.xhr.response)

      showToast({
        severity: 'success',
        summary: 'File Uploaded',
        detail: `${event.files[0].name} has been uploaded successfully.`,
        life: 2000,
      })
      setFormUser({ ...formUser, documents: response.documents })
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

  const documents = formUser?.documents ?? []
  const documentsLength = documents.length

  return (
    <div className="my-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold leading-7">Badges and Credentials</h2>
          <div className="text-balance text-sm leading-6 [&>p]:mt-4">
            <p>Please upload your State-issued Badge or Background Check.</p>
            <p>If you do not have a badge or a background check click on your state for more information:</p>
            <ul className="ml-1 space-y-2 [&>li]:mt-1 [&>li]:text-balance [&>li]:text-sm [&>li]:leading-6 [&>li]:underline">
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
          </div>
        </div>
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
          {documentsLength > 0 ? (
            <div className="sm:col-span-6">
              <Panel header="Uploaded Documents">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
                  {documents.map((document, index) => (
                    <a
                      target="_blank"
                      href={document.url}
                      key={index}
                      className="px-5 py-1.5 text-sm font-semibold leading-6  underline hover:text-gray-500">
                      {document.key.split('/').pop()}
                    </a>
                  ))}
                </div>
              </Panel>
            </div>
          ) : null}

          <div className="sm:col-span-6">
            <HtInfoTooltip message="State issued badge or certifications can help in the hiring process.">
              <HtInputLabel htmlFor="documents" labelText="Upload Documents:" />
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
  )
}
