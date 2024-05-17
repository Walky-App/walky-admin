import React, { useRef } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber, type InputNumberValueChangeEvent } from 'primereact/inputnumber'
import { MultiSelect } from 'primereact/multiselect'
import { RadioButton } from 'primereact/radiobutton'
import { Toast } from 'primereact/toast'
import { classNames } from 'primereact/utils'

import { type IFacility } from '../../../../interfaces/Facility'
import { RequestService } from '../../../../services/RequestService'
import { useUtils } from '../../../../store/useUtils'
import { jobTipsOptions, lunchTimeOptions } from '../../../../utils/formOptions'
import { getFormErrorMessage } from '../../../../utils/formUtils'
import { GetTokenInfo } from '../../../../utils/tokenUtil'

export const ClientAddJob = () => {
  const [startTime, setStartTime] = React.useState<Date | null>(null)
  const [endTime, setEndTime] = React.useState<Date | null>(null)
  const [totalHours, setTotalHours] = React.useState(0)
  const user = GetTokenInfo()
  const id = user?._id
  const toast = useRef<Toast>(null)
  const { showToast } = useUtils()
  const [facilities, setFacilities] = React.useState<IFacility[]>()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.includes('/admin')

  interface JobFormDefaultValues {
    title: string
    facility_id: string
    vacancy: number
    hourly_rate: number
    job_dates: Date[]
    start_time: Date
    end_time: Date
    lunch_break: number
    job_tips: string[]
    created_by?: string
    total_hours: number
  }

  React.useEffect(() => {
    const getFacilities = async () => {
      try {
        const endpoint = location.pathname.includes('admin') ? 'facilities' : `facilities/byclient/${id}`
        const allFacilities = await RequestService(endpoint)
        setFacilities(allFacilities)
      } catch (error) {
        console.error('Error fetching facilities:', error)
      }
    }
    getFacilities()
  }, [id, location.pathname])

  const now = new Date()
  const start_time = new Date(now)
  start_time.setHours(8, 0, 0, 0)

  const end_time = new Date(now)
  end_time.setHours(17, 0, 0, 0)

  let defaultValues: JobFormDefaultValues = {
    title: '',
    facility_id: '',
    vacancy: 0,
    hourly_rate: 0,
    job_dates: [],
    start_time: start_time,
    end_time: end_time,
    lunch_break: 0,
    job_tips: [],
    total_hours: 0,
  }

  if (isAdmin) {
    defaultValues = { ...defaultValues, created_by: '' }
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({ defaultValues })

  const lunchBreak = watch('lunch_break')

  React.useEffect(() => {
    if (startTime && endTime) {
      const startHours = startTime.getHours() + startTime.getMinutes() / 60
      let endHours = endTime.getHours() + endTime.getMinutes() / 60

      if (endHours <= startHours) {
        endHours += 24
      }

      const lunchBreakHours = lunchBreak ? lunchBreak / 60 : 0
      const totalHoursCalc = endHours - startHours - lunchBreakHours
      setTotalHours(Math.round(totalHoursCalc * 100) / 100)
    }
  }, [startTime, endTime, lunchBreak])

  const onSubmit = async (data: JobFormDefaultValues) => {
    try {
      const startTimeMilitary = startTime ? startTime.getHours() * 100 + startTime.getMinutes() : null
      const endTimeMilitary = endTime ? endTime.getHours() * 100 + endTime.getMinutes() : null
      const requestData = { ...data, start_time: startTimeMilitary, end_time: endTimeMilitary }

      if (startTime && endTime && data.lunch_break !== null) {
        const startHours = startTime.getHours() + startTime.getMinutes() / 60
        let endHours = endTime.getHours() + endTime.getMinutes() / 60

        if (endHours <= startHours) {
          endHours += 24
        }
        const lunchBreakHours = data.lunch_break / 60
        const totalHours = endHours - startHours - lunchBreakHours
        requestData.total_hours = Math.round(totalHours * 100) / 100
        setTotalHours(requestData.total_hours)
        if (requestData.total_hours < 7) {
          showToast({
            severity: 'error',
            summary: 'Error',
            detail: 'The total working hours must be at least 7 hours for a job to be successfully created.',
          })
          return
        }
      }

      const response = await RequestService('jobs', 'POST', requestData)
      if (response) {
        showToast({ severity: 'success', summary: 'Success', detail: 'Job information submitted successfully' })
        setTimeout(() => {
          navigate(isAdmin ? '/admin/jobs' : '/client/jobs')
        }, 3000)
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
              <div className="mt-2">
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: 'Job Title is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        Job Title:
                      </label>
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        optionLabel="title"
                        options={jobTipsOptions}
                        filter
                        focusInputRef={field.ref}
                        onChange={e => field.onChange(e.value)}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      {getFormErrorMessage(field.name, errors)}
                    </>
                  )}
                />{' '}
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="mt-2">
                <Controller
                  name="facility_id"
                  control={control}
                  rules={{ required: 'Facility is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        Select Facility:
                      </label>
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        optionLabel="name"
                        options={facilities}
                        filter
                        focusInputRef={field.ref}
                        onChange={e => field.onChange(e.value)}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      {getFormErrorMessage(field.name, errors)}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Job Dates */}
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Job Dates</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please select the dates you need temps at your facility. You can select one or multiple dates.
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
                          minDate={new Date()} // Disabling past dates
                          inline
                          showButtonBar
                        />
                        {field.value.length > 0 ? (
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
                        ) : null}
                        {getFormErrorMessage(field.name, errors)}
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
            <h2 className="text-base font-semibold leading-7 text-gray-900">Hours, Temps and Rates</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please select a start and end time, the length of the lunch breaks, and number of temps needed. Please
              select the pay rate you are choosing to list your job.
            </p>
            {totalHours !== 0 ? (
              <div className="mt-10">
                <div
                  className={`text-base font-semibold leading-7 ${totalHours < 7 ? 'text-red-500' : 'text-gray-900'}`}>
                  Total Hours: {totalHours}
                </div>
                <small className="text-gray-500">(Should be a minimum of 7 hours to successfully create a job)</small>
              </div>
            ) : null}
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <div className="mt-2">
                <Controller
                  name="start_time"
                  control={control}
                  rules={{ required: 'Start Time is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        Start time:
                      </label>
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
                          {getFormErrorMessage(field.name, errors)}
                        </div>
                      </div>
                    </>
                  )}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="mt-2">
                <Controller
                  name="end_time"
                  control={control}
                  rules={{ required: 'End Time is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        End Time:
                      </label>
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
                          {getFormErrorMessage(field.name, errors)}
                        </div>
                      </div>
                    </>
                  )}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="mt-2">
                <Controller
                  name="vacancy"
                  control={control}
                  rules={{
                    required: 'Enter a valid number of vacancies.',
                    validate: value =>
                      (value !== null && value >= 1 && value <= 10) ||
                      'Enter a valid number of vacancies. Max 10 vacancies allowed.',
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        Number of Vacancies: <small>(Max 10 vacancies allowed) </small>
                      </label>
                      <div>
                        <InputNumber
                          id={field.name}
                          inputRef={field.ref}
                          tooltip="Enter a valid number of vacancies from 1 to 10. If you need more than 10 vacancies, please contact Customer Service at (999)999-99-99."
                          tooltipOptions={{ position: 'mouse' }}
                          value={field.value}
                          onBlur={field.onBlur}
                          onValueChange={(e: InputNumberValueChangeEvent) => {
                            if (e.value !== undefined && e.value !== null && e.value >= 1 && e.value <= 10) {
                              field.onChange(e.value)
                            }
                          }}
                          useGrouping={false}
                          mode="decimal"
                          showButtons
                          min={1}
                          max={10}
                          inputClassName={classNames({ 'p-invalid': fieldState.error })}
                        />
                      </div>
                      {getFormErrorMessage(field.name, errors)}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="mt-2">
                <Controller
                  name="hourly_rate"
                  control={control}
                  rules={{
                    required: 'Enter hourly pay rate.',
                    validate: value =>
                      (value !== null && value >= 1 && value <= 40) || 'Enter a valid pay rate amount.',
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        Pay Rate:
                      </label>
                      <div>
                        <InputNumber
                          id={field.name}
                          inputRef={field.ref}
                          tooltip="Enter hourly pay rate for this job in USD."
                          tooltipOptions={{ position: 'mouse' }}
                          value={field.value}
                          onBlur={field.onBlur}
                          onValueChange={(e: InputNumberValueChangeEvent) => {
                            if (e.value !== undefined && e.value !== null && e.value >= 1 && e.value <= 40) {
                              field.onChange(e.value)
                            }
                          }}
                          useGrouping={false}
                          mode="currency"
                          currency="USD"
                          showButtons
                          min={1}
                          max={40}
                          inputClassName={classNames({ 'p-invalid': fieldState.error })}
                        />
                      </div>
                      {getFormErrorMessage(field.name, errors)}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="mt-2">
                <Controller
                  name="job_tips"
                  control={control}
                  rules={{ required: 'Job tips required.' }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        Job tips:
                      </label>
                      <MultiSelect
                        id={field.name}
                        name="value"
                        value={field.value}
                        options={jobTipsOptions}
                        filter
                        onChange={e => field.onChange(e.value)}
                        optionLabel="label"
                        placeholder="Select Job Tips"
                        maxSelectedLabels={8}
                        className="md:w-20rem w-full"
                      />
                      {getFormErrorMessage(field.name, errors)}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="mt-2">
                <Controller
                  name="lunch_break"
                  control={control}
                  rules={{
                    required: 'Enter lunch break time in minutes.',
                    validate: value =>
                      (value !== null && value >= 0 && value <= 90) || 'Enter lunch break time in minutes',
                  }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        Lunch Break:
                      </label>
                      <div className="card justify-content-center flex">
                        <div className="flex flex-wrap gap-3">
                          {lunchTimeOptions.map((lunchTime, index) => (
                            <div className="align-items-center flex" key={index}>
                              <RadioButton
                                inputId={`lunchTime${index}`}
                                name={field.name}
                                value={lunchTime.value}
                                onChange={e => field.onChange(e.value)}
                                checked={field.value === lunchTime.value}
                              />
                              <label htmlFor={`lunchTime${index}`} className="ml-2">
                                {lunchTime.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      {getFormErrorMessage(field.name, errors)}
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
