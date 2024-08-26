import { useEffect, useState } from 'react'

import { useForm, useWatch } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

import { eachWeekOfInterval, isWithinInterval, startOfWeek, endOfWeek, set } from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import { Button } from 'primereact/button'

import { type IFacility } from '../../../interfaces/facility'
import { type IJob } from '../../../interfaces/job'
import { type StatesSettingsDocument, type HolidayDocument } from '../../../interfaces/setting'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { requiredFieldsNoticeText } from '../../../utils/formUtils'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import { HTLoadingLogo } from '../HTLoadingLogo'
import { HeadingComponent } from '../general/HeadingComponent'
import { HtInfoTooltip } from '../general/HtInfoTooltip'
import {
  type JobFormDefaultValues,
  renderJobTitleController,
  renderFacilityController,
  renderJobDatesController,
  renderStartTimeController,
  renderEndTimeController,
  renderVacancyController,
  renderPayRateController,
  renderLunchBreakController,
  renderJobTipsController,
} from './jobsUtils'

const calculateHours = (start: Date, end: Date, lunch: number) => {
  const startHours = start.getHours() + start.getMinutes() / 60
  let endHours = end.getHours() + end.getMinutes() / 60

  if (endHours < startHours) {
    endHours += 24
  }

  const lunchBreakHours = lunch ? lunch / 60 : 0
  const totalHours = endHours - startHours - lunchBreakHours

  return parseFloat(totalHours.toFixed(2))
}

const calculateServiceOrder = (
  totalHours: number,
  hourlyRate: number,
  hourlySupervisorFee: number,
  overTimeRateMultiplier: number,
  holidayRateMultiplier: number,
  jobDatesLength: number,
  holidayCount: number,
  vacancy: number,
  adminCosts: number,
  ourFee: number,
  processingFee: number,
) => {
  const overtimeHours = totalHours > 8 ? totalHours - 8 : 0
  const normalHours = totalHours > 8 ? 8 : totalHours

  const overtimeRate = hourlyRate * overTimeRateMultiplier
  const overtimeSupervisorRate = hourlySupervisorFee * overTimeRateMultiplier

  const holidayOvertimeRate = overtimeRate * holidayRateMultiplier

  const totalOvertimeHours =
    overtimeHours * overtimeRate * (jobDatesLength - holidayCount) + overtimeHours * holidayOvertimeRate * holidayCount

  const totalOvertime = totalOvertimeHours * vacancy

  const totalSupervisorNormalFee =
    vacancy >= 6
      ? normalHours * hourlySupervisorFee * (jobDatesLength - holidayCount) +
        normalHours * hourlySupervisorFee * holidayCount
      : 0

  const totalSupervisorOvertimeFee =
    vacancy >= 6 && totalHours > 8
      ? overtimeHours * overtimeSupervisorRate * (jobDatesLength - holidayCount) +
        overtimeHours * holidayOvertimeRate * holidayCount
      : 0

  const newTotalSupervisorFee = totalSupervisorNormalFee + totalSupervisorOvertimeFee

  const normalDayAmount = hourlyRate * vacancy * normalHours * (jobDatesLength - holidayCount)
  const holidayAmount = hourlyRate * holidayRateMultiplier * vacancy * normalHours * holidayCount
  const baseAmount = normalDayAmount + holidayAmount + totalOvertime + newTotalSupervisorFee
  const newPreliminaryPricing = baseAmount * (1 + adminCosts / 100 + ourFee / 100 + processingFee / 100)
  const totalOfAllTempsHours = totalHours * jobDatesLength * vacancy
  const hourlyRateWithFees = newPreliminaryPricing / totalOfAllTempsHours

  const adminCostAmount = (baseAmount * adminCosts) / 100
  const ourFeeAmount = (baseAmount * ourFee) / 100
  const processingFeeAmount = (baseAmount * processingFee) / 100

  const totalEstimatedCost = baseAmount + adminCostAmount + ourFeeAmount + processingFeeAmount

  return {
    normalHours,
    totalOvertimeHours,
    totalOvertime,
    newTotalSupervisorFee,
    hourlyRateWithFees,
    baseAmount,
    adminCostAmount,
    ourFeeAmount,
    processingFeeAmount,
    totalEstimatedCost,
  }
}

export const defaultJobFormValues: JobFormDefaultValues = {
  title: '',
  facility_id: '',
  vacancy: 1,
  hourly_rate: 0,
  job_dates: [],
  start_time: set(new Date(), { hours: 8, minutes: 30, seconds: 0 }),
  end_time: set(new Date(), { hours: 17, minutes: 0, seconds: 0 }),
  lunch_break: 30,
  job_tips: [],
  total_hours: 0,
}

export const AddEditJobPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobFound] = useState<IJob | null>(null)
  const [facilities, setFacilities] = useState<IFacility[]>()
  const [formData] = useState(defaultJobFormValues)
  const [facilityStateSettings, setFacilityStateSettings] = useState<StatesSettingsDocument | null>()

  // Start/End Time States
  const [startTime, setStartTime] = useState<Date | null>(formData.start_time)
  const [endTime, setEndTime] = useState<Date | null>(formData.end_time)
  const [isStartTimeValid, setIsStartTimeValid] = useState(true)
  const [isEndTimeValid, setIsEndTimeValid] = useState(true)

  // Service Order Preview States
  const [minimumWage, setMinimumWage] = useState(0)
  const [totalHours, setTotalHours] = useState(0)
  const [overTimeRateMultiplier, setOverTimeRateMultiplier] = useState(0)
  const [holidayRateMultiplier, setHolidayRateMultiplier] = useState(0)
  const [adminCosts, setAdminCosts] = useState(0)
  const [ourFee, setOurFee] = useState(0)
  const [processingFee, setProcessingFee] = useState(0)
  const [hourlySupervisorFee, setHourlySupervisorFee] = useState(0)
  const [holidayCount, setHolidayCount] = useState(0)
  const [stateHolidays, setStateHolidays] = useState<HolidayDocument[]>([])
  const [serviceOrderCalculations, setServiceOrderCalculations] = useState({
    normalHours: 0,
    totalOvertimeHours: 0,
    totalOvertime: 0,
    newTotalSupervisorFee: 0,
    hourlyRateWithFees: 0,
    baseAmount: 0,
    adminCostAmount: 0,
    ourFeeAmount: 0,
    processingFeeAmount: 0,
    totalEstimatedCost: 0,
  })

  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.includes('/admin')
  const { showToast } = useUtils()
  const user_id = GetTokenInfo()._id

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({ defaultValues: formData })

  const selectedFacilityId = useWatch({ name: 'facility_id', control })
  const selectedFacility = facilities?.find(facility => facility._id === selectedFacilityId)
  const facilityTimezone = selectedFacility?.timezone
  const lunchBreak = useWatch({ name: 'lunch_break', control })
  const vacancy = useWatch({ name: 'vacancy', control })
  const jobDatesLength = useWatch({ name: 'job_dates', control }).length
  const hourlyRate = useWatch({ name: 'hourly_rate', control })

  useEffect(() => {
    if (facilityTimezone) {
      setValue('start_time', toZonedTime(set(new Date(), { hours: 10, minutes: 30, seconds: 0 }), facilityTimezone))
      setValue('end_time', toZonedTime(set(new Date(), { hours: 19, minutes: 0, seconds: 0 }), facilityTimezone))
    }
  }, [facilityTimezone, setValue])

  useEffect(() => {
    if (!facilityStateSettings) return
    setValue('hourly_rate', facilityStateSettings.minimun_wage)
    setMinimumWage(facilityStateSettings?.minimun_wage)
    setOverTimeRateMultiplier(facilityStateSettings?.overtime_rate.overtime_rate)
    setHolidayRateMultiplier(facilityStateSettings?.overtime_rate.holiday_rate)
    setAdminCosts(facilityStateSettings?.admin_costs.total)
    setOurFee(facilityStateSettings?.our_fee)
    setProcessingFee(facilityStateSettings?.processing_fee)
    setHourlySupervisorFee(facilityStateSettings?.supervisor_fee)
    setStateHolidays(facilityStateSettings?.holiday)
  }, [facilityStateSettings, setValue])

  useEffect(() => {
    const getFacilities = async () => {
      setIsLoading(true)
      try {
        const endpoint = location.pathname.includes('admin') ? 'facilities/active' : `facilities/user/${user_id}`
        const response = await requestService({ path: endpoint })
        if (!response.ok) {
          throw new Error('Failed to fetch facilities')
        }
        const allFacilities: IFacility[] = await response.json()
        setFacilities(allFacilities)
      } catch (error) {
        console.error('Error fetching facilities:', error)
      } finally {
        setIsLoading(false)
      }
    }
    getFacilities()
  }, [location.pathname, user_id])

  useEffect(() => {
    const getFacilityStateSettings = async () => {
      const facility = facilities?.find(facility => facility._id === selectedFacilityId)
      if (facility) {
        try {
          const response = await requestService({ path: `settings/${facility.state}` })
          const data = await response.json()
          if (!response.ok) throw new Error(data.message)
          setFacilityStateSettings(data)
        } catch (error) {
          console.error('Error fetching facility state settings:', error)
        }
      }
    }
    getFacilityStateSettings()
  }, [facilities, selectedFacilityId])

  useEffect(() => {
    if (startTime && endTime) {
      const totalHoursCalc = calculateHours(startTime, endTime, lunchBreak)
      setTotalHours(totalHoursCalc)
    }
  }, [startTime, endTime, lunchBreak])

  const jobDates = useWatch({ name: 'job_dates', control })
  jobDates.sort((a, b) => a.getTime() - b.getTime())
  const firstDate = Math.min(...jobDates.map(date => date.getTime()))
  const lastDate = Math.max(...jobDates.map(date => date.getTime()))
  const weeks = eachWeekOfInterval({ start: firstDate, end: lastDate })

  const onSubmit = async (data: JobFormDefaultValues) => {
    setIsSubmitting(true)

    const requestDataForWeeks: {
      job_dates: Date[]
      title: string
      facility_id?: string
      vacancy: number
      hourly_rate: number
      start_time: Date
      end_time: Date
      lunch_break: number
      job_tips: string[]
      created_by?: string
      total_hours: number
    }[] = []

    let requestData

    if (facilityTimezone && startTime && endTime) {
      const utcStartTime = fromZonedTime(startTime, facilityTimezone)
      const utcEndTime = fromZonedTime(endTime, facilityTimezone)

      requestData = {
        ...data,
        start_time: utcStartTime,
        end_time: utcEndTime,
      }

      for (const week of weeks) {
        const startOfWeekDate = startOfWeek(week)
        const endOfWeekDate = endOfWeek(week)
        const job_dates_in_week = jobDates.filter(date =>
          isWithinInterval(date, { start: startOfWeekDate, end: endOfWeekDate }),
        )

        const utcJobDatesInWeek = job_dates_in_week.map(date => {
          const dateWithoutTime = date.toISOString().split('T')[0]
          return fromZonedTime(dateWithoutTime, facilityTimezone)
        })

        const requestDataForWeek = {
          ...requestData,
          job_dates: utcJobDatesInWeek,
          total_hours: totalHours,
        }
        requestDataForWeeks.push(requestDataForWeek)
      }
    }

    if (startTime && endTime && facilityTimezone && data.lunch_break != null && requestData != null) {
      const totalHours = calculateHours(startTime, endTime, data.lunch_break)

      requestData.total_hours = totalHours
      setTotalHours(totalHours)

      if (requestData.total_hours < 7) {
        showToast({
          severity: 'error',
          summary: 'Error',
          detail: 'The total working hours must be at least 7 hours for a job to be successfully created.',
        })
        return
      }
    } else {
      showToast({
        severity: 'error',
        summary: 'Error',
        detail: 'Start time, end time, and lunch break must be provided.',
      })
      return
    }

    try {
      let errorOccurred = false
      for (const requestDataForWeek of requestDataForWeeks) {
        const jobDatesLength = requestDataForWeek.job_dates.length
        const holidayCount = requestDataForWeek.job_dates.reduce((count, date) => {
          const isHoliday = stateHolidays.some(
            holiday => new Date(holiday.holiday_date).toLocaleDateString() === date.toLocaleDateString(),
          )
          return isHoliday ? count + 1 : count
        }, 0)

        const serviceOrderCalculations = calculateServiceOrder(
          totalHours,
          hourlyRate,
          hourlySupervisorFee,
          overTimeRateMultiplier,
          holidayRateMultiplier,
          jobDatesLength,
          holidayCount,
          vacancy,
          adminCosts,
          ourFee,
          processingFee,
        )

        const details = {
          temp_pay_rate: Math.round(hourlyRate * 100) / 100,
          number_of_vacancies: vacancy,
          number_of_selected_working_days: jobDatesLength,
          number_of_holidays: holidayCount,
          supervisor_fees: Math.round(serviceOrderCalculations.newTotalSupervisorFee * 100) / 100,
          total_overtime_fees: Math.round(serviceOrderCalculations.totalOvertime * 100) / 100,
          total_hours_per_day: Math.round(totalHours * 100) / 100,
          total_of_all_temps_hours: Math.round(totalHours * jobDatesLength * vacancy * 100) / 100,
          total_base_amount: Math.round(serviceOrderCalculations.baseAmount * 100) / 100,
          admin_costs_total: Math.round(serviceOrderCalculations.adminCostAmount * 100) / 100,
          our_fee_total: Math.round(serviceOrderCalculations.ourFeeAmount * 100) / 100,
          processing_fee_total: Math.round(serviceOrderCalculations.processingFeeAmount * 100) / 100,
          estimated_total_per_hour: Math.round(serviceOrderCalculations.hourlyRateWithFees * 100) / 100,
          total_cost: Math.round(serviceOrderCalculations.totalEstimatedCost * 100) / 100,
        }

        const response = await requestService({
          path: 'jobs/create-service-order',
          method: 'POST',
          body: JSON.stringify({
            ...requestDataForWeek,
            details: details,
          }),
        })

        if (response.ok) {
          showToast({
            severity: 'success',
            summary: 'Success',
            detail: `${requestDataForWeek.title} job ${isAdmin ? 'created' : 'submitted'} successfully`,
          })
          setTimeout(() => {
            navigate(isAdmin ? `/admin/jobs/service-orders/pending` : `/client/jobs/service-orders/pending`)
          }, 2000)
        }

        if (!response.ok && !errorOccurred) {
          const data = await response.json()
          const message = data.message instanceof Error ? data.message.message : data.message
          showToast({ severity: 'error', summary: 'Error', detail: message })
          errorOccurred = true
          continue
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error
      console.error('Error submitting job information:', errorMessage)
      showToast({ severity: 'error', summary: 'Error', detail: 'Failed to submit job information' })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const serviceOrderCalculations = calculateServiceOrder(
      totalHours,
      hourlyRate,
      hourlySupervisorFee,
      overTimeRateMultiplier,
      holidayRateMultiplier,
      jobDatesLength,
      holidayCount,
      vacancy,
      adminCosts,
      ourFee,
      processingFee,
    )

    setServiceOrderCalculations(serviceOrderCalculations)
  }, [
    adminCosts,
    holidayCount,
    holidayRateMultiplier,
    hourlyRate,
    hourlySupervisorFee,
    jobDatesLength,
    ourFee,
    overTimeRateMultiplier,
    processingFee,
    totalHours,
    vacancy,
  ])

  const renderPricingTable = () => {
    return (
      <div className="sm:col-span-3">
        <div className="flex flex-col space-y-2 rounded-md border border-gray-300 p-4">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Service Order Preview</h3>
          <ul className="list-none space-y-1">
            <li>
              <span className="text-sm font-medium leading-5 text-gray-600">Temp Pay Rate: </span>
              <span className="text-sm leading-5 text-gray-900">${hourlyRate.toFixed(2)}</span>
            </li>
            <li>
              <span className="text-sm font-medium leading-5 text-gray-600">Number Of Vacancies: </span>
              <span className="text-sm leading-5 text-gray-900">{vacancy}</span>
            </li>
            <li>
              <span className="text-sm font-medium leading-5 text-gray-600">Number Of Selected Working Days: </span>
              <span className="text-sm leading-5 text-gray-900">{jobDatesLength}</span>
            </li>

            {holidayCount > 0 ? (
              <li>
                <div className="flex items-center">
                  <span className="mr-1 text-sm font-medium leading-5 text-gray-600">Number Of Holidays: </span>
                  <span className="mr-2 text-sm leading-5 text-gray-900">{holidayCount}</span>
                  <HtInfoTooltip message="Avoid extra holiday rates by selecting regular days in the calendar instead." />
                </div>
              </li>
            ) : null}

            {vacancy >= 6 ? (
              <li>
                <span className="text-sm font-medium leading-5 text-gray-600">Supervisor Fees: </span>
                <span className="text-sm leading-5 text-gray-900">
                  ${serviceOrderCalculations.newTotalSupervisorFee.toFixed(2)}
                </span>
              </li>
            ) : null}

            {totalHours > 8 ? (
              <li>
                <div className="flex items-center">
                  <span className="mr-1 text-sm font-medium leading-5 text-gray-600">Total Overtime Fees: </span>
                  <span className="mr-2 text-sm leading-5 text-gray-900">
                    ${serviceOrderCalculations.totalOvertime.toFixed(2)}
                  </span>
                  <HtInfoTooltip message="Avoid overtime by extending days or reducing hours below 8hrs." />
                </div>
              </li>
            ) : null}

            <li>
              <span className="text-sm font-medium leading-5 text-gray-600">Total Hours Per Day: </span>
              <span className="text-sm leading-5 text-gray-900">{totalHours.toFixed(2)}</span>
            </li>
            <li>
              <span className="text-sm font-medium leading-5 text-gray-600">Total of All Temps Hours: </span>
              <span className="text-sm leading-5 text-gray-900">
                {(totalHours * jobDatesLength * vacancy).toFixed(2)}
              </span>
            </li>
            <li>
              <span className="text-sm font-medium leading-5 text-gray-600">Total Base Amount: </span>
              <span className="text-sm leading-5 text-gray-900">${serviceOrderCalculations.baseAmount.toFixed(2)}</span>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mr-1 text-sm font-medium leading-5 text-gray-600">Admin Costs: </span>
                <span className="mr-2 text-sm leading-5 text-gray-900">
                  ${serviceOrderCalculations.adminCostAmount.toFixed(2)}
                </span>
                <HtInfoTooltip message="Employer tax payments, fringe benefits, recruiting and hiring costs, training and orientation, termination costs, administrative costs, healthcare, and all employer responsibilities for insurance. This ensures comprehensive employment management and legal compliance." />
              </div>
            </li>
            <li>
              <span className="text-sm font-medium leading-5 text-gray-600">Our Fee: </span>
              <span className="text-sm leading-5 text-gray-900">
                ${serviceOrderCalculations.ourFeeAmount.toFixed(2)}
              </span>
            </li>
            <li>
              <span className="text-sm font-medium leading-5 text-gray-600">Processing Fee: </span>
              <span className="text-sm leading-5 text-gray-900">
                ${serviceOrderCalculations.processingFeeAmount.toFixed(2)}
              </span>
            </li>

            {serviceOrderCalculations.totalEstimatedCost !== 0 ? (
              <li>
                <span className="text-sm font-medium leading-5 text-gray-600">
                  Estimated total Per Hour (fees Included)
                </span>
                <span className="text-sm leading-5 text-gray-900">
                  ${serviceOrderCalculations.hourlyRateWithFees.toFixed(2)}
                </span>
              </li>
            ) : null}
            <li className="font-medium leading-tight text-gray-900">
              <span className="text-sm">Total Estimated Cost (fees Included): </span>
              <span className="text-sm font-semibold">${serviceOrderCalculations.totalEstimatedCost.toFixed(2)}</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <HTLoadingLogo />
  }

  return (
    <>
      {jobFound ? <HeadingComponent title="Edit the job" /> : null}
      <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
        <div className="space-y-12">
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Job Title and Facility</h2>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                Please take a moment to provide the essential information for the job posting. We require you to specify
                the job title and provide a facility this job pertains to.
              </p>
              {requiredFieldsNoticeText}
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">{renderJobTitleController(control, errors)}</div>
              {facilities ? (
                <div className="sm:col-span-3">{renderFacilityController(control, errors, facilities, !!jobFound)}</div>
              ) : null}
            </div>
          </div>

          {selectedFacility ? (
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Job Dates</h2>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  Please select the dates you need temps at your facility. You can select one or multiple dates.
                </p>
                {requiredFieldsNoticeText}
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
                <div className="sm:col-span-5">
                  {renderJobDatesController(control, errors, stateHolidays, setHolidayCount)}
                </div>
              </div>
            </div>
          ) : null}
          {/* Job Dates */}
        </div>

        {selectedFacility ? (
          <>
            {/* Shift Details */}
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Hours, Temps and Rates</h2>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  Please select a start and end time, the length of the lunch breaks, and number of temps needed. Please
                  select the pay rate you are choosing to list your job.
                </p>
                {requiredFieldsNoticeText}
                {totalHours !== 0 ? (
                  <div className="mt-10">
                    <div
                      className={`text-base font-semibold leading-7 ${totalHours < 7 ? 'text-red-500' : 'text-gray-900'}`}>
                      Total Hours: {totalHours}
                    </div>
                    <small className="text-gray-500">
                      (Should be a minimum of 7 hours to successfully create a job)
                    </small>
                  </div>
                ) : null}
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
                {startTime ? (
                  <div className="sm:col-span-3">
                    {renderStartTimeController(
                      control,
                      errors,
                      startTime,
                      setStartTime,
                      isStartTimeValid,
                      setIsStartTimeValid,
                      facilityTimezone ?? '',
                    )}
                  </div>
                ) : null}

                {endTime ? (
                  <div className="sm:col-span-3">
                    {renderEndTimeController(
                      control,
                      errors,
                      endTime,
                      setEndTime,
                      isEndTimeValid,
                      setIsEndTimeValid,
                      facilityTimezone ?? '',
                    )}
                  </div>
                ) : null}

                <div className="sm:col-span-3">{renderVacancyController(control, errors)}</div>

                <div className="sm:col-span-3">{renderPayRateController(control, errors, minimumWage)}</div>

                <div className="sm:col-span-3">{renderLunchBreakController(control, errors)}</div>

                <div className="sm:col-span-3">{renderPricingTable()}</div>

                <div className="sm:col-span-6 sm:col-start-1">{renderJobTipsController(control, errors)}</div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <div>
                <Button type="submit" label="Submit" loading={isSubmitting} />
              </div>
            </div>
          </>
        ) : null}
      </form>
    </>
  )
}
