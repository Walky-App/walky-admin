import { useEffect, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { parseISO } from 'date-fns'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import { HeadingComponent } from '../../../../components/shared/general/HeadingComponent'
import { type IFacility } from '../../../../interfaces/Facility'
import { type IJob } from '../../../../interfaces/job'
import { RequestService } from '../../../../services/RequestService'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { requiredFieldsNoticeText } from '../../../../utils/formUtils'
import { roleChecker } from '../../../../utils/roleChecker'
import { GetTokenInfo } from '../../../../utils/tokenUtil'
import {
  type JobFormDefaultValues,
  defaultJobFormValues,
  renderJobTitleController,
  renderJobDatesController,
  renderEndTimeController,
  renderJobTipsController,
  renderLunchBreakController,
  renderPayRateController,
  renderStartTimeController,
  renderVacancyController,
  renderFacilityController,
} from '../jobsUtils'

const defaultValues = defaultJobFormValues

export const ClientEditJob = () => {
  const [facilities, setFacilities] = useState<IFacility[]>()
  const [jobFound, setJobFound] = useState<IJob | null>(null)
  const [formData, setFormData] = useState(defaultJobFormValues)
  const [startTime, setStartTime] = useState<Date | null>(defaultValues.start_time)
  const [endTime, setEndTime] = useState<Date | null>(defaultValues.end_time)
  const [isStartTimeValid, setIsStartTimeValid] = useState(true)
  const [isEndTimeValid, setIsEndTimeValid] = useState(true)
  const [totalHours, setTotalHours] = useState(0)
  const params = useParams()
  const toast = useRef<Toast>(null)
  const { showToast } = useUtils()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.includes('/admin')
  const role = roleChecker()
  const user_id = GetTokenInfo()._id

  useEffect(() => {
    const getFacilities = async () => {
      try {
        const endpoint = location.pathname.includes('admin') ? 'facilities' : `facilities/byclient/${user_id}`
        const allFacilities = await RequestService(endpoint)
        setFacilities(allFacilities)
      } catch (error) {
        console.error('Error fetching facilities:', error)
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
        console.error(error)
      }
    }

    if (facilities && facilities.length > 0) {
      getJob()
    }
  }, [params.id, facilities])

  const values = formData != null ? formData : defaultValues

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({ values })

  const lunchBreak = watch('lunch_break')

  useEffect(() => {
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
    if (jobFound != null) {
      const { job_dates } = jobFound

      const jobDates = job_dates.map((dateString: string) => new Date(dateString))

      const earliestJobDate = jobDates.sort((a, b) => a.getTime() - b.getTime())[0]

      const now = new Date()
      const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      const isWithin24Hours = earliestJobDate != null && earliestJobDate.getTime() <= twentyFourHoursFromNow.getTime()
      if (role === 'client' && isWithin24Hours) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'You cannot edit a job within 24 hours of its start time.',
        })
        return
      }
    }

    try {
      let requestData = { ...data }

      // Calculating total hours and sending with payload
      if (startTime && endTime && data.lunch_break !== null) {
        const startHours = startTime.getHours() + startTime.getMinutes() / 60
        let endHours = endTime.getHours() + endTime.getMinutes() / 60

        if (endHours <= startHours) {
          endHours += 24
        }
        const lunchBreakHours = data.lunch_break / 60
        const totalHours = endHours - startHours - lunchBreakHours

        const formattedTotalHours = Math.round(totalHours * 100) / 100

        setTotalHours(formattedTotalHours)
        if (formattedTotalHours < 7) {
          showToast({
            severity: 'error',
            summary: 'Error',
            detail: 'The total working hours must be at least 7 hours for a job to be successfully created.',
          })
          return
        }
        requestData = { ...requestData, total_hours: formattedTotalHours }
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

  return (
    <>
      <HeadingComponent title="Edit the job" />
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
              {requiredFieldsNoticeText}
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">{renderJobTitleController(control, errors)}</div>
              {facilities ? (
                <div className="sm:col-span-3">{renderFacilityController(control, errors, facilities, true)}</div>
              ) : null}
            </div>
          </div>
          {/* Job Dates */}
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Job Dates</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
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
            <p className="mt-1 text-sm leading-6 text-gray-600">
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

            <div className="sm:col-span-3">{renderLunchBreakController(control, errors)}</div>

            <div className="sm:col-span-3">{renderPayRateController(control, errors)}</div>

            <div className="sm:col-span-6 sm:col-start-1">{renderJobTipsController(control, errors)}</div>
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
