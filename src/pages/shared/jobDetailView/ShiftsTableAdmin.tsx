import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

import { Button } from 'primereact/button'
import { Chip } from 'primereact/chip'

import { type IApplicant, type IJob } from '../../../interfaces/job'
import { type UserShiftsPopulate } from '../../../interfaces/shifts'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { roleChecker } from '../../../utils/roleChecker'
import { EmployeeOptions } from './EmployeeOptions'

interface IShiftTableAdminProps {
  job: IJob
  setJob: Dispatch<SetStateAction<IJob | null>>
}

export const ShiftsTableAdmin = ({ job, setJob }: IShiftTableAdminProps) => {
  const [potentialApplicants, setPotentialApplicants] = useState<IApplicant[]>([])
  const { showToast } = useUtils()

  const role = roleChecker()

  useEffect(() => {
    const getPotentialApplicants = async () => {
      try {
        const response = await requestService({ path: `jobs/${job._id}/get-potential-applicants` })
        if (response.status === 200) {
          const jsonResponse = await response.json()
          setPotentialApplicants(jsonResponse)
        }
      } catch (error) {
        console.error('Error fetching potential applicants', error)
      }
    }
    if (role === 'admin') {
      getPotentialApplicants()
    }
  }, [job._id, role])

  function getEmployeeListByShift(dateString: string): UserShiftsPopulate[] {
    const [month, day, year] = dateString.split('/')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const formattedDate = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    const result = job?.job_days.find(jobDay => {
      const jobDate = new Date(jobDay.day)
      const formattedJobDate = jobDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      return formattedJobDate === formattedDate
    })
    if (result?.shifts_id.user_shifts) return result.shifts_id.user_shifts as unknown as UserShiftsPopulate[]
    return []
  }

  function getShiftByDate(dateString: string): string {
    const [month, day, year] = dateString.split('/')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const formattedDate = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    const result = job?.job_days.find(jobDay => {
      const jobDate = new Date(jobDay.day)
      const formattedJobDate = jobDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      return formattedJobDate === formattedDate
    })
    return result?.shifts_id._id as string
  }

  function getUserShiftsLengthByDate(dateString: string): number {
    const [month, day, year] = dateString.split('/')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const formattedDate = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    const result = job?.job_days.find(jobDay => {
      const jobDate = new Date(jobDay.day)
      const formattedJobDate = jobDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      return formattedJobDate === formattedDate
    })
    if (!result) return 0

    return result.shifts_id?.user_shifts?.length ?? 0
  }

  const removeEmployeeShift = async (userShiftId: string, shiftId: string) => {
    try {
      const response = await requestService({
        path: `shifts/drop/${shiftId}`,
        method: 'PATCH',
        body: JSON.stringify({ userShiftId }),
      })
      const data = await response.json()
      if (response.ok) {
        setJob(data)
        showToast({
          severity: 'success',
          summary: 'Employee removed',
          detail: 'Employee has been removed from the shift',
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleJobStatus = async (is_active: boolean, summary: string, detail: string) => {
    try {
      const requestData = { is_active: is_active }
      const response = await requestService({
        path: `jobs/${job._id}`,
        method: 'PATCH',
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const data = await response.json()
        setJob({ ...data })
        showToast({ severity: 'success', summary: summary, detail: detail })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className="mt-12">
      <h2 className="text-base font-semibold leading-6 text-gray-900">Schedule ({job.job_dates.length} days)</h2>
      <ol className="mt-2 divide-y divide-gray-200 text-base leading-6 ">
        {job.job_dates.map((date: string, index: number) => {
          const dateObj = new Date(date)
          const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
          const formattedDate = dateObj.toLocaleDateString()
          return (
            <li key={index} className="py-4 sm:flex">
              <time dateTime={date} className="w-28 flex-none">
                {dayOfWeek}, {formattedDate}
              </time>
              <div className="flex flex-1 flex-col">
                <div className="flex flex-wrap items-center justify-start gap-1">
                  {getEmployeeListByShift(formattedDate).map((userShift: UserShiftsPopulate) => {
                    return (
                      // <Tag key={userShift._id} value={userShift.user_id.first_name} className="mr-2" />
                      <Chip
                        key={userShift._id}
                        label={userShift.user_id.first_name}
                        className="mr-2 bg-green-600 text-white hover:bg-red-600 hover:font-medium"
                        removable
                        onRemove={() => removeEmployeeShift(userShift._id, getShiftByDate(formattedDate))}
                      />
                    )
                  })}
                </div>
              </div>
              {getUserShiftsLengthByDate(formattedDate) === job.vacancy ? (
                <p className="text-end text-green-500 md:text-start">Vacancy completed</p>
              ) : (
                <EmployeeOptions
                  potentialApplicants={potentialApplicants}
                  shiftId={getShiftByDate(formattedDate)}
                  setJob={setJob}
                  jobId={job._id}
                />
              )}
            </li>
          )
        })}
      </ol>
      {!job?.is_active ? (
        <Button
          className="w-full"
          label="Reopen Job"
          severity="secondary"
          onClick={() => handleJobStatus(true, 'Job Reopened', 'Job has been reopened')}
        />
      ) : (
        <Button
          className="w-full"
          label="Close Job"
          severity="danger"
          onClick={() => handleJobStatus(false, 'Job Closed', 'Job has been closed')}
        />
      )}
    </section>
  )
}
