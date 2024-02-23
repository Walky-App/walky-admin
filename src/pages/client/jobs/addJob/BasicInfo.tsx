import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { GetTokenInfo } from '../../../../utils/TokenUtils'
import { RequestService } from '../../../../services/RequestService'
import { Editor, EditorTextChangeEvent } from 'primereact/editor'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Controller } from 'react-hook-form'
import { Toast } from 'primereact/toast'
import { classNames } from 'primereact/utils'
import { Dropdown } from 'primereact/dropdown'
import { IFacility } from '../../../../interfaces/Facility'
interface BasicInfoProps {
  onJobCreated: (id: string) => void
  onNext: () => void
}
export default function BasicInfo(props: BasicInfoProps) {
  const user = GetTokenInfo()
  const id = user?._id
  const toast = useRef<Toast>(null)
  const [facilities, setFacilities] = React.useState<IFacility[]>()

  React.useEffect(() => {
    const getFacilities = async () => {
      const allFacilities = await RequestService(`facilities/byclient/${id}`)
      setFacilities(allFacilities)
    }

    getFacilities()
  }, [])

  const defaultValues = {
    title: '',
    description: '',
    facility_id: '',
  }
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues })

  const getFormErrorMessage = (name: string) => {
    //@ts-ignore
    return errors[name] ? (
      //@ts-ignore
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    )
  }

  const { onJobCreated, onNext } = props

  const onSubmit = async (data: any) => {
    try {
      const requestData = { ...data }
      const response = await RequestService('jobs', 'POST', requestData)
      if (response) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Basic information submitted successfully',
        })
        onJobCreated(response._id)
        setTimeout(onNext, 2000)
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <Toast ref={toast} />
      <div className="space-y-12">
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Job Title and Facility</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please take a moment to provide the essential information for the job posting. We require you to specify
              the job title and provide a facility this job pertains to.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label htmlFor="taxId" className="block text-sm font-medium leading-6 text-gray-900">
                Job Title:
              </label>
              <div className="mt-2">
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    required: 'Job Title is required.',
                    maxLength: { value: 100, message: 'Job Title cannot exceed 100 characters.' },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <span className="p-float-label">
                        <InputText
                          id={field.name}
                          value={field.value}
                          className={classNames({ 'p-invalid': fieldState.error })}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      </span>
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />{' '}
              </div>
              {getFormErrorMessage('taxId')}
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="businessContactMobileNumber"
                className="block text-sm font-medium leading-6 text-gray-900">
                Select Facility:
              </label>
              <div className="mt-2">
                <Controller
                  name="facility_id"
                  control={control}
                  rules={{ required: 'Facility is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <div>
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          optionLabel="name"
                          options={facilities}
                          focusInputRef={field.ref}
                          onChange={e => field.onChange(e.value)}
                          className={classNames({ 'p-invalid': fieldState.error })}
                        />
                        <div>{getFormErrorMessage(field.name)}</div>
                      </div>
                    </>
                  )}
                />{' '}
              </div>
              {getFormErrorMessage('businessContactMobileNumber')}
            </div>
          </div>
        </div>

        {/* Business Location */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Job Description</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide a comprehensive job description for this job.{' '}
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 md:col-span-2">
            <div className="sm:col-span-3">
              <label htmlFor="facilityName" className="block text-sm font-medium leading-6 text-gray-900">
                Job Description:
              </label>
              <div className="mt-2">
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Job Description is required.',
                    maxLength: { value: 5000, message: 'Job Description cannot exceed 5000 characters.' },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <Editor
                        value={field.value}
                        onTextChange={(e: EditorTextChangeEvent) => field.onChange(e.htmlValue ?? '')}
                        style={{ height: '320px' }}
                      />
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>
              {getFormErrorMessage('facilityName')}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <div>
          <Button type="submit" label="Submit" />
        </div>
      </div>
    </form>
  )
}
