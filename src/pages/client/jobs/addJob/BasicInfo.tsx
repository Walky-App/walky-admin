import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { GetTokenInfo } from '../../../../utils/TokenUtils'
import { RequestService } from '../../../../services/RequestService'
import { Editor, EditorTextChangeEvent } from 'primereact/editor'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Controller } from 'react-hook-form'
import { Toast } from 'primereact/toast'
import { Nullable } from 'primereact/ts-helpers'
import { classNames } from 'primereact/utils'
import { Dropdown } from 'primereact/dropdown'

interface BasicInfoProps {
  onJobCreated: (id: string) => void
  onNext: () => void
}
interface Facility {
  _id: string
  name: string
  address: string
}
export default function BasicInfo(props: BasicInfoProps) {
  const user = GetTokenInfo()
  const id = user?._id
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const toast = useRef<Toast>(null)
  const [facilities, setFacilities] = React.useState<any>([])
  const [dates, setDates] = useState<Nullable<Date[]>>(null)
  const [description, setDescription] = useState<string>('')

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
    getValues,
    reset,
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
      console.log('Request data -->', requestData)
      const response = await RequestService('jobs', 'POST', requestData)
      console.log('Just created this job -->', response)
      console.log('And here is the id of the job -->', response._id)

      if (response) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Basic information submitted successfully',
        })
        onJobCreated(response._id)
        setTimeout(onNext, 2000);      
    }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="mb-6 mt-6 text-sm leading-6 text-gray-600">
          Please take a moment to provide the essential information for the job posting. We require you to specify the
          job title, select facility and provide a comprehensive job description. Click on Save Progress when you are done with this step.
        </p>
        <div>
          <Controller
            name="title" // This references the field name in your form
            control={control} // Passed from useForm()
            rules={{ required: 'Job Title is required.' }} // Validation rules for this field
            render={({ field, fieldState }) => (
              <>
                <label htmlFor={field.name} className={classNames({ 'p-error': fieldState.error })}>
                  Job Title
                </label>
                <span className="p-float-label">
                  <InputText
                    id={field.name} // Each field should have a unique ID
                    value={field.value} // Set the value to the field value
                    className={classNames({ 'p-invalid': fieldState.error })} // Add 'p-invalid' class if there is an error
                    onChange={e => field.onChange(e.target.value)} // Handle changes with field.onChange
                  />
                </span>
                {getFormErrorMessage(field.name)}
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="facility_id"
            control={control}
            rules={{ required: 'Facility is required.' }}
            render={({ field, fieldState }) => (
              <>
                <label htmlFor={field.name} className={classNames({ 'p-error': fieldState.error })}>
                  Select Facility
                </label>
                <div>
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    optionLabel="name"
                    placeholder="Select Facility"
                    options={facilities}
                    focusInputRef={field.ref}
                    onChange={e => field.onChange(e.value)}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  <div>{getFormErrorMessage(field.name)}</div>
                </div>
              </>
            )}
          />
        </div>
        <div className="col-span-full">
          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: 'Job Description is required.' }}
            render={({ field, fieldState }) => (
              <>
                <label htmlFor={field.name} className={classNames({ 'p-error': fieldState.error })}>
                  Job Description
                </label>
                <Editor
                  value={field.value}
                  onTextChange={(e: EditorTextChangeEvent) => field.onChange(e.htmlValue ?? '')}
                  style={{ height: '320px' }}
                />
                {getFormErrorMessage(field.name)}
              </>
            )}
          />
          <p className="mt-3 text-sm leading-6 text-gray-600">Write notes about the Job.</p>
          <div className="mt-6 flex items-center justify-center gap-x-6">
            <Button type="submit">Save Progress</Button>
          </div>
        </div>
      </form>
    </>
  )
}
