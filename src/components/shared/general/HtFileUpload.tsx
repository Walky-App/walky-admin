import { useRef } from 'react'

import {
  FileUpload,
  type FileUploadHandlerEvent,
  type FileUploadBeforeSendEvent,
  type FileUploadErrorEvent,
  type FileUploadUploadEvent,
} from 'primereact/fileupload'

import { useUtils } from '../../../store/useUtils'
import { GetTokenInfo } from '../../../utils/tokenUtil'

interface IHtFileUploadProps {
  inputId: string
  path?: string
  fileTypes?: string
  acceptMultipleFiles?: boolean
  maxFileSize?: number
  mode?: 'basic' | 'advanced'
  emptyUploaderTemplate?: React.ReactNode
  disabled?: boolean
  onUploadSuccess?: () => void
  customUpload?: boolean
  uploadHandler?: (event: FileUploadHandlerEvent) => void
}

const defaultEmptyTemplate = (
  <p>
    Drag-and-drop or choose your{' '}
    <strong>
      <u>files</u>
    </strong>{' '}
    to upload. Maximum file size: 5MB
  </p>
)

export const HtFileUpload = ({
  inputId,
  path,
  fileTypes = 'application/pdf, image/*',
  acceptMultipleFiles = true,
  maxFileSize = 3145728,
  mode = 'advanced',
  emptyUploaderTemplate = defaultEmptyTemplate,
  disabled = false,
  onUploadSuccess,
  customUpload,
  uploadHandler,
}: IHtFileUploadProps) => {
  const fileUploadRef = useRef<FileUpload>(null)

  const { showToast } = useUtils()

  const handleBeforeSend = (event: FileUploadBeforeSendEvent) => {
    const { access_token } = GetTokenInfo()
    event.xhr.setRequestHeader('Authorization', `Bearer ${access_token}`)
  }

  const handleUploadSuccess = async (event: FileUploadUploadEvent, callback?: () => void) => {
    if (event.xhr.status >= 200 && event.xhr.status < 300) {
      try {
        showToast({
          severity: 'success',
          summary: 'File Uploaded',
          detail: `${event.files[0].name} has been uploaded successfully.`,
          life: 2000,
        })

        if (callback) {
          callback()
        }
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
    <FileUpload
      id={inputId}
      name="files"
      ref={fileUploadRef}
      maxFileSize={maxFileSize}
      accept={fileTypes}
      multiple={acceptMultipleFiles}
      mode={mode}
      auto={true}
      url={`${process.env.REACT_APP_PUBLIC_API}/${path}`}
      onBeforeSend={handleBeforeSend}
      onUpload={event => handleUploadSuccess(event, onUploadSuccess)}
      onError={event => handleUploadError(event, fileUploadRef)}
      customUpload={customUpload}
      uploadHandler={uploadHandler}
      emptyTemplate={emptyUploaderTemplate}
      disabled={disabled}
      previewWidth={200}
      pt={{ actions: { className: 'hidden' } }}
    />
  )
}
