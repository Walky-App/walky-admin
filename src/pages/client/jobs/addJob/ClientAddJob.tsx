import React, { useRef } from 'react'
import { RequestService } from '../../../../services/RequestService'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import { TabView, TabPanel } from 'primereact/tabview'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import { Toast } from 'primereact/toast'
import { Dropdown } from 'primereact/dropdown'
import { IFacility } from '../../../../interfaces/Facility'
import { GetTokenInfo } from '../../../../utils/TokenUtils'
import TitleComponent from '../../../../components/shared/general/TitleComponent'

export default function ClientAddJob() {
  const [startTime, setStartTime] = React.useState<Date | null>(null)
  const [endTime, setEndTime] = React.useState<Date | null>(null)
  const user = GetTokenInfo()
  const id = user?._id
  const toast = useRef<Toast>(null)
  const [facilities, setFacilities] = React.useState<IFacility[]>()

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

  const onSubmit = async (data: any) => {
    try {
      const startTimeMilitary = startTime ? startTime.getHours() * 100 + startTime.getMinutes() : null
      const endTimeMilitary = endTime ? endTime.getHours() * 100 + endTime.getMinutes() : null
      const requestData = { ...data, start_time: startTimeMilitary, end_time: endTimeMilitary }

      console.log('Lets see Jobs data -->', requestData)
      const response = await RequestService('jobs', 'POST', requestData)
      if (response) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Job information submitted successfully',
        })
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

  const skills = [
    { name: 'Trimming' },
    { name: 'Budtending' },
    { name: 'Harvesting' },
    { name: 'Packaging' },
    { name: 'Gardening' },
    { name: 'Cultivation' },
    { name: 'Extraction' },
    { name: 'Edibles' },
    { name: 'Sales' },
    { name: 'Security' },
    { name: 'Delivery' },
    { name: 'Other' },
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
                  <TabView>
                    <TabPanel header="Calendar View">
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
                                  showIcon
                                  showButtonBar
                                  minDate={new Date()} // Disabling past dates
                                  inline
                                />
                                {getFormErrorMessage(field.name)}
                              </div>
                            </>
                          )}
                        />
                      </div>
                    </TabPanel>
                    <TabPanel header="Recurring Dates">
                      <p className="m-0">
                        To be developed. This feature will allow you to set recurring dates for the job.{' '}
                      </p>
                    </TabPanel>
                  </TabView>
                </div>
              </div>
            </div>
          </div>

          {/* Shift Details */}
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Times and Dates</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">Please provide details about the shifts.</p>
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
                  Lunch Break (in minutes):
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
