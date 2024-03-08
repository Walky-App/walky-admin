import { useContext, useEffect, useRef, useState } from 'react'
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import {
  FileUpload,
  FileUploadBeforeSendEvent,
  FileUploadErrorEvent,
  FileUploadSelectEvent,
  FileUploadUploadEvent,
} from 'primereact/fileupload'
import { Image } from 'primereact/image'
import { InputMask } from 'primereact/inputmask'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'
import { Panel } from 'primereact/panel'
import { Toast, ToastMessage } from 'primereact/toast'
import { classNames } from 'primereact/utils'

import { RequestService } from '../../../../services/RequestService'
import { GetTokenInfo } from '../../../../utils/TokenUtils'
import {
  FormDataContext,
  getFormErrorMessage,
  IFacilityFormInputs,
  StepProps,
  tooltipOptions,
} from '../ClientOnboardingPage'
import { countries, states } from '../formOptions'

const services = ['Trimming', 'Harvesting', 'Packaging', 'Budtending', 'Gardening', 'General Labor', 'Other']

export const Step1 = ({ step, setStep }: StepProps) => {
  const [showFileUploader, setShowFileUploader] = useState(true)

  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const { setFormData, defaultValues, formData, facilitiesArray, setFacilitiesArray } = useContext(FormDataContext)

  const toast = useRef(null)
  const fileUploadRef = useRef<FileUpload>(null)
  console.log('fileUploadRef: ', fileUploadRef)
  const fileUploadUrlRef = useRef('')
  console.log('fileUploadUrlRef: ', fileUploadUrlRef)
  const uploadErrorRef = useRef(false)
  console.log('uploadErrorRef: ', uploadErrorRef)

  useEffect(() => {
    setShowFileUploader(facilitiesArray[0]?.images.length > 2 ? false : true)
  }, [facilitiesArray])

  const onRemoveToast = (toastData: ToastMessage) => {
    // @ts-expect-error toastRef.current may be null
    const severity = toastData.message ? toastData.message.severity : toastData.severity

    if (severity === 'success') {
      setStep(step + 1)
    }

    setIsLoading(false)
  }

  const values = formData || defaultValues

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<IFacilityFormInputs>({ values })

  const { fields } = useFieldArray({
    control,
    name: 'contacts',
  })

  const onSubmit: SubmitHandler<IFacilityFormInputs> = async data => {
    setFormData(data)
    setIsLoading(true)

    const existingFacilityId = facilitiesArray[0]?._id

    const uploadFiles = (facilityId: string): void => {
      if (selectedImages && selectedImages.length > 0) {
        fileUploadUrlRef.current = `${process.env.REACT_APP_PUBLIC_API}/facilities/${facilityId}/images`

        fileUploadRef.current?.upload()
      }
    }

    let facilityId

    if (existingFacilityId) {
      // Existing facility, PATCH operation
      try {
        const facilityFound = await RequestService(`facilities/${existingFacilityId}`)

        if (facilityFound) {
          const updatedFacility = {
            ...facilityFound,
            ...data,
            licenses: facilitiesArray[0].licenses,
            images: facilitiesArray[0].images,
          }

          const response = await RequestService(`facilities/${existingFacilityId}`, 'PATCH', updatedFacility)

          if (response?._id) {
            facilityId = response._id

            uploadFiles(facilityId)

            if (uploadErrorRef.current) {
              // @ts-expect-error toastRef.current may be null
              toast.current?.show({
                severity: 'success',
                summary: 'Changes saved for:',
                detail: getValues('name'),
              })
              setFacilitiesArray(prevArray =>
                prevArray.map(facility => (facility._id === response._id ? response : facility)),
              )
            }
          } else {
            throw new Error('Failed to update facility')
          }
        } else {
          throw new Error('Facility not found')
        }
      } catch (error) {
        console.error('Error updating facility:', error)
        // @ts-expect-error toastRef.current may be null
        toast.current?.show({
          severity: 'error',
          summary: 'Error saving changes',
          detail: `${getValues('name')} could not be updated.`,
        })
      }
    } else {
      // New facility, POST operation
      try {
        const response = await RequestService(`facilities`, 'POST', data)

        if (response?._id) {
          facilityId = response._id

          uploadFiles(facilityId)

          if (uploadErrorRef.current) {
            // @ts-expect-error toastRef.current may be null
            toast.current?.show({
              severity: 'success',
              summary: 'Success',
              detail: `${getValues('name')} created successfully.`,
              life: 2000,
            })
            setFacilitiesArray([response])
          }
        } else {
          throw new Error('Failed to add facility')
        }
      } catch (error) {
        console.error('Error adding facility:', error)
        // @ts-expect-error toastRef.current may be null
        toast.current?.show({
          severity: 'error',
          summary: 'Error adding facility',
          detail: `${getValues('name')} already exists.`,
        })
      }
    }
  }

  const handleFileSelect = (event: FileUploadSelectEvent) => {
    const files = event.files
    setSelectedImages(prevFiles => [...prevFiles, ...files])

    console.log('files: ', files)
  }

  const handleBeforeSend = (event: FileUploadBeforeSendEvent) => {
    const { access_token } = GetTokenInfo()
    event.xhr.setRequestHeader('Authorization', `Bearer ${access_token}`)
  }

  const handleUploadError = (event: FileUploadErrorEvent) => {
    uploadErrorRef.current = true
    console.error('Error uploading file:', event.files[0]?.name)
    // @ts-expect-error toastRef.current may be null
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: `Error uploading ${event.files[0]?.name}`,
      life: 2000,
    })
  }

  const handleUploadSuccess = (event: FileUploadUploadEvent) => {
    if (event.xhr.status === 200) {
      const data: IFacilityFormInputs = JSON.parse(event.xhr.response)
      // @ts-expect-error toastRef.current may be null
      toast.current?.show({
        severity: 'info',
        summary: 'File Uploaded',
        detail: `${event.files[0].name} has been uploaded successfully.`,
        life: 2000,
      })
    } else {
      console.error('Error status:', event.xhr.status)
      console.error('Error status text:', event.xhr.statusText)
      console.error('Error response text:', event.xhr.responseText)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <Toast ref={toast} onRemove={e => onRemoveToast(e)} />
      <div className="space-y-12">
        {/* Business Information */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide information about your business so that we can verify you on the platform.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label htmlFor="tax_id" className="block text-sm font-medium leading-6 text-gray-900">
                *Tax ID:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="tax_id"
                  rules={{
                    required: 'Tax ID is required',
                    pattern: {
                      value: /^\d{2}-\d{7}$/,
                      message: 'Invalid Tax ID. E.g. 12-3456789',
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputMask
                      id={field.name}
                      {...field}
                      mask="99-9999999"
                      slotChar="x"
                      tooltip="A Tax Identification Number (TIN) in the United States is a unique identifier assigned to individuals and businesses for tax purposes. It helps government authorities track financial activities, ensure accurate tax reporting, and maintain transparency in financial transactions."
                      tooltipOptions={tooltipOptions}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('tax_id', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="corp_name" className="block text-sm font-medium leading-6 text-gray-900">
                *Corporate Name:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="corp_name"
                  rules={{ required: 'Corporate Name is required' }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )}
                />
              </div>
              {getFormErrorMessage('corp_name', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="company_dbas" className="block text-sm font-medium leading-6 text-gray-900">
                *Company DBAs:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="company_dbas"
                  rules={{ required: 'Company DBAs is required' }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      value={field.value.join(', ')}
                      onChange={e => field.onChange(e.target.value.split(', '))}
                      tooltip="Enter company DBAs separated by comma"
                      tooltipOptions={tooltipOptions}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('company_dbas', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                *Facility Name:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: 'Facility Name is required' }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )}
                />
              </div>
              {getFormErrorMessage('name', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone_number" className="block text-sm font-medium leading-6 text-gray-900">
                *Facility Phone Number:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="phone_number"
                  rules={{
                    required: 'Mobile Number is required',
                    pattern: {
                      value: /^\(\d{3}\) \d{3}-\d{4}$/,
                      message: 'Invalid Mobile Number. E.g. (123) 456-7890',
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputMask
                      id={field.name}
                      {...field}
                      mask="(999) 999-9999"
                      slotChar="x"
                      tooltip="E.g. (281) 330-8004"
                      tooltipOptions={tooltipOptions}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('phone_number', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
                *Facility Square Footage:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="sqft"
                  rules={{
                    required: 'Facility Square Footage is required',
                    pattern: {
                      value: /^\d+$/,
                      message: 'Invalid Facility Square Footage. It should be a number.',
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputNumber
                      id={field.name}
                      {...field}
                      onChange={e => field.onChange(Number(e.value))}
                      min={0}
                      tooltip="E.g. 10000"
                      tooltipOptions={tooltipOptions}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('sqft', errors)}
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="services" className="block text-sm font-medium leading-6 text-gray-900">
                *Services:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="services"
                  rules={{ required: 'At least one Serivce is required' }}
                  render={({ field, fieldState }) => (
                    <MultiSelect
                      id={field.name}
                      {...field}
                      value={field.value}
                      options={services}
                      display="chip"
                      onChange={(e: MultiSelectChangeEvent) => field.onChange(e.value)}
                      placeholder="Select Services"
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
                {getFormErrorMessage('services', errors)}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="sqft" className="block text-sm font-medium leading-6 text-gray-900">
                Facility notes:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="notes"
                  rules={{ required: false }}
                  render={({ field, fieldState }) => (
                    <InputTextarea
                      id={field.name}
                      {...field}
                      rows={4}
                      cols={30}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('notes', errors)}
            </div>
          </div>
        </div>

        {/* Business Location */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business Location</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide your business address information below.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                *Country:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="country"
                  rules={{ required: 'Country is required' }}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      {...field}
                      filter
                      options={countries}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('country', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                *Address:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="address"
                  rules={{ required: 'Address is required' }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )}
                />
              </div>
              {getFormErrorMessage('address', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                *City:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="city"
                  rules={{ required: 'City is required' }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )}
                />
              </div>
              {getFormErrorMessage('city', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                *State:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="state"
                  rules={{ required: 'State is required' }}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      {...field}
                      filter
                      options={states}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('state', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="postalCode" className="block text-sm font-medium leading-6 text-gray-900">
                *Postal Code:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="zip"
                  rules={{ required: 'Postal Code is required' }}
                  render={({ field, fieldState }) => (
                    <InputMask
                      id={field.name}
                      {...field}
                      mask="99999"
                      slotChar="x"
                      tooltip="E.g. 90210"
                      tooltipOptions={{ position: 'bottom' }}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('zip', errors)}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business Contact Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Please provide your contact information below.</p>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <label
                  htmlFor={`contacts.${index}.first_name`}
                  className="block text-sm font-medium leading-6 text-gray-900">
                  *First Name:
                </label>
                <div className="mt-2">
                  <Controller
                    control={control}
                    name={`contacts.${index}.first_name`}
                    rules={{ required: 'First Name is required' }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                </div>
                {getFormErrorMessage(`contacts.${index}.first_name`, errors)}
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor={`contacts.${index}.last_name`}
                  className="block text-sm font-medium leading-6 text-gray-900">
                  *Last Name:
                </label>
                <div className="mt-2">
                  <Controller
                    control={control}
                    name={`contacts.${index}.last_name`}
                    rules={{ required: 'Last Name is required' }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                </div>
                {getFormErrorMessage(`contacts.${index}.last_name`, errors)}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor={`contacts.${index}.role`} className="block text-sm font-medium leading-6 text-gray-900">
                  *Role:
                </label>
                <div className="mt-2">
                  <Controller
                    control={control}
                    name={`contacts.${index}.role`}
                    rules={{ required: 'Role is required' }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        {...field}
                        filter
                        options={['Owner', 'AP', 'Onsite', 'Security', 'Other']}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                </div>
                {getFormErrorMessage(`contacts.${index}.role`, errors)}
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor={`contacts.${index}.phone_number`}
                  className="block text-sm font-medium leading-6 text-gray-900">
                  *Phone Number:
                </label>
                <div className="mt-2">
                  <Controller
                    control={control}
                    name={`contacts.${index}.phone_number`}
                    rules={{
                      required: 'Mobile Number is required',
                      pattern: {
                        value: /^\(\d{3}\) \d{3}-\d{4}$/,
                        message: 'Invalid Mobile Number. E.g. (123) 456-7890',
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <InputMask
                        id={field.name}
                        {...field}
                        mask="(999) 999-9999"
                        slotChar="x"
                        tooltip="E.g. (281) 330-8004"
                        tooltipOptions={tooltipOptions}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                </div>
                {getFormErrorMessage(`contacts.${index}.phone_number`, errors)}
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor={`contacts.${index}.email`}
                  className="block text-sm font-medium leading-6 text-gray-900">
                  *Email:
                </label>
                <div className="mt-2">
                  <Controller
                    control={control}
                    name={`contacts.${index}.email`}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Invalid email',
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                </div>
                {getFormErrorMessage(`contacts.${index}.email`, errors)}
              </div>
            </div>
          ))}
        </div>

        {/* Facility Images */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Facility Images</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Upload any images of your facility.</p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            {facilitiesArray[0]?.images.length > 0 ? (
              <div className="sm:col-span-6">
                <Panel header="Uploaded Images">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
                    {facilitiesArray[0]?.images.map((image, index) => {
                      const fileName = image.key.split('/').pop()
                      return (
                        <div key={image.timestamp} className="flex w-full flex-col items-center justify-center">
                          <Image src={image.url} alt={fileName} preview pt={{ image: { className: 'h-16 w-auto' } }} />
                          <p className="cursor-default px-5 py-1.5 text-sm font-semibold leading-6 text-gray-900 hover:text-gray-500">
                            {fileName}
                          </p>
                        </div>
                      )
                    })}
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
              <div className="sm:col-span-6">
                <label htmlFor="stateLicenseDocument" className="block text-sm font-medium leading-6 text-gray-900">
                  Upload Images:
                </label>
                <div className="mt-2">
                  <FileUpload
                    id="facilityImages"
                    name="files"
                    ref={fileUploadRef}
                    maxFileSize={10000000}
                    accept="image/*"
                    multiple={true}
                    mode="advanced"
                    url={fileUploadUrlRef.current}
                    onSelect={handleFileSelect}
                    onBeforeSend={handleBeforeSend}
                    onError={handleUploadError}
                    onUpload={handleUploadSuccess}
                    emptyTemplate={
                      <p>
                        Drag and drop <u>Facility Image</u> files to upload. Max size: 10MB
                      </p>
                    }
                    previewWidth={200}
                    pt={{
                      uploadButton: {
                        root: {
                          className: 'hidden',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <div>
          <Button type="submit" label="Submit" loading={isLoading} />
        </div>
      </div>
    </form>
  )
}
