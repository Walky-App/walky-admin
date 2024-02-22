import React, { useRef, useState } from 'react'
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

interface BasicInfoProps {
  onJobCreated: (id: string) => void
}
interface Facility {
  _id: string
  name: string
  address: string
}
export default function BasicInfo(props: BasicInfoProps) {
  const user = GetTokenInfo()
  const id = user?._id

  React.useEffect(() => {
    const getFacilities = async () => {
      const allFacilities = await RequestService(`facilities/byclient/${id}`)
      setFacilities(allFacilities)
    }

    getFacilities()
  }, [])

  const [activeIndex, setActiveIndex] = useState<number>(0)
  const toast = useRef<Toast>(null)
  const [facilities, setFacilities] = React.useState<any>([])
  const [dates, setDates] = useState<Nullable<Date[]>>(null)
  const [description, setDescription] = useState<string>('')
  const facility_id = '65cb0a8cd8e37d4b9264d0d2'
  const defaultValues = {
    title: '',
    description: '',
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

  const { onJobCreated } = props

  const onSubmit = async (data: any) => {
    try {
      // Add the facility_id to the data
      const requestData = { ...data, facility_id }
      console.log('Request data -->', requestData)
      const response = await RequestService('jobs', 'POST', requestData)
      onJobCreated(response._id)
      console.log('Just created this job -->', response)
      console.log('And here is the id of the job -->', response._id)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="mb-6 mt-6 text-sm leading-6 text-gray-600">
        Please take a moment to provide the essential information for the job posting. We require you to specify the
        position title, and provide a comprehensive job description. Click on the next step as soon as you are done.
      </p>
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
      <div className="col-span-full">
        <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
          Job Description
        </label>
        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Editor
              value={field.value}
              onTextChange={(e: EditorTextChangeEvent) => field.onChange(e.htmlValue ?? '')}
              style={{ height: '320px' }}
            />
          )}
        />
        <p className="mt-3 text-sm leading-6 text-gray-600">Write notes about the Job.</p>
        <div className="mt-6 flex items-center justify-center gap-x-6">
          <Button type="submit">Save Progress</Button>
        </div>
      </div>
    </form>
  )
}
