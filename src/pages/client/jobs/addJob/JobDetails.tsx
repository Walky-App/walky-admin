import React, { useRef } from 'react'
import { GetTokenInfo } from '../../../../utils/TokenUtils'
import { RequestService } from '../../../../services/RequestService'
import { Controller, useForm } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import { InputNumber } from 'primereact/inputnumber'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'

import { Toast } from 'primereact/toast'

//Interfaces start
interface JobDetailsProps {
  jobId: string | null
  onNext: () => void
}
interface Facility {
  _id: string
  name: string
  address: string
}
//interfaces end
export default function JobDetails({ jobId, onNext }: JobDetailsProps) {
  console.log('Brought this job id from BasicInfo ->', jobId)
  const [facilities, setFacilities] = React.useState<any>([])
  const user = GetTokenInfo()
  const id = user?._id
  const toast = useRef<Toast>(null)
  const defaultValues = { base_rate: null }

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      base_rate: null,
      vacancy: null,
      skills: [],
      employment_type: '',
    },
  })

  const skills = [
    { name: 'Trimming' },
    { name: 'Budtending' },
    { name: 'Harvesting' },
    { name: 'Packaging' },
    { name: 'Cultivation' },
    { name: 'Extraction' },
    { name: 'Edibles' },
    { name: 'Sales' },
    { name: 'Security' },
    { name: 'Delivery' },
    { name: 'Other' },
  ]

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
      data.skills = data.skills.map((skill: { name: string }) => skill.name)
      const updatedData = { ...data, id: jobId }
      console.log('Lets see Updated data -->', updatedData)
      const response = await RequestService(`jobs/${jobId}`, 'PATCH', updatedData)
      if (response) {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Job details saved successfully' })
        setTimeout(onNext, 2000)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="mb-6 mt-6 text-sm leading-6 text-gray-600">
        Please take a moment to fill out the forms for the next step. We require you to specify the base rate, skills,
        employment type.
      </p>
      <Toast ref={toast} />
      <Controller
        name="base_rate"
        control={control}
        rules={{
          required: 'Enter a valid base rate.',
          validate: value => (value !== null && value >= 0 && value <= 200) || 'Enter a valid base rate.',
        }}
        render={({ field, fieldState }) => (
          <>
            <label htmlFor={field.name}>Base pay rate</label>
            <div>
              <InputNumber
                id={field.name}
                inputRef={field.ref}
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={e => field.onChange(e)}
                useGrouping={false}
                inputClassName={classNames({ 'p-invalid': fieldState.error })}
              />
            </div>
            {getFormErrorMessage(field.name)}
          </>
        )}
      />
      <Controller
        name="vacancy"
        control={control}
        rules={{
          required: 'Enter a valid number of vacancies.',
          validate: value => (value !== null && value >= 0 && value <= 200) || 'Enter a valid base rate.',
        }}
        render={({ field, fieldState }) => (
          <>
          <div>
            <label htmlFor={field.name}>Available Vacancies</label>
            </div>
            <div>
              <InputNumber
                id={field.name}
                inputRef={field.ref}
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={e => field.onChange(e)}
                useGrouping={false}
                inputClassName={classNames({ 'p-invalid': fieldState.error })}
              />
            </div>
            {getFormErrorMessage(field.name)}
          </>
        )}
      />
      <div className="mt-6">
        <label htmlFor="skills">Skills</label>
        <Controller
          name="skills"
          control={control}
          rules={{ required: 'Select at least 1 skill.' }}
          render={({ field, fieldState }) => (
            <>
              <MultiSelect
                id={field.name}
                name="value"
                value={field.value}
                options={skills}
                onChange={(e: MultiSelectChangeEvent) => field.onChange(e.value)}
                optionLabel="name"
                placeholder="Select Skills"
                maxSelectedLabels={3}
                className="md:w-20rem w-full"
              />
              {getFormErrorMessage(field.name)}
            </>
          )}
        />
      </div>
      <div>
        <Controller
          name="employment_type" // This references the field name in your form
          control={control} // Passed from useForm()
          rules={{ required: 'Employment type is required.' }} // Validation rules for this field
          render={({ field, fieldState }) => (
            <>
              <label htmlFor={field.name} className={classNames({ 'p-error': fieldState.error })}>
                Employment Type
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
      <div className="mt-6 flex items-center justify-center gap-x-6">
        <Button type="submit">Save Progress</Button>
      </div>
    </form>
  )
}
