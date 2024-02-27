import React, { useRef } from 'react'
import { RequestService } from '../../../../services/RequestService'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import { Toast } from 'primereact/toast'
import { useNavigate } from 'react-router-dom'
interface ShiftDetailsProps {
  jobId: string | null
}
export default function ShiftDetails({ jobId }: ShiftDetailsProps) {
  const [startTime, setStartTime] = React.useState<Date | null>(null)
  const [endTime, setEndTime] = React.useState<Date | null>(null)
  const toast = useRef<Toast>(null)
  const navigate = useNavigate()

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      job_dates: [],
      startTime: null,
      endTime: null,
      lunch_break: null,
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
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <Toast ref={toast} />
      <div className="space-y-12">
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Shift Details</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Please provide details about the shifts.</p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-4">
              <label htmlFor="job_dates" className="block text-sm font-medium leading-6 text-gray-900">
                Job Dates:
              </label>
              <div className="mt-2">
                <Controller
                  name="job_dates"
                  control={control}
                  rules={{
                    required: 'Date is required.',
                    validate: value => value.length > 0 || 'At least one date must be selected.',
                  }}
                  render={({ field, fieldState }) => (
                    <>
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
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="start_time" className="block text-sm font-medium leading-6 text-gray-900">
                Start time:
              </label>
              <div className="mt-2">
                <Controller
                  name="startTime"
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
                  name="endTime"
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
