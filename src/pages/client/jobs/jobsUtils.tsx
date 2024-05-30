import { type Control, Controller, type FieldErrors } from 'react-hook-form'

import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber, type InputNumberValueChangeEvent } from 'primereact/inputnumber'
import { RadioButton } from 'primereact/radiobutton'
import { classNames } from 'primereact/utils'

import { HtInputHelpText } from '../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { type IFacility } from '../../../interfaces/Facility'
import { jobTipsOptions, jobTitlesOptions, lunchTimeOptions } from '../../../utils/formOptions'
import { getFormErrorMessage } from '../../../utils/formUtils'

export interface JobFormDefaultValues {
  title: string
  facility_id?: string
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

export const setTime = (hours: number, minutes = 0, seconds = 0, milliseconds = 0) => {
  const date = new Date()
  date.setHours(hours, minutes, seconds, milliseconds)
  return date
}

export const convertMilitaryTimeToStandardDate = (time: number, date: Date) => {
  const hours = Math.floor(time / 100)
  const minutes = time % 100
  const dateObj = new Date(date)
  dateObj.setHours(hours)
  dateObj.setMinutes(minutes)
  return dateObj
}

export const defaultJobFormValues: JobFormDefaultValues = {
  title: '',
  facility_id: '',
  vacancy: 1,
  hourly_rate: 18.0,
  job_dates: [],
  start_time: setTime(8, 30),
  end_time: setTime(17),
  lunch_break: 30,
  job_tips: [],
  total_hours: 0,
}

export const renderJobTitleController = (
  control: Control<JobFormDefaultValues>,
  errors: FieldErrors<JobFormDefaultValues>,
) => (
  <Controller
    name="title"
    control={control}
    rules={{ required: 'Job Title is required.' }}
    render={({ field, fieldState }) => (
      <>
        <HtInputLabel htmlFor={field.name} labelText="Job Title" asterisk />
        <Dropdown
          id={field.name}
          value={field.value}
          optionLabel="title"
          options={jobTitlesOptions}
          filter
          focusInputRef={field.ref}
          onChange={e => field.onChange(e.value)}
          className={classNames({ 'p-invalid': fieldState.error }, 'mt-2')}
        />
        {getFormErrorMessage(field.name, errors)}
      </>
    )}
  />
)

export const renderFacilityController = (
  control: Control<JobFormDefaultValues>,
  errors: FieldErrors<JobFormDefaultValues>,
  facilities: IFacility[],
) => (
  <Controller
    name="facility_id"
    control={control}
    rules={{ required: 'Facility is required.' }}
    render={({ field, fieldState }) => (
      <>
        <HtInputLabel htmlFor={field.name} labelText="Select Facility" asterisk />
        <Dropdown
          id={field.name}
          value={field.value}
          optionLabel="name"
          options={facilities}
          filter
          focusInputRef={field.ref}
          onChange={e => field.onChange(e.value)}
          className={classNames({ 'p-invalid': fieldState.error }, 'mt-2')}
        />
        {getFormErrorMessage(field.name, errors)}
      </>
    )}
  />
)

export const renderJobDatesController = (
  control: Control<JobFormDefaultValues>,
  errors: FieldErrors<JobFormDefaultValues>,
) => (
  <Controller
    name="job_dates"
    control={control}
    rules={{
      required: 'A Date is required.',
      validate: value => value.length > 0 || 'At least one date must be selected.',
    }}
    render={({ field, fieldState }) => (
      <>
        <HtInfoTooltip message="Select the dates you need temps at your facility.">
          <HtInputLabel htmlFor={field.name} labelText="Select Job Dates" asterisk />
        </HtInfoTooltip>
        <Calendar
          inputId={field.name}
          value={field.value}
          onChange={field.onChange}
          dateFormat="mm/dd/yy"
          selectionMode="multiple"
          className={classNames({ 'p-invalid': fieldState.error }, 'mt-2')}
          minDate={new Date()} // Disabling past dates
          inline
          showButtonBar
        />
        {field.value.length > 0 ? (
          <div className="mt-2">
            <HtInputLabel htmlFor={field.name} labelText="Selected Dates" className="text-base" />
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
      </>
    )}
  />
)

export const renderStartTimeController = (
  control: Control<JobFormDefaultValues>,
  errors: FieldErrors<JobFormDefaultValues>,
  startTime: Date,
  setStartTime: (time: Date | null) => void,
) => (
  <Controller
    name="start_time"
    control={control}
    rules={{ required: 'Start Time is required.' }}
    render={({ field, fieldState }) => (
      <>
        <HtInputLabel htmlFor={field.name} labelText="Start Time" asterisk />
        <Calendar
          value={field.value === null ? startTime : field.value}
          onChange={e => {
            field.onChange(e.value ?? null)
            setStartTime(e.value ?? null)
          }}
          timeOnly
          hourFormat="12"
          showIcon
          icon={() => <i className="pi pi-clock" />}
          className={classNames({ 'p-invalid': fieldState.error }, 'mt-2')}
        />
        {getFormErrorMessage(field.name, errors)}
      </>
    )}
  />
)

export const renderEndTimeController = (
  control: Control<JobFormDefaultValues>,
  errors: FieldErrors<JobFormDefaultValues>,
  endTime: Date,
  setEndTime: (time: Date | null) => void,
) => (
  <Controller
    name="end_time"
    control={control}
    rules={{ required: 'End Time is required.' }}
    render={({ field, fieldState }) => (
      <>
        <HtInputLabel htmlFor={field.name} labelText="End Time" asterisk />
        <Calendar
          value={field.value === null ? endTime : field.value}
          onChange={e => {
            field.onChange(e.value ?? null)
            setEndTime(e.value ?? null)
          }}
          timeOnly
          hourFormat="12"
          showIcon
          icon={() => <i className="pi pi-clock" />}
          className={classNames({ 'p-invalid': fieldState.error }, 'mt-2')}
        />
        {getFormErrorMessage(field.name, errors)}
      </>
    )}
  />
)

export const renderVacancyController = (
  control: Control<JobFormDefaultValues>,
  errors: FieldErrors<JobFormDefaultValues>,
) => (
  <Controller
    name="vacancy"
    control={control}
    rules={{
      required: 'Enter a valid number of vacancies.',
    }}
    render={({ field, fieldState }) => (
      <>
        <HtInfoTooltip message="If you have more than 10 vacancies for this job, please message Support.">
          <HtInputLabel htmlFor={field.name} labelText="Number of Vacancies" />
        </HtInfoTooltip>
        <InputNumber
          id={field.name}
          inputRef={field.ref}
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
          className="mt-2"
        />
        <HtInputHelpText fieldName={field.name} helpText="Max number of vacancies: 10" />
        {getFormErrorMessage(field.name, errors)}
      </>
    )}
  />
)

export const renderPayRateController = (
  control: Control<JobFormDefaultValues>,
  errors: FieldErrors<JobFormDefaultValues>,
) => (
  <Controller
    name="hourly_rate"
    control={control}
    rules={{
      required: 'Enter an hourly pay rate.',
    }}
    render={({ field, fieldState }) => (
      <>
        <HtInfoTooltip message="An hourly pay rate should be not be lower than the minimum rate required by law">
          <HtInputLabel htmlFor={field.name} labelText="Pay Rate" />
        </HtInfoTooltip>
        <InputNumber
          id={field.name}
          inputRef={field.ref}
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
          className="mt-2"
        />
        {getFormErrorMessage(field.name, errors)}
        <HtInputHelpText fieldName={field.name} helpText="Enter hourly pay rate in USD" />
      </>
    )}
  />
)

export const renderJobTipsController = (
  control: Control<JobFormDefaultValues>,
  errors: FieldErrors<JobFormDefaultValues>,
) => (
  <Controller
    name="job_tips"
    control={control}
    rules={{ required: 'Job tips required.' }}
    render={({ field }) => (
      <>
        <HtInfoTooltip message="Provide common job notes to accepted employees. Select at least one job tip.">
          <HtInputLabel htmlFor={field.name} labelText="Job tips" asterisk />
        </HtInfoTooltip>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {jobTipsOptions.map(option => (
            <div className="flex items-center" key={option.value}>
              <Checkbox
                inputId={option.value}
                checked={field.value?.includes(option.value) || false}
                onChange={e => {
                  const value = field.value || []
                  if (e.checked) {
                    field.onChange([...value, option.value])
                  } else {
                    field.onChange(value.filter((item: string) => item !== option.value))
                  }
                }}
              />
              <label className="ml-2.5 text-balance" htmlFor={option.value}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {getFormErrorMessage(field.name, errors)}
      </>
    )}
  />
)

export const renderLunchBreakController = (
  control: Control<JobFormDefaultValues>,
  errors: FieldErrors<JobFormDefaultValues>,
) => (
  <Controller
    name="lunch_break"
    control={control}
    rules={{
      required: 'Enter lunch break time in minutes.',
      validate: value => (value !== null && value >= 0 && value <= 90) || 'Enter lunch break time in minutes',
    }}
    render={({ field }) => (
      <>
        <HtInfoTooltip message="Select the lunch break time in minutes.">
          <HtInputLabel htmlFor={field.name} labelText="Lunch Break" asterisk />
        </HtInfoTooltip>
        <div className="mt-2 grid w-2/3 grid-cols-2 gap-2 sm:w-full xl:w-3/4">
          {lunchTimeOptions.map((lunchTime, index) => (
            <div className="flex" key={index}>
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
        {getFormErrorMessage(field.name, errors)}
      </>
    )}
  />
)
