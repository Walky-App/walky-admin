import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { parseISO } from 'date-fns'
import { Button } from 'primereact/button'

import { type IFacility } from '../../../interfaces/facility'
import { type IJob } from '../../../interfaces/job'
import { requestService } from '../../../services/requestServiceNew'
import { useSettings } from '../../../store/useSettings'
import { useUtils } from '../../../store/useUtils'
import { requiredFieldsNoticeText } from '../../../utils/formUtils'
import { roleChecker } from '../../../utils/roleChecker'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import { HTLoadingLogo } from '../HTLoadingLogo'
import { HeadingComponent } from '../general/HeadingComponent'
import {
  defaultJobFormValues,
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

let defaultValues = defaultJobFormValues

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

export const AddEditJobPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobFound, setJobFound] = useState<IJob | null>(null)
  const [facilities, setFacilities] = useState<IFacility[]>()
  const [formData, setFormData] = useState(defaultJobFormValues)
  const [startTime, setStartTime] = useState<Date | null>(defaultValues.start_time)
  const [endTime, setEndTime] = useState<Date | null>(defaultValues.end_time)
  const [isStartTimeValid, setIsStartTimeValid] = useState(true)
  const [isEndTimeValid, setIsEndTimeValid] = useState(true)
  const [totalHours, setTotalHours] = useState(0)

  const { showToast } = useUtils()
  const { settings } = useSettings()

  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()
  const isAdmin = location.pathname.includes('/admin')

  const role = roleChecker()
  const user_id = GetTokenInfo()._id

  if (isAdmin) {
    defaultValues = { ...defaultValues, hourly_rate: (settings?.minimun_wage as number) || 0 }
  }

  const values = formData != null && params.id != null ? formData : defaultValues

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({ values })

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
    const getJob = async () => {
      try {
        const response = await requestService({ path: `jobs/${params.id}` })

        if (!response.ok) {
          throw new Error('Failed to fetch job')
        }
        const job: IJob = await response.json()
        setJobFound(job)

        if (facilities && facilities.length > 0) {
          setFormData({
            ...defaultValues,
            title: job.title,
            facility_id: facilities.find(facility => facility._id === job.facility._id)?._id ?? '',
            job_dates: job.job_dates.map((dateString: string) => parseISO(dateString)),
            start_time: new Date(job.start_time),
            end_time: new Date(job.end_time),
            total_hours: job.total_hours,
            lunch_break: job.lunch_break,
            vacancy: job.vacancy,
            hourly_rate: job.hourly_rate,
            job_tips: job.job_tips,
          })
        }
      } catch (error) {
        console.error('Error fetching job:', error)
      }
    }

    if (facilities && facilities.length > 0) {
      getJob()
    }
  }, [params.id, facilities])

  const lunchBreak = watch('lunch_break')

  useEffect(() => {
    if (startTime && endTime) {
      const totalHoursCalc = calculateHours(startTime, endTime, lunchBreak)
      setTotalHours(totalHoursCalc)
    }
  }, [startTime, endTime, lunchBreak])

  const onSubmit = async (data: JobFormDefaultValues) => {
    setIsSubmitting(true)

    const requestData = { ...data }

    if (startTime && endTime && data.lunch_break != null) {
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

    if (jobFound != null) {
      const { job_dates } = jobFound

      const jobDates = job_dates.map((dateString: string) => new Date(dateString))

      const earliestJobDate = jobDates.sort((a, b) => a.getTime() - b.getTime())[0]

      const now = new Date()
      const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      const isWithin24Hours = earliestJobDate != null && earliestJobDate.getTime() <= twentyFourHoursFromNow.getTime()
      if (role === 'client' && isWithin24Hours) {
        showToast({
          severity: 'error',
          summary: 'Error',
          detail: 'You cannot edit a job within 24 hours of its start time.',
        })
        return
      }

      try {
        const response = await requestService({
          path: `jobs/${params.id}`,
          method: 'PATCH',
          body: JSON.stringify(requestData),
        })
        if (!response.ok) {
          const message = await response.text()
          throw new Error(message)
        }
        showToast({ severity: 'success', summary: 'Success', detail: `${requestData.title} updated successfully` })
        setTimeout(() => {
          navigate(isAdmin ? `/admin/jobs/${params.id}` : `/client/jobs/${params.id}`)
        }, 3000)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : error
        console.error('Error updating job:', errorMessage)
        showToast({ severity: 'error', summary: 'Error', detail: 'Failed to update job' })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      try {
        const response = await requestService({ path: 'jobs', method: 'POST', body: JSON.stringify(requestData) })
        if (!response.ok) {
          const message = await response.text()
          throw new Error(message)
        }

        showToast({
          severity: 'success',
          summary: 'Success',
          detail: `${requestData.title} job ${isAdmin ? 'created' : 'submitted'} successfully`,
        })
        navigate(isAdmin ? '/admin/jobs' : '/client/jobs')
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : error
        console.error('Error submitting job information:', errorMessage)
        showToast({ severity: 'error', summary: 'Error', detail: 'Failed to submit job information' })
      } finally {
        setIsSubmitting(false)
      }
    }
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
                <div className="sm:col-span-3">
                  {renderFacilityController(control, errors, facilities, setValue, !!jobFound)}
                </div>
              ) : null}
            </div>
          </div>
          {/* Job Dates */}
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Job Dates</h2>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                Please select the dates you need temps at your facility. You can select one or multiple dates.
              </p>
              {requiredFieldsNoticeText}
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-5">{renderJobDatesController(control, errors)}</div>
            </div>
          </div>
        </div>

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
                <small className="text-gray-500">(Should be a minimum of 7 hours to successfully create a job)</small>
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
                )}
              </div>
            ) : null}

            {endTime ? (
              <div className="sm:col-span-3">
                {renderEndTimeController(control, errors, endTime, setEndTime, isEndTimeValid, setIsEndTimeValid)}
              </div>
            ) : null}

            <div className="sm:col-span-3">{renderVacancyController(control, errors)}</div>

            <div className="sm:col-span-3">{renderPayRateController(control, errors)}</div>

            <div className="sm:col-span-3">{renderLunchBreakController(control, errors)}</div>

            <div className="sm:col-span-6 sm:col-start-1">{renderJobTipsController(control, errors)}</div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <div>
            <Button type="submit" label="Submit" loading={isSubmitting} />
          </div>
        </div>
      </form>
    </>
  )
}
