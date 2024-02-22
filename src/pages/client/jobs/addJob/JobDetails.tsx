import React, { useRef } from 'react'
import { GetTokenInfo } from '../../../../utils/TokenUtils'
import { RequestService } from '../../../../services/RequestService'
import { Controller, useForm } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import { InputNumber } from 'primereact/inputnumber'
import { Toast } from 'primereact/toast'

//Interfaces start
interface JobDetailsProps {
  jobId: string | null
}
interface Facility {
  _id: string
  name: string
  address: string
}
//interfaces end

export default function JobDetails({ jobId }: JobDetailsProps) {
  const [facilities, setFacilities] = React.useState<any>([])
  const user = GetTokenInfo()
  const id = user?._id
  const toast = useRef(null)
  const defaultValues = { base_rate: null }
  const form = useForm({ defaultValues })
    
  React.useEffect(() => {
    const getFacilities = async () => {
      const allFacilities = await RequestService(`facilities/byclient/${id}`)
      setFacilities(allFacilities)
    }

    getFacilities()
  }, [])

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm({ defaultValues })

  const 

  const getFormErrorMessage = (name: string) => {
    //@ts-ignore
    return errors[name] ? (
      //@ts-ignore
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    )
  }

  const onSubmit = async (data: any) => {
    try {
      // Add the facility_id to the data
      console.log('Request data -->', data)
      const response = await RequestService('jobs', 'PATCH', data)
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
        base rate.
      </p>
      <Toast ref={toast} />
      <Controller
        name="base_rate"
        control={form.control}
        rules={{
            required: 'Enter a valid base rate.',
            validate: value => (value !== null && value >= 0 && value <= 200) || 'Enter a valid base rate.',
        }}
        render={({ field, fieldState }) => (
          <>
            <label htmlFor={field.name}>Enter a year between 1960-2050.</label>
            <InputNumber
              id={field.name}
              inputRef={field.ref}
              value={field.value}
              onBlur={field.onBlur}
              onValueChange={e => field.onChange(e)}
              useGrouping={false}
              inputClassName={classNames({ 'p-invalid': fieldState.error })}
            />
            {getFormErrorMessage(field.name)}
          </>
        )}
      />
      <div className="mt-6 flex items-center justify-center gap-x-6">
        <Button type="submit">Save Progress</Button>
      </div>
    </form>
  )
}
