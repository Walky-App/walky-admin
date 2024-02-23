import React, { useRef } from 'react'
import { GetTokenInfo } from '../../../../utils/TokenUtils'
import { RequestService } from '../../../../services/RequestService'
import { Controller, set, useForm } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import { InputNumber } from 'primereact/inputnumber'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'
import { Calendar } from 'primereact/calendar'
import { Nullable } from 'primereact/ts-helpers'

import { Toast } from 'primereact/toast'
import { useNavigate } from 'react-router-dom'

//Interfaces start
interface ShiftDetailsProps {
  jobId: string | null
}
interface Facility {
  _id: string
  name: string
  address: string
}
//interfaces end
export default function ShiftDetails({ jobId }: ShiftDetailsProps) {
  console.log('Brought this job id from BasicInfo ->', jobId)
  const [facilities, setFacilities] = React.useState<any>([])
  const [datetime24h, setDateTime24h] = React.useState<Date | null>(null)
  const [startTime, setStartTime] = React.useState<Date | null>(null)
  const [endTime, setEndTime] = React.useState<Date | null>(null)
  const user = GetTokenInfo()
  const id = user?._id
  const toast = useRef<Toast>(null)
  const defaultValues = { base_rate: null }
  const navigate = useNavigate()

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      job_dates: [],
      startTime: null,
      endTime: null,
      lunch_break: null,
      totalHours: null,
    },
  })

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
      const updatedData = { ...data, id: jobId, startTime: startTimeMilitary, endTime: endTimeMilitary }
      console.log('Lets see Updated data -->', updatedData)
      const response = await RequestService(`jobs/${jobId}`, 'PATCH', updatedData)
      if (response) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Congratulations! Shift details saved successfully',
        })
        setTimeout(() => {
          navigate('/client/jobs')
        }, 3000)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="mb-6 mt-6 text-sm leading-6 text-gray-600">
        Please take a moment to fill out the forms for the next step. We require you to specify the shift details
        including the start and end time, dates, lunchtime.
      </p>
      <Toast ref={toast} />
      <div>
        <Controller
          name="job_dates"
          control={control}
          rules={{
            required: 'Date is required.',
            validate: value => value.length > 0 || 'At least one date must be selected.',
          }}
          render={({ field, fieldState }) => (
            <>
              <label htmlFor={field.name}>Shift Dates</label>
              <div>
                <Calendar
                  inputId={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  dateFormat="dd/mm/yy"
                  selectionMode="multiple"
                  className={classNames({ 'p-invalid': fieldState.error })}
                />
                {getFormErrorMessage(field.name)}
              </div>
            </>
          )}
        />{' '}
      </div>
      <div className="mt-6">
        <div>
          <Controller
            name="startTime"
            control={control}
            rules={{ required: 'Start Time is required.' }}
            render={({ field, fieldState }) => (
              <div className="mt-6">
                <label htmlFor="start_time">Start Time</label>
                <div>
                  <Calendar
                    value={field.value}
                    onChange={e => field.onChange(e.value ?? null)}
                    timeOnly
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </div>
              </div>
            )}
          />
        </div>
      </div>
      <div className="mt-6">
        <div>
          <Controller
            name="endTime"
            control={control}
            rules={{ required: 'End Time is required.' }}
            render={({ field, fieldState }) => (
              <div className="mt-6">
                <label htmlFor="end_time">End Time</label>
                <div>
                  <Calendar
                    value={field.value}
                    onChange={e => field.onChange(e.value ?? null)}
                    timeOnly
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </div>
              </div>
            )}
          />
        </div>
      </div>
      <div>
        <Controller
          name="lunch_break"
          control={control}
          rules={{
            required: 'Enter lunch break time in minutes.',
            validate: value => (value !== null && value >= 0 && value <= 90) || 'Enter lunch break time in minutes',
          }}
          render={({ field, fieldState }) => (
            <>
              <label htmlFor={field.name}>Lunch Break (minutes)</label>
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
      <div>
        <Controller
          name="totalHours"
          control={control}
          rules={{
            required: 'Enter total number of hours for this job.',
            validate: value =>
              (value !== null && value >= 0 && value <= 90) || 'Enter total number of hours for this job.',
          }}
          render={({ field, fieldState }) => (
            <>
              <label htmlFor={field.name}>Total Hours</label>
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
      <div className="mt-6 flex items-center justify-center gap-x-6">
        <Button type="submit">Save Progress</Button>
      </div>
    </form>
  )
}
