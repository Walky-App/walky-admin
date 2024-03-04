import { useRef } from 'react'
import { RequestService } from '../../../../services/RequestService'
import { Controller, useForm } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import { InputNumber } from 'primereact/inputnumber'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'
import { Toast } from 'primereact/toast'

//interfaces end
export default function JobDetails() {
  const toast = useRef<Toast>(null)

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      vacancy: null,
      skills: [],
    },
  })

  const skills = [
    { name: 'Trimming' },
    { name: 'Budtending' },
    { name: 'Harvesting' },
    { name: 'Packaging' },
    { name: 'Gardening'},
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

  // const onSubmit = async (data: any) => {
  //   try {
  //     data.skills = data.skills.map((skill: { name: string }) => skill.name)
  //     const updatedData = { ...data }
  //     const response = await RequestService(`jobs/${jobId}`, 'PATCH', updatedData)
  //     if (response) {
  //       toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Job details saved successfully' })
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  return (
    <form className="p-fluid">
      <Toast ref={toast} />
      <div className="space-y-12">
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Job Details</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Please provide details about this job.</p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label htmlFor="vacancy" className="block text-sm font-medium leading-6 text-gray-900">
                Vacancies:
              </label>
              <div className="mt-2">
                <Controller
                  name="vacancy"
                  control={control}
                  rules={{
                    required: 'Enter a valid number of vacancies.',
                    validate: value =>
                      (value !== null && value >= 0 && value <= 200) || 'Enter a valid number of vacancies.',
                  }}
                  render={({ field, fieldState }) => (
                    <>
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
              </div>
            </div>

            
            <div className="sm:col-span-3">
              <label htmlFor="skills" className="block text-sm font-medium leading-6 text-gray-900">
                Select Skills:
              </label>
              <div className="mt-2">
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
