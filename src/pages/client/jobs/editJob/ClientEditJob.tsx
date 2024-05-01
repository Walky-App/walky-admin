/*eslint-disable */
import React, { useEffect, useRef } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber, type InputNumberValueChangeEvent } from 'primereact/inputnumber'
import { MultiSelect } from 'primereact/multiselect'
import { RadioButton } from 'primereact/radiobutton'
import { Toast } from 'primereact/toast'
import { classNames } from 'primereact/utils'

import { TitleComponent } from '../../../../components/shared/general/TitleComponent'
import { IFacility } from '../../../../interfaces/Facility'
import { RequestService } from '../../../../services/RequestService'
import { useUtils } from '../../../../store/useUtils'
import { GetTokenInfo } from '../../../../utils/tokenUtil'

export default function ClientEditJob() {
  const [startTime, setStartTime] = React.useState<Date | null>(null)
  const [endTime, setEndTime] = React.useState<Date | null>(null)
  const [totalHours, setTotalHours] = React.useState(0)
  const [job, setJob] = React.useState<any>({})
  const params = useParams()
  const user = GetTokenInfo()
  const id = user?._id
  const toast = useRef<Toast>(null)
  const { showToast } = useUtils()
  const [facilities, setFacilities] = React.useState<IFacility[]>([])
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.includes('/admin')

  function militaryToStandardDate(time: any, date: any) {
    const hours = Math.floor(time / 100)
    const minutes = time % 100
    const dateObj = new Date(date)
    dateObj.setHours(hours)
    dateObj.setMinutes(minutes)
    return dateObj
  }

  useEffect(() => {
    const getJob = async () => {
      const job = await RequestService(`jobs/${params.id}`)
      if (job) {
        setJob(job)

        const jobDates = job.job_dates.map((dateString: string) => new Date(dateString))
        const startTime = militaryToStandardDate(job.start_time, jobDates[0])
        const endTime = militaryToStandardDate(job.end_time, jobDates[0])

        setStartTime(startTime)
        setEndTime(endTime)

        setValue('title', job.title)
        setValue('vacancy', job.vacancy)
        setValue('hourly_rate', job.hourly_rate)
        setValue('lunch_break', job.lunch_break)
        setValue('job_dates', jobDates)
        setValue('start_time', startTime)
        setValue('end_time', endTime)
        setValue('job_tips', job.job_tips)
      }
    }
    getJob()
  }, [params.id])

  const defaultValues = {
    title: job.title,
    facility_id: job.facility_id,
    vacancy: job.vacancy,
    hourly_rate: job.hourly_rate,
    job_dates: job.job_dates,
    start_time: job.start_time,
    end_time: job.end_time,
    lunch_break: job.lunch_break,
    job_tips: job.job_tips,
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({ defaultValues })

  const watchAllFields = watch()
  const lunchBreak = watch('lunch_break')

  React.useEffect(() => {
    if (startTime && endTime) {
      let startHours = startTime.getHours() + startTime.getMinutes() / 60
      let endHours = endTime.getHours() + endTime.getMinutes() / 60

      if (endHours <= startHours) {
        endHours += 24
      }

      const lunchBreakHours = lunchBreak ? lunchBreak / 60 : 0
      const totalHoursCalc = endHours - startHours - lunchBreakHours
      setTotalHours(Math.round(totalHoursCalc * 100) / 100)
    }
  }, [startTime, endTime, lunchBreak])

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

      // Calculating total hours and sending with payload
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

      const response = await RequestService(`jobs/${params.id}`, 'PATCH', requestData)
      if (response) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Job information updated successfully',
        })
        setTimeout(() => {
          navigate(isAdmin ? `/admin/jobs/${params.id}` : `/client/jobs/${params.id}`)
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
    { title: 'Front desk', value: 'Front desk' },
    { title: 'Greeter', value: 'Greeter' },
    { title: 'Id checker', value: 'Id checker' },
    { title: 'Inventory', value: 'Inventory' },
    { title: 'Data entry', value: 'Data entry' },
    { title: 'Event staff', value: 'Event staff' },
    { title: 'Promo representative', value: 'Promo representative' },
    { title: 'Cleaning', value: 'Cleaning' },
    { title: 'Joint roller', value: 'Joint roller' },
    { title: 'Grow tech', value: 'Grow tech' },
    { title: 'Clone tech', value: 'Clone tech' },
    { title: 'Sign spinner', value: 'Sign spinner' },
  ]

  const lunchTimes = [
    { label: 'No lunch', value: 0 },
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '60 minutes', value: 60 },
  ]

  const jobTips = [
    { label: 'Change Required Upon Entry', value: 'Change Required Upon Entry' },
    { label: 'Lunch Included', value: 'Lunch Included' },
    { label: 'Lunch Room Available', value: 'Lunch Room Available' },
    { label: 'Lunch Will Be Off-Premise', value: 'Lunch Will Be Off-Premise' },
    { label: 'Pack a Lunch', value: 'Pack a Lunch' },
    { label: 'Parking on Street', value: 'Parking on Street' },
    { label: 'Parking Onsite', value: 'Parking Onsite' },
    { label: 'Required Identification', value: 'Required Identification' },
    { label: 'Special Equipment', value: 'Special Equipment' },
    { label: 'No gas stations nearby', value: 'No gas stations nearby' },
    { label: 'Water is provided', value: 'Water is provided' },
    { label: 'Outdoor sun exposure', value: 'Outdoor sun exposure' },
    { label: 'Must be able to lift 50 lbs', value: 'Must be able to lift 50 lbs' },
    { label: 'Steeltoe shoes', value: 'Steeltoe shoes' },
    { label: 'Labcoat Provided', value: 'Labcoat Provided' },
    { label: 'Head / Beard net required', value: 'Head / Beard net required' },
  ]

  return (
    <>
      <TitleComponent title={'Edit the job'} />
      <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
        <Toast ref={toast} />
        <div className="space-y-12">
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Job Title</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please take a moment to provide the essential information to update the job posting. We require you to
                specify the job title in this section.
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
                <label htmlFor="vacancy" className="block text-sm font-medium leading-6 text-gray-900">
                  Number of Vacancies: <small>(Max 10 vacancies allowed) </small>
                </label>
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
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="hourly_rate" className="block text-sm font-medium leading-6 text-gray-900">
                  Pay Rate:
                </label>
                <div className="mt-2">
                  <Controller
                    name="hourly_rate"
                    control={control}
                    rules={{
                      required: 'Enter hourly pay rate.',
                      validate: value =>
                        (value !== null && value >= 1 && value <= 40) || 'Enter a valid hourly pay rate amount.',
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <div>
                          <InputNumber
                            id={field.name}
                            inputRef={field.ref}
                            tooltip="Enter pay rate for this job in USD."
                            tooltipOptions={{ position: 'mouse' }}
                            value={field.value}
                            onBlur={field.onBlur}
                            onValueChange={e => field.onChange(e)}
                            useGrouping={false}
                            mode="currency"
                            currency="USD"
                            showButtons
                            min={1}
                            max={40}
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
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  Job tips:
                </label>
                <div className="mt-2">
                  <Controller
                    name="job_tips"
                    control={control}
                    rules={{ required: 'Value is required.' }}
                    render={({ field }) => (
                      <MultiSelect
                        id={field.name}
                        name="value"
                        value={field.value}
                        options={jobTips}
                        filter
                        onChange={e => field.onChange(e.value)}
                        optionLabel="label"
                        placeholder="Select Job Tips"
                        maxSelectedLabels={8}
                        className="md:w-20rem w-full"
                      />
                    )}
                  />

                  {getFormErrorMessage('value')}
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
                        <div className="card justify-content-center flex">
                          <div className="flex flex-wrap gap-3">
                            {lunchTimes.map((lunchTime, index) => (
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
