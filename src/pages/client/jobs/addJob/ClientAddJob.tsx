import { useEffect, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import { TitleComponent } from '../../../../components/shared/general/TitleComponent'
import { type IFacility } from '../../../../interfaces/Facility'
import { RequestService } from '../../../../services/RequestService'
import { useSettings } from '../../../../store/useSettings'
import { useUtils } from '../../../../store/useUtils'
import { requiredFieldsNoticeText } from '../../../../utils/formUtils'
import { GetTokenInfo } from '../../../../utils/tokenUtil'
import {
  type JobFormDefaultValues,
  renderFacilityController,
  renderJobDatesController,
  renderJobTitleController,
  renderStartTimeController,
  renderEndTimeController,
  renderVacancyController,
  renderPayRateController,
  renderJobTipsController,
  renderLunchBreakController,
  defaultJobFormValues,
} from '../jobsUtils'

let defaultValues = defaultJobFormValues

export const ClientAddJob = () => {
  const [startTime, setStartTime] = useState<Date | null>(defaultValues.start_time)
  const [endTime, setEndTime] = useState<Date | null>(defaultValues.end_time)
  const [totalHours, setTotalHours] = useState(0)
  const user = GetTokenInfo()
  const id = user?._id
  const toast = useRef<Toast>(null)
  const { showToast } = useUtils()
  const [facilities, setFacilities] = useState<IFacility[]>()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.includes('/admin')
  const { settings } = useSettings()

  if (isAdmin) {
    defaultValues = { ...defaultValues, created_by: '', hourly_rate: (settings?.minimun_wage as number) || 0 }
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({ defaultValues })

  useEffect(() => {
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
    <>
      <TitleComponent title="Add a new job" />
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
                <div className="sm:col-span-3">{renderFacilityController(control, errors, facilities)}</div>
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
              <div className="sm:col-span-3">{renderStartTimeController(control, errors, startTime, setStartTime)}</div>
            ) : null}

            {endTime ? (
              <div className="sm:col-span-3">{renderEndTimeController(control, errors, endTime, setEndTime)}</div>
            ) : null}

            <div className="sm:col-span-3">{renderVacancyController(control, errors)}</div>

            <div className="sm:col-span-3">{renderPayRateController(control, errors)}</div>

            <div className="sm:col-span-3">{renderJobTipsController(control, errors)}</div>

            <div className="sm:col-span-3">{renderLunchBreakController(control, errors)}</div>
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
