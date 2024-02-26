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
import { Toast } from 'primereact/toast'
import { useAuth } from '../../../contexts/AuthContext'
import { GetTokenInfo } from '../../../utils/TokenUtils'

export default function Step2({ step, setStep }: StepProps) {
  const { facilitiesArray, setFacilitiesArray, setEditingIndex } = useContext(FormDataContext)
  const [uploading, setUploading] = useState(false)

  const { user } = useAuth()
  console.log('facilitiesArray: ', facilitiesArray)

  const [file, setFile] = useState<any>([])
  // console.log('file: ', file)

  const toast = useRef<Toast>(null)
  const fileUploadRef = useRef<FileUpload>(null)
  console.log('fileUploadRef: ', fileUploadRef.current?.props)

  const [uploadedFiles, setUploadedFiles] = useState([])
  // console.log('uploadedFiles: ', uploadedFiles)

  function setHeaders(event: FileUploadBeforeSendEvent) {
    const { access_token } = GetTokenInfo()
    event.xhr.setRequestHeader('Authorization', `Bearer ${access_token}`)
  }

  function uploadComplete(event: FileUploadUploadEvent) {
    const response = event.xhr.response
    const files = JSON.parse(response)
    setUploadedFiles(files)
  }

  function uploadError(req: FileUploadErrorEvent) {
    const errMsg = req?.xhr?.response || 'Unable to upload file'
    console.log('errMsg: ', errMsg)
  }

  // useEffect(() => {
  //   const getFacility = async () => {
  //     try {
  //       const facilityFound = await RequestService(`facilities/${facilityId}`)
  //       setFacility(facilityFound)
  //     } catch (error) {
  //       console.error('Error fetching facility data:', error)
  //     }
  //   }
  //   getFacility()
  // }, [facilityId])

  // const customUploadHandler = (event: FileUploadHandlerEvent) => {
  //   const files = event.files
  //   const documentType = fileUploadRef.current?.props.id as string
  //   const facilityIndex = 0 // Example: find the index based on facilityId or other criteria

  //   files.forEach(file => {
  //     setFacilitiesArray(prevState =>
  //       prevState.map((facility, index) => {
  //         if (index !== facilityIndex) {
  //           return facility
  //         }

  //         return {
  //           ...facility,
  //           [documentType]: {
  //             key: file.name,
  //             url: URL.createObjectURL(file),
  //             timestamp: new Date().toISOString(),
  //             createdBy: user._id,
  //           },
  //         }
  //       }),
  //     )
  //   })

  //   // Signal the upload completion to the FileUpload component
  //   event.options.props.onUpload() // Assuming `onUpload` is accessible through `event.options`
  // }

  // const beforeSendHandler = (event: FileUploadBeforeSendEvent) => {
  //   const { access_token } = GetTokenInfo()

  //   event.xhr.setRequestHeader('Authorization', `Bearer ${access_token}`)
  // }

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  // console.log('selectedFiles: ', selectedFiles)

  // const handleSelect = (e: FileUploadSelectEvent) => {
  //   // Update component state or UI
  //   setSelectedFiles(e.files)
  // }

  const handleSelect = async (event: FileUploadSelectEvent) => {
    const files = event.files
    console.log('files: ', files)

    const documentType = fileUploadRef.current?.props.id as string
    console.log('documentType: ', documentType)
    const facilityIndex = 0 // Replace with the actual index or use the facilityId to find the index

    for (const file of files) {
      setFacilitiesArray(prevState =>
        prevState.map((facility, index) => {
          if (index !== facilityIndex) {
            console.log('returned early')
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

    console.log('handleSelect invoked')
  }

  const onUploadToast = () => {
    toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' })
  }

  return (
    <div>
      <Toast ref={toast}></Toast>
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
                {/* <FileUpload
                  ref={fileUploadRef}
                  // id="stateLicenseDocument"
                  url="/api/upload"
                  mode="basic"
                  accept="image/*"
                  maxFileSize={1000000}
                  // onBeforeUpload={}
                  // onSelect={beforeUploadHandler}
                  // onBeforeSend={beforeSendHandler}
                  // uploadHandler={handleImagesUpload}
                  customUpload
                  uploadHandler={beforeUploadHandler}
                  // onUpload={onUploadToast}
                /> */}
                {/* <FileUpload
                  ref={fileUploadRef}
                  id="stateLicenseDocument"
                  name="files"
                  // url={'/api/upload'}
                  multiple
                  accept="image/*"
                  maxFileSize={1000000}
                  customUpload
                  uploadHandler={customUploadHandler}
                  // onSelect={beforeUploadHandler}
                  // onUpload={}
                  emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                /> */}
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

      <ul role="list" className="divide-y divide-gray-100">
        {/* {facilitiesArray?.map(({ license }: 
          { license: { key: string; url: string; timestamp: string; createdBy: string } }
        ) => (
          <li key={license._id} className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <a href={license.url} target="_blank" className="hidden px-5 py-1.5 text-sm font-semibold sm:block">
                  <p className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-500">{license.key}</p>
                </a>
                <p
                  className={classNames(
                    statuses['Complete'],
                    'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                  )}>
                  Approved
                </p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p className="whitespace-nowrap">
                  Uploaded on <time dateTime={license.timestamp}>{license.timestamp}</time>
                </p>
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <p className="truncate">Created by {license.createdBy}</p>
              </div>
            </div> */}
        {/* <div className="flex flex-none items-center gap-x-4 disabled">
              <a
                href="#"
                target="_blank"
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block">
                Delete
              </a>
            </div> */}
        {/* </li> */}
        {/* ))} */}
      </ul>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button
          severity="secondary"
          label="Back"
          outlined
          onClick={() => {
            setStep(step - 1)
            setEditingIndex(facilitiesArray.length - 1)
          }}
        />
        <Button label="Save" onClick={() => setStep(step + 1)} />
      </div>
    </div>
  )
}
