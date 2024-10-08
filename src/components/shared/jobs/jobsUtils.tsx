import { useEffect } from 'react'

import { type Control, Controller, type FieldErrors } from 'react-hook-form'

import { eachWeekOfInterval, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns'
import { isValid, parse } from 'date-fns'
import { format } from 'date-fns-tz'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber, type InputNumberValueChangeEvent } from 'primereact/inputnumber'
import { RadioButton } from 'primereact/radiobutton'
import { classNames } from 'primereact/utils'

import { type IFacility } from '../../../interfaces/facility'
import { type HolidayDocument } from '../../../interfaces/setting'
import { jobTipsOptions, jobTitlesOptions, lunchTimeOptions } from '../../../utils/formOptions'
import { getFormErrorMessage } from '../../../utils/formUtils'
import { HtInputHelpText } from '../forms/HtInputHelpText'
import { HtInputLabel } from '../forms/HtInputLabel'
import { HtInfoTooltip } from '../general/HtInfoTooltip'

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
          inputId={field.name}
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
  disabled?: boolean,
) => {
  return (
    <Controller
      name="facility_id"
      control={control}
      rules={{ required: 'Facility is required.' }}
      render={({ field, fieldState }) => (
        <>
          <HtInputLabel
            htmlFor={field.name}
            labelText={disabled ?? false ? 'Facility' : 'Select Facility'}
            asterisk={disabled === true ? false : true}
          />
          <Dropdown
            inputId={field.name}
            value={field.value}
            optionLabel="name"
            optionValue="_id"
            options={facilities}
            disabled={disabled}
            filter
            focusInputRef={field.ref}
            onChange={e => {
              field.onChange(e.value)
            }}
            className={classNames({ 'p-invalid': fieldState.error }, 'mt-2')}
          />
          {getFormErrorMessage(field.name, errors)}
        </>
      )}
    />
  )
}

export const renderJobDatesController = (
  control: Control<JobFormDefaultValues>,
  errors: FieldErrors<JobFormDefaultValues>,
  stateHolidays: HolidayDocument[],
  setHolidayCount: (count: number) => void,
) => (
  <Controller
    name="job_dates"
    control={control}
    rules={{
      required: 'A Date is required.',
      validate: value => value.length > 0 || 'At least one date must be selected.',
    }}
    render={({ field, fieldState }) => {
      useEffect(() => {
        const holidayCount = field.value.reduce((count, date) => {
          const isHoliday = stateHolidays.some(
            holiday => new Date(holiday.holiday_date).toLocaleDateString() === date.toLocaleDateString(),
          )
          return isHoliday ? count + 1 : count
        }, 0)
        setHolidayCount(holidayCount)
      }, [field.value])

      const jobDates = [...field.value]
      jobDates.sort((a, b) => a.getTime() - b.getTime())
      const firstDate = jobDates[0]
      const lastDate = jobDates[jobDates.length - 1]
      const weeks = eachWeekOfInterval({ start: firstDate, end: lastDate })

      return (
        <>
          <HtInfoTooltip message="Select the dates you need temps at your facility">
            <HtInputLabel htmlFor={field.name} labelText="Select Job Dates" asterisk />
          </HtInfoTooltip>
          <Calendar
            inputId={field.name}
            value={field.value}
            onChange={e => {
              if (e.value !== null) {
                field.onChange(e.value)
              } else {
                field.onChange([])
              }
            }}
            dateFormat="mm/dd/yy"
            selectionMode="multiple"
            className={classNames({ 'p-invalid': fieldState.error }, 'mt-2')}
            minDate={new Date()}
            inline
            showButtonBar
          />
          {field.value.length > 0 ? (
            <div className="mt-2">
              <HtInputLabel htmlFor={field.name} labelText="Selected Dates" className="text-base" />
              <ul className="mt-2 grid grid-cols-5 gap-2">
                {weeks.map((week, weekIndex) => {
                  const startOfWeekDate = startOfWeek(week)
                  const endOfWeekDate = endOfWeek(week)
                  const job_dates_in_week = field.value
                    .filter(date => isWithinInterval(date, { start: startOfWeekDate, end: endOfWeekDate }))
                    .sort((a: Date, b: Date) => a.getTime() - b.getTime())

                  return (
                    <li key={weekIndex}>
                      <strong>Week {weekIndex + 1}</strong>
                      <ul>
                        {job_dates_in_week.map((date: Date, index: number) => {
                          const holiday = stateHolidays.find(
                            holiday =>
                              new Date(holiday.holiday_date).toLocaleDateString() === date.toLocaleDateString(),
                          )
                          const isHoliday = Boolean(holiday)
                          return (
                            <li key={index} style={{ color: isHoliday ? 'red' : 'inherit' }}>
                              {date.toLocaleDateString()}
                              {isHoliday ? ` (${holiday?.holiday_name})` : ''}
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}
          {getFormErrorMessage(field.name, errors)}
        </>
      )
    }}
  />
)

export const renderStartTimeController = (
  control: Control<JobFormDefaultValues>,
  errors: FieldErrors<JobFormDefaultValues>,
  startTime: Date,
  setStartTime: (time: Date | null) => void,
  isStartTimeValid: boolean,
  setIsStartTimeValid: (valid: boolean) => void,
  facilityTimezone: string,
) => {
  return (
    <Controller
      name="start_time"
      control={control}
      rules={{ required: 'Start Time is required.' }}
      render={({ field, fieldState }) => {
        return (
          <>
            <HtInfoTooltip message="Select the start time for the job.">
              <HtInputLabel
                htmlFor={field.name}
                labelText={`Start Time (${format(new Date(), 'zzz', { timeZone: facilityTimezone })}, ${format(new Date(), 'zzzz', { timeZone: facilityTimezone })})`}
                asterisk
              />
            </HtInfoTooltip>
            <Calendar
              inputId={field.name}
              value={field.value == null ? startTime : field.value}
              invalid={!isStartTimeValid}
              onChange={e => {
                const newValue = e.value as Date
                const isValidDate = newValue != null && isValid(newValue)
                if (isValidDate) {
                  setIsStartTimeValid(true)
                  field.onChange(newValue)
                  setStartTime(newValue)
                } else {
                  setIsStartTimeValid(false)
                }
              }}
              onInput={e => {
                const newValue = (e.target as HTMLInputElement).value
                const newDate = parse(newValue, 'hh:mm a', new Date())
                const isValidDate = newValue != null && isValid(newDate)
                if (isValidDate) {
                  setIsStartTimeValid(true)
                  field.onChange(newDate)
                } else {
                  setIsStartTimeValid(false)
                }
              }}
              onBlur={e => {
                const newValue = (e.target as HTMLInputElement).value
                const newDate = parse(newValue, 'hh:mm a', new Date())
                const isValidDate = newValue != null && isValid(newDate)
                if (isValidDate) {
                  setStartTime(newDate)
                }
              }}
              onHide={() => setIsStartTimeValid(true)}
              timeOnly
              hourFormat="12"
              parseDateTime={string => new Date(string)}
              showIcon
              icon={() => <i className="pi pi-clock" />}
              className={classNames({ 'p-invalid': fieldState.error }, 'mt-2')}
            />
            {getFormErrorMessage(field.name, errors)}
          </>
        )
      }}
    />
  )
}

export const renderEndTimeController = (
  control: Control<JobFormDefaultValues>,
  errors: FieldErrors<JobFormDefaultValues>,
  endTime: Date,
  setEndTime: (time: Date | null) => void,
  isEndTimeValid: boolean,
  setIsEndTimeValid: (valid: boolean) => void,
  facilityTimezone: string,
) => {
  return (
    <Controller
      name="end_time"
      control={control}
      rules={{ required: 'End Time is required.' }}
      render={({ field, fieldState }) => (
        <>
          <HtInfoTooltip message="Select the end time for the job.">
            <HtInputLabel
              htmlFor={field.name}
              labelText={`End Time (${format(new Date(), 'zzz', { timeZone: facilityTimezone })}, ${format(new Date(), 'zzzz', { timeZone: facilityTimezone })})`}
              asterisk
            />
          </HtInfoTooltip>
          <Calendar
            inputId={field.name}
            value={field.value == null ? endTime : field.value}
            invalid={!isEndTimeValid}
            onChange={e => {
              const newValue = e.value as Date
              const isValidDate = newValue != null && isValid(newValue)
              if (isValidDate) {
                setIsEndTimeValid(true)
                field.onChange(newValue)
                setEndTime(newValue)
              } else {
                setIsEndTimeValid(false)
              }
            }}
            onInput={e => {
              const newValue = (e.target as HTMLInputElement).value
              const newDate = parse(newValue, 'hh:mm a', new Date())
              const isValidDate = newValue != null && isValid(newDate)
              if (isValidDate) {
                setIsEndTimeValid(true)
                field.onChange(newDate)
              } else {
                setIsEndTimeValid(false)
              }
            }}
            onBlur={e => {
              const newValue = (e.target as HTMLInputElement).value
              const newDate = parse(newValue, 'hh:mm a', new Date())
              const isValidDate = newValue != null && isValid(newDate)
              if (isValidDate) {
                setEndTime(newDate)
              }
            }}
            onHide={() => setIsEndTimeValid(true)}
            timeOnly
            hourFormat="12"
            parseDateTime={string => new Date(string)}
            showIcon
            icon={() => <i className="pi pi-clock" />}
            className={classNames({ 'p-invalid': fieldState.error }, 'mt-2')}
          />
          {getFormErrorMessage(field.name, errors)}
        </>
      )}
    />
  )
}

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
        <HtInfoTooltip message="If you have more than 20 vacancies for this job, please message Support.">
          <HtInputLabel htmlFor={field.name} asterisk labelText="Number of Vacancies" />
        </HtInfoTooltip>
        <InputNumber
          inputId={field.name}
          inputRef={field.ref}
          value={field.value}
          onBlur={field.onBlur}
          onValueChange={(e: InputNumberValueChangeEvent) => {
            if (e.value !== undefined && e.value !== null && e.value >= 1 && e.value <= 20) {
              field.onChange(e.value)
            }
          }}
          useGrouping={false}
          mode="decimal"
          showButtons
          min={1}
          max={20}
          inputClassName={classNames({ 'p-invalid': fieldState.error })}
          className="mt-2"
        />
        <HtInputHelpText fieldName={field.name} helpText="Max number of vacancies: 15" />
        {getFormErrorMessage(field.name, errors)}
      </>
    )}
  />
)

export const renderPayRateController = (
  control: Control<JobFormDefaultValues>,
  errors: FieldErrors<JobFormDefaultValues>,
  minimun_wage: number,
) => (
  <Controller
    name="hourly_rate"
    control={control}
    rules={{
      required: 'Enter an hourly pay rate.',
      validate: value =>
        value >= minimun_wage || `Hourly rate should not be less than the minimum wage (${minimun_wage})`,
    }}
    render={({ field, fieldState }) => (
      <>
        <HtInfoTooltip message="An hourly pay rate should be not be lower than the minimum rate required by law">
          <HtInputLabel htmlFor={field.name} asterisk labelText="Pay Rate" />
        </HtInfoTooltip>
        <InputNumber
          inputId={field.name}
          inputRef={field.ref}
          value={field.value}
          onBlur={field.onBlur}
          onValueChange={(e: InputNumberValueChangeEvent) => {
            if (e.value !== undefined && e.value !== null && e.value >= minimun_wage && e.value <= 40) {
              field.onChange(e.value)
            }
          }}
          useGrouping={false}
          mode="currency"
          currency="USD"
          showButtons
          min={minimun_wage}
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
