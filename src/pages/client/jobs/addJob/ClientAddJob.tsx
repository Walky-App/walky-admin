import React, { useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Toast } from 'primereact/toast'
import { classNames } from 'primereact/utils'

import { TitleComponent } from '../../../../components/shared/general/TitleComponent'
import { IFacility } from '../../../../interfaces/Facility'
import { RequestService } from '../../../../services/RequestService'
import { GetTokenInfo } from '../../../../utils/TokenUtils'

export default function ClientAddJob() {
  const [startTime, setStartTime] = React.useState<Date | null>(null)
  const [endTime, setEndTime] = React.useState<Date | null>(null)
  const user = GetTokenInfo()
  const id = user?._id
  const toast = useRef<Toast>(null)
  const [facilities, setFacilities] = React.useState<IFacility[]>()
  const navigate = useNavigate()

  React.useEffect(() => {
    const getFacilities = async () => {
      const allFacilities = await RequestService(`facilities/byclient/${id}`)
      setFacilities(allFacilities)
    }
    getFacilities()
  }, [])

  const defaultValues = {
    title: '',
    facility_id: '',
    vacancy: null,
    job_dates: [],
    start_time: null,
    end_time: null,
    lunch_break: null,
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({ defaultValues })

  const watchAllFields = watch() // This will return all form values

  React.useEffect(() => {
    console.log(watchAllFields)
  }, [watchAllFields])

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
      const startTimeMilitary = startTime ? startTime.getHours() * 100 + startTime.getMinutes() : null
      const endTimeMilitary = endTime ? endTime.getHours() * 100 + endTime.getMinutes() : null
      const requestData = { ...data, start_time: startTimeMilitary, end_time: endTimeMilitary }

      if (startTime && endTime && data.lunch_break !== null) {
        let startHours = startTime.getHours() + startTime.getMinutes() / 60
        let endHours = endTime.getHours() + endTime.getMinutes() / 60

        if (endHours <= startHours) {
          endHours += 24
        }
        const lunchBreakHours = data.lunch_break / 60
        const totalHours = endHours - startHours - lunchBreakHours
        requestData.total_hours = Math.round(totalHours * 100) / 100 // Rounds to two decimal places
      }
      
      const response = await RequestService('jobs', 'POST', requestData)
      if (response) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Job information submitted successfully',
        })
        setTimeout(() => {
          navigate('/client/jobs')
        }, 3000)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const options = [
    { title: 'Harvester', value: 'Harvester' },
    { title: 'Budtender', value: 'Budtender' },
    { title: 'Trimmer', value: 'Trimmer' },
    { title: 'Packager', value: 'Packager' },
    { title: 'Gardener', value: 'Gardener' },
    { title: 'Cultivator', value: 'Cultivator' },
    { title: 'Extractor', value: 'Extractor' },
  ]

  const lunchTimes = [
    { label: '0 minutes', value: 0 },
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '60 minutes', value: 60 },
  ]

  return (
    <>
      <TitleComponent title={'Add a new job'} />
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
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  Job Title:
                </label>
                <div className="mt-2">
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: 'Facility is required.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <div>
                          <Dropdown
                            id={field.name}
                            value={field.value}
                            optionLabel="title"
                            options={options}
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
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="facility" className="block text-sm font-medium leading-6 text-gray-900">
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
              </div>
            </div>
          </div>
          {/* Job Dates */}
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Job Dates</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please provide jobs dates by picking multiple dates from the calendar or setting recurring dates.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-5">
                <div className="card">
                  <div className="mt-2">
                    <Controller
                      name="job_dates"
                      control={control}
                      rules={{
                        required: 'Date is required.',
                        validate: value => value.length > 0 || 'At least one date must be selected.',
                      }}
                      render={({ field, fieldState }) => (
                        <div>
                          <Calendar
                            inputId={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            dateFormat="mm/dd/yy"
                            selectionMode="multiple"
                            className={classNames({ 'p-invalid': fieldState.error })}
                            showIcon
                            showButtonBar
                            minDate={new Date()} // Disabling past dates
                            inline
                          />
                          {field.value && field.value.length > 0 && (
                            <div className="mt-2">
                              <h4>Selected Dates:</h4>
                              <ul className="mt-2 grid grid-cols-5 gap-2">
                                {field.value
                                  .sort((a: Date, b: Date) => a.getTime() - b.getTime())
                                  .map((date: Date, index: number) => (
                                    <li key={index}>{date.toLocaleDateString()}</li>
                                  ))}
                              </ul>
                            </div>
                          )}
                          {getFormErrorMessage(field.name)}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shift Details */}
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Hours and Vacancies</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please provide working hours, lunch break duration and number of available vacancies.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <label htmlFor="start_time" className="block text-sm font-medium leading-6 text-gray-900">
                  Start time:
                </label>
                <div className="mt-2">
                  <Controller
                    name="start_time"
                    control={control}
                    rules={{ required: 'Start Time is required.' }}
                    render={({ field, fieldState }) => (
                      <div className="mt-6">
                        <div>
                          <Calendar
                            value={field.value}
                            onChange={e => {
                              field.onChange(e.value ?? null)
                              setStartTime(e.value ?? null)
                            }}
                            timeOnly
                            hourFormat="12"
                            showIcon
                            icon={() => <i className="pi pi-clock" />}
                            className={classNames({ 'p-invalid': fieldState.error })}
                          />
                          {getFormErrorMessage(field.name)}
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="end_time" className="block text-sm font-medium leading-6 text-gray-900">
                  End Time:
                </label>
                <div className="mt-2">
                  <Controller
                    name="end_time"
                    control={control}
                    rules={{ required: 'End Time is required.' }}
                    render={({ field, fieldState }) => (
                      <div className="mt-6">
                        <div>
                          <Calendar
                            value={field.value}
                            onChange={e => {
                              field.onChange(e.value ?? null)
                              setEndTime(e.value ?? null)
                            }}
                            timeOnly
                            hourFormat="12"
                            showIcon
                            icon={() => <i className="pi pi-clock" />}
                            className={classNames({ 'p-invalid': fieldState.error })}
                          />
                          {getFormErrorMessage(field.name)}
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="lunch_break" className="block text-sm font-medium leading-6 text-gray-900">
                  Lunch Break:
                </label>
                <div className="mt-2">
                  <Controller
                    name="lunch_break"
                    control={control}
                    rules={{
                      required: 'Enter lunch break time in minutes.',
                      validate: value =>
                        (value !== null && value >= 0 && value <= 90) || 'Enter lunch break time in minutes',
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <div>
                          <Dropdown
                            id={field.name}
                            inputRef={field.ref}
                            value={field.value}
                            onChange={e => field.onChange(e.value)}
                            options={lunchTimes}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select lunch break duration"
                            className={classNames({ 'p-invalid': fieldState.error })}
                          />
                        </div>
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="vacancy" className="block text-sm font-medium leading-6 text-gray-900">
                  Number of Vacancies:
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
                            mode="decimal"
                            showButtons
                            min={1}
                            inputClassName={classNames({ 'p-invalid': fieldState.error })}
                          />
                        </div>
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
    </>
  )
}
